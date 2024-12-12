const AWS = require('aws-sdk');
const util = require('../routes/util');

AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'geo-users';

/**
 * Search for users by a partial username or email in DynamoDB.
 */
const searchUsers = async (searchBody) => {
  const { query } = searchBody;

  if (!query) {
    return util.buildResponse(400, { message: 'Search query is required' });
  }

  try {
    // Search DynamoDB 
    const dynamoUsers = await searchDynamoDB(query);
    return util.buildResponse(200, { users: dynamoUsers });
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

module.exports = { searchUsers };
