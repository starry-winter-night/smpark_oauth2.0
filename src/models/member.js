const mongoose = require('../configs/mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const memberSchema = new Schema(
  {
    username: String,
    hashedPassword: String,
    email: String,
    name: String,
    agree: Boolean,
    client: {
      clientId: String,
      clientSecret: String,
      chatApiKey: String,
    },
  },
  {
    timestamps: { currentTime: () => Date.now() + 3600000 * 9 },
  }
);

memberSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

memberSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};
memberSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};
memberSchema.statics.findById = function (id) {
  return this.findOne({ _id: id });
};

memberSchema.methods.setClientId = async function (clientId) {
  let hash = uuidv4();
  hash = hash.substring(1, 15);
  hash = hash + '-' + this.username;
  this.client.clientId = hash;
};
memberSchema.methods.setClientSecret = async function (clientSecret) {
  let hash = uuidv4();
  hash = hash.substring(1, 20);
  this.client.clientSecret = hash;
};

memberSchema.methods.setChatApiKey = async function (chatApiKey) {
  let hash = uuidv4();
  this.client.chatApiKey = hash;
};

memberSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  delete data.client.clientSecret;
  return data;
};

module.exports = mongoose.model('member', memberSchema);
