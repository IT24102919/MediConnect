const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, role) => {
  try {
    const token = jwt.sign(
      { id, role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '7d'
      }
    );
    return token;
  } catch (error) {
    console.error('Token generation error:', error.message);
    throw new Error('Could not generate token');
  }
};

module.exports = generateToken;
