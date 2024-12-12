const jwt = require('jsonwebtoken');

const generateToken = (userInfo) => {
  return jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (username, token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.username === username
      ? { verified: true }
      : { verified: false, message: 'Username mismatch' };
  } catch (error) {
    return { verified: false, message: 'Invalid token' };
  }
};

module.exports = { generateToken, verifyToken };
