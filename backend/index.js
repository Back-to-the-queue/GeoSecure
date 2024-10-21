const loginService = require('./models/Login');
const registerService = require('./models/Register');
const verifyService = require('./models/Verify');
const util = require('./routes/util')

const healthPath = '/health';
const verifyPath = '/verify';
const loginPath = '/login';
const signupPath = '/signup';

exports.handler = async (event) => {
    console.log('Request Event: ', event);
    let response;
    switch(true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200);
            break;
        case event.httpMethod == 'POST' && event.path == verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = await verifyService.verify(verifyBody);
            break;
        case event.httpMethod == 'POST' && event.path == loginPath:
            const loginBody = JSON.parse(event.body);
            response = await loginService.login(loginBody);
            break;
        case event.httpMethod == 'POST' && event.path == signupPath:
            const registerBody = JSON.parse(event.body);
            response = await registerService.register(registerBody);
            break;
        default: 
            response = util.buildResponse(404, '404 not found');
    }
    return response;
};