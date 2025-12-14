const mongoose = require('mongoose');
require('dotenv').config();

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}, 10000);

afterAll(async () => {
  await mongoose.connection.close();
});
