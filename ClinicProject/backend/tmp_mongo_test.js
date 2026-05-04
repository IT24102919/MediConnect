require('dotenv').config();
const mongoose = require('mongoose');
const util = require('util');

(async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
       
      socketTimeoutMS: 20000,
      family: 4,
      tls: true
    };

    if (process.env.MONGO_TLS_SERVER_NAME) {
      options.servername = process.env.MONGO_TLS_SERVER_NAME;
    }

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('CONNECTED');
  } catch (err) {
    console.error('NAME:', err.name);
    console.error('MSG:', err.message);
    console.error('CAUSE:', err.cause ? err.cause.message : 'none');
    console.error('REASON:', err.reason ? util.inspect(err.reason, { depth: 6, colors: false }) : 'none');
  } finally {
    await mongoose.connection.close().catch(() => {});
    process.exit(0);
  }
})();
