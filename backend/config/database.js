const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGODB_URI;

    // Use In-Memory MongoDB if URI is 'in-memory' or not provided and we're in development
    if (!dbUrl || dbUrl === 'in-memory' || process.env.USE_IN_MEMORY_DB === 'true') {
      console.log('🚀 Starting In-Memory MongoDB...');
      mongoServer = await MongoMemoryServer.create();
      dbUrl = mongoServer.getUri();
      console.log('✅ In-Memory MongoDB started');
    }

    const conn = await mongoose.connect(dbUrl);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
};

module.exports = connectDB;
