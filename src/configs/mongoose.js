const mongoose = require('mongoose');
mongoose
  .connect(process.env.DATABASE_URI, {
    auth: {
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
    authSource: 'admin',
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.error(e);
  });

module.exports = mongoose;
