const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const util = require('../routes/util');
const auth = require('../routes/auth');

AWS.config.update({
  region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'geo-users';

const login = async (loginBody) => {
  const { username, password } = loginBody;

  if (!username || !password) {
    return util.buildResponse(401, { message: 'Username and password are required' });
  }

  try {
    // Retrieve the user from DynamoDB
    const dynamoUser = await getUserFromDynamoDB(username.toLowerCase().trim());
    if (!dynamoUser || !dynamoUser.username) {
      return util.buildResponse(403, { message: 'Invalid username or password' });
    }

    // Validate password
    const isPasswordMatch = await bcrypt.compare(password, dynamoUser.password);
    if (!isPasswordMatch) {
      return util.buildResponse(403, { message: 'Invalid username or password' });
    }

    // Prepare user info
    const userInfo = {
      username: dynamoUser.username,
      role: dynamoUser.role || 'driver',
    };

    // Generate token
    const token = auth.generateToken(userInfo);

    return util.buildResponse(200, {
      user: { username: userInfo.username, role: userInfo.role },
      token: token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return util.buildResponse(500, { message: 'Internal server error' });
  }
};

// Retrieve user from DynamoDB
async function getUserFromDynamoDB(username) {
  const params = {
    TableName: userTable,
    Key: { username }
  };

  try {
    const response = await dynamodb.get(params).promise();
    return response.Item;
  } catch (error) {
    console.error('Error retrieving user from DynamoDB:', error);
    return null;
  }
}

module.exports = { login };
