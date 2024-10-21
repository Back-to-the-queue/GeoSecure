const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
})
const util = require('../routes/util')
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'geosecure-users';

async function register(userInfo) {
    const name = userInfo.name
    const email = userInfo.email
    const username = userInfo.username
    const password = userInfo.password
    if(!username || !name || !email || !password){
        return util.buildResponse(401, {
            message: 'all fields are required'
        })
    }
    const dynamoUser = await getUser(username.toLowerCase().trim());
    if(dynamoUser && dynamoUser.username){
        return util.buildResponse(401, {
            message: 'username already exists, please choose another username'
        })
    }
    const encryptedPW = bcrypt.hashSync(password.trim, 10);
    const user = {
        name: name,
        email: email,
        username: username.toLowerCase().trim(),
        password: encryptedPW
    }
    const saveUserResponse  = await saveUser(user);
    if(!saveUserResponse){
        return util.buildResponse(503, {
            message: 'Server Error, Please try again later.'
        })
    }
    return util.buildResponse(200, {username: user});
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

async function saveUser(username) {
    const params = {
        TableName: userTable,
        Item: user
    }

    return await dynamodb.get(params).promise().then(() => {
        return true;
    }, error => {
        console.error('There is an error saving user', error)
});

}
module.exports.register = register;