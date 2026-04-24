require('dotenv').config();

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('JWT_SECRET is not set. Configure a strong secret before production use.');
}

const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodrush';

const startServer = async () => {
  await connectDB(MONGODB_URI);

  const server = app.listen(PORT, () => {
    console.log(`FoodRush API running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Set PORT to a free port in backend/.env.`);
      process.exit(1);
    }

    console.error(`Server failed to start: ${err.message}`);
    process.exit(1);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Closing FoodRush API.`);
    await mongoose.connection.close().catch(() => undefined);
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

if (require.main === module) {
  startServer();
}

module.exports = app; // export for testing if needed
