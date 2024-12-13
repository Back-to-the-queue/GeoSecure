// Login.js

const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const util = require('../routes/util');
const auth = require('../routes/auth');
const User = require('./User');

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
    // First, attempt to retrieve the user from DynamoDB
    const dynamoUser = await getUserFromDynamoDB(username.toLowerCase().trim());
    let userInfo;

    if (dynamoUser && dynamoUser.username) {
      // User found in DynamoDB
      const isPasswordMatch = await bcrypt.compare(password, dynamoUser.password);
      if (!isPasswordMatch) {
        return util.buildResponse(403, { message: 'Invalid username or password' });
      }
      userInfo = { username: dynamoUser.username, name: dynamoUser.name };
    } else {
      // If not found in DynamoDB, check MongoDB
      const mongoUser = await User.findOne({ username: username.toLowerCase().trim() });
      if (!mongoUser) {
        return util.buildResponse(403, { message: 'Invalid username or password' });
      }

      // Check if the password matches in MongoDB
      const isPasswordMatch = await bcrypt.compare(password, mongoUser.password);
      if (!isPasswordMatch) {
        return util.buildResponse(403, { message: 'Invalid username or password' });
      }
      userInfo = { username: mongoUser.username, name: mongoUser.name };
    }

    // Generate token for authenticated user
    const token = auth.generateToken(userInfo);

    return util.buildResponse(200, { user: userInfo, token: token });
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