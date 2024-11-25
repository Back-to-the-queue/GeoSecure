const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTripsTable = 'user-trips';

const Tracking = {
    async startTracking(userId) {
        const tripId = `${userId}-${Date.now()}`;
        const params = {
            TableName: userTripsTable,
            Item: {
                tripId,
                userId,
            },
        };
        await dynamodb.put(params).promise();
        return tripId;
    },

    async storeTrajectory(tripId, key, encryptedTrajectory) {
        const params = {
            TableName: userTripsTable,
            Key: { tripId }, //Use tripId as the partition key
            UpdateExpression: 'SET #k = :key, #et = :trajectory',
            ExpressionAttributeNames: {
                '#k': 'key',
                '#et': 'encryptedTrajectory',
            },
            ExpressionAttributeValues: {
                ':key': key,
                ':trajectory': encryptedTrajectory,
            },
        };
        await dynamodb.update(params).promise();
    },
};

module.exports = Tracking;