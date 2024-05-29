const mongoose = require('mongoose');

mongoose
  .connect('mongodb://localhost:27017/oauth')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.error(e);
  });

module.exports = mongoose;
