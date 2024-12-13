const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const loginService = require('./models/Login');
const registerService = require('./models/Register');
const verifyService = require('./models/Verify');
const Tracking = require('./models/Tracking'); 
const util = require('./routes/util');

const healthPath = '/health';
const verifyPath = '/verify';
const loginPath = '/login';
const registerPath = '/register';
const startTrackingPath = '/startTracking';

exports.handler = async (event) => {
    console.log('Request Event:', event);
    let response;

    switch (true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200, { status: 'healthy' });
            break;
        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await registerService.register(registerBody);
            break;
        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await loginService.login(loginBody);
            break;
        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = await verifyService.verify(verifyBody);
            break;
        case event.httpMethod === 'POST' && event.path === startTrackingPath:
            response = await startTracking(event);  
            break;
        default:
            response = util.buildResponse(404, 'Not Found');
    }
    return response;
};

//Handles the startTracking request, including storing trajectory data
const startTracking = async (event) => {
    const { userId, tripId, key, encryptedTrajectory } = JSON.parse(event.body);
    try {
        //Initialize tracking if no trajectory data is sent
        if (!key || !encryptedTrajectory) {
            const newTripId = await Tracking.startTracking(userId);
            return util.buildResponse(200, { tripId: newTripId });
        }

        //Store trajectory data in Dynamo
        await Tracking.storeTrajectory(tripId, key, encryptedTrajectory);
        return util.buildResponse(200, { message: 'Trajectory data stored successfully' });
    } catch (error) {
        console.error('Error in startTracking:', error);
        return util.buildResponse(500, { message: 'Failed to process tracking data' });
    }
};