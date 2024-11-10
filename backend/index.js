// backend/index.js
const express = require('express');
const loginService = require('./models/Login');
const registerService = require('./models/Register');
const verifyService = require('./models/Verify');
const util = require('./routes/util');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define paths
const healthPath = '/health';
const verifyPath = '/verify';
const loginPath = '/login';
const registerPath = '/register';
const messagePath = '/message';

// Health check endpoint
app.get(healthPath, (req, res) => {
  res.status(200).send(util.buildResponse(200, 'Health check successful'));
});

// Register endpoint
app.post(registerPath, async (req, res) => {
  const registerBody = req.body;
  const response = await registerService.register(registerBody);
  res.status(response.statusCode).send(response);
});

// Login endpoint
app.post(loginPath, async (req, res) => {
  const loginBody = req.body;
  const response = await loginService.login(loginBody);
  res.status(response.statusCode).send(response);
});

// Verify endpoint
app.post(verifyPath, async (req, res) => {
  const verifyBody = req.body;
  const response = await verifyService.verify(verifyBody);
  res.status(response.statusCode).send(response);
});

// Message endpoint
app.get(messagePath, (req, res) => {
  // Send a simple message
  res.status(200).send(util.buildResponse(200, { message: 'Hello from the server!' }));
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).send(util.buildResponse(404, '404 not found'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
