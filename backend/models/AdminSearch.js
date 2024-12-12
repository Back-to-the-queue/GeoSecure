const AWS = require('aws-sdk');
const util = require('../routes/util');
const User = require('./User'); // MongoDB User model

AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'geo-users';

/**
 * Search for users by a partial username or email in both DynamoDB and MongoDB.
 */
const searchUsers = async (searchBody) => {
  const { query } = searchBody;

  if (!query) {
    return util.buildResponse(400, { message: 'Search query is required' });
  }

  try {
    // Search DynamoDB
    const dynamoUsers = await searchDynamoDB(query);

    // Search MongoDB
    const mongoUsers = await searchMongoDB(query);

    // Combine and remove duplicates based on `username`
    const allUsers = mergeResults(dynamoUsers, mongoUsers);

    return util.buildResponse(200, { users: allUsers });
  } catch (error) {
    console.error('Error searching users:', error);
    return util.buildResponse(500, { message: 'Internal server error' });
  }
};

// Search DynamoDB for users
const searchDynamoDB = async (query) => {
  const params = {
    TableName: userTable,
    FilterExpression: 'contains(#username, :query) OR contains(#email, :query)',
    ExpressionAttributeNames: {
      '#username': 'username',
      '#email': 'email',
    },
    ExpressionAttributeValues: {
      ':query': query.toLowerCase(),
    },
  };

  try {
    const result = await dynamodb.scan(params).promise();
    return result.Items || [];
  } catch (error) {
    console.error('Error searching DynamoDB:', error);
    return [];
  }
};

// Search MongoDB for users
const searchMongoDB = async (query) => {
  try {
    return await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).lean(); // Use lean() for faster performance when only reading data
  } catch (error) {
    console.error('Error searching MongoDB:', error);
    return [];
  }
};

// Merge DynamoDB and MongoDB results, removing duplicates
const mergeResults = (dynamoUsers, mongoUsers) => {
  const userMap = new Map();

  // Add DynamoDB users
  dynamoUsers.forEach((user) => {
    userMap.set(user.username, user);
  });

  // Add MongoDB users (overwriting duplicates if they exist)
  mongoUsers.forEach((user) => {
    userMap.set(user.username, user);
  });

  // Return unique users as an array
  return Array.from(userMap.values());
};

module.exports = { searchUsers };
