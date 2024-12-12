const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const util = require('../routes/util');
const saltRounds = 10;

AWS.config.update({
  region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'geo-users';

const register = async (registerBody) => {
  const { name, email, username, password, role } = registerBody;

  if (!username || !name || !email || !password || !role) {
    return util.buildResponse(401, { message: 'All fields are required' });
  }

  const validRoles = ['driver', 'admin'];
  if (!validRoles.includes(role.toLowerCase())) {
    return util.buildResponse(400, { message: 'Invalid role provided' });
  }

  try {
    // Check if the username already exists in DynamoDB
    const existingUser = await getUser(username.toLowerCase().trim());
    if (existingUser) {
      return util.buildResponse(401, { message: 'Username already exists, please choose another username' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);

    // Create new user object for DynamoDB
    const dynamoUser = {
      name: name,
      email: email,
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      role: role.toLowerCase(),
    };

    // Save user to DynamoDB
    const saveUserResponse = await saveUser(dynamoUser);
    if (!saveUserResponse) {
      return util.buildResponse(503, { message: 'Server error saving user, please try again later.' });
    }

    return util.buildResponse(200, { message: 'User registered successfully', username: username });
  } catch (error) {
    console.error('Error registering user:', error);
    return util.buildResponse(500, { message: 'Internal server error' });
  }
};

// Get user from DynamoDB
async function getUser(username) {
  const params = {
    TableName: userTable,
    Key: { username }
  };

  try {
    const response = await dynamodb.get(params).promise();
    return response.Item;
  } catch (error) {
    console.error('Error getting user from DynamoDB:', error);
    return null;
  }
}

// Save user to DynamoDB
async function saveUser(user) {
  const params = {
    TableName: userTable,
    Item: user
  };

  try {
    await dynamodb.put(params).promise();
    return true;
  } catch (error) {
    console.error('Error saving user to DynamoDB:', error);
    return false;
  }
}

module.exports = { register };
