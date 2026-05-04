const mongoose = require('mongoose');

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const requireDatabase = (req, res, next) => {
  if (isDatabaseConnected()) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message: 'Database is not connected. Check MongoDB Atlas Network Access/IP whitelist and restart the backend.'
  });
};

module.exports = {
  isDatabaseConnected,
  requireDatabase
};
