const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
})
const util = require('../routes/util');
const bcrypt = require('bcryptjs');
const auth = require('../routes/auth');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'geosecure-users';

async function login(userInfo) {
    const username = userInfo.username;
    const password = userInfo.password;
    
    if (!userInfo || !username || !password) {
        return util.buildResponse(401, {
            message: 'Username and password are required'
        });
    }

    const dynamoUser = await getUser(username.toLowerCase().trim());
    if (!dynamoUser || !dynamoUser.username) {
        return util.buildResponse(403, { message: 'User does not exist' });
    }

    if (!bcrypt.compareSync(password, dynamoUser.password)) {
        return util.buildResponse(403, { message: 'Password is incorrect' });
    }

    // Do not redeclare userInfo here
    const token = auth.generateToken({
        username: dynamoUser.username,
        name: dynamoUser.name
    });

    const response = {
        user: {
            username: dynamoUser.username,
            name: dynamoUser.name
        },
        token: token
    };
    
    return util.buildResponse(200, response);
}

async function getUser(username) {
    const params = {
        TableName: userTable,
        Key: {
            username: username
        }
    }

    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error('There is an error', error);
    })
}

module.exports.login = login;