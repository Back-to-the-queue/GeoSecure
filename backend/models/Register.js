const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const util = require('../routes/util');
const User = require('./User');
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
    const existingUserDynamo = await getUser(username.toLowerCase().trim());
    if (existingUserDynamo) {
      return util.buildResponse(401, { message: 'Username already exists in DynamoDB, please choose another username' });
    }

    // Check if the username already exists in MongoDB
    const existingUserMongo = await User.findOne({ username: username.toLowerCase().trim() });
    if (existingUserMongo) {
      return util.buildResponse(401, { message: 'Username already exists in MongoDB, please choose another username' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);

    // Create new user object for DynamoDB
    const dynamoUser = {
      name: name,
      email: email,
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      role: role.toLowerCase()
    };
    const saveUserDynamoResponse = await saveUser(dynamoUser);
    if (!saveUserDynamoResponse) {
      return util.buildResponse(503, { message: 'Server error saving to DynamoDB, please try again later.' });
    }

    // Create and save the new user in MongoDB
    const mongoUser = new User({
      name: name,
      email: email,
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      role: role.toLowerCase
    });
    await mongoUser.save();

    return util.buildResponse(200, { message: 'User registered successfully in both DynamoDB and MongoDB', username: username });
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
