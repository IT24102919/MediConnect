const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined. Set MONGO_URI (or MONGODB_URI) in container environment variables.');
  }

  try {
    console.log('Connecting to MongoDB...');
    const options = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      family: 4
    };

    if (process.env.MONGO_TLS_SERVER_NAME) {
      options.servername = process.env.MONGO_TLS_SERVER_NAME;
    }

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️ SERVER STARTING IN OFFLINE MODE (Database functionality will be limited)');
    console.log('👉 Please ensure your IP is whitelisted in MongoDB Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/');
    // Do NOT exit the process, let the server start anyway
  }
};

module.exports = connectDB;
