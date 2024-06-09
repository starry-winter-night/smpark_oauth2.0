const mongoose = require('../configs/mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const memberSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    email: { type: String, required: false },
    name: { type: String, required: false },
    agree: { type: Boolean, default: false },
    client: {
      client_id: { type: String },
      client_secret: { type: String },
      chatApiKey: { type: String },
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      currentTime: () => Date.now() + 3600000 * 9, // 한국 표준시 (KST) 시간 적용
    },
  }
);

// 스키마 수준에서 유니크 인덱스 설정
memberSchema.index({ username: 1 }, { unique: true });

memberSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

memberSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

memberSchema.methods.setClientId = async function () {
  let hash = uuidv4();
  hash = hash.substring(1, 15);
  hash = hash + '-' + this.username;
  this.client.client_id = hash;
};
memberSchema.methods.setClientSecret = async function () {
  let hash = uuidv4();
  hash = hash.substring(1, 20);
  this.client.client_secret = hash;
};

memberSchema.methods.setChatApiKey = async function () {
  let hash = uuidv4();
  this.client.chatApiKey = hash;
};

memberSchema.methods.serialize = function () {
  const {
    hashedPassword,
    client: { client_secret, ...clientRest },
    ...rest
  } = this.toJSON();
  return { ...rest, client: { ...clientRest } };
};

memberSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};
memberSchema.statics.findById = function (id) {
  return this.findOne({ _id: id });
};
memberSchema.statics.findByClientId = function (client_id) {
  return this.findOne({ 'client.client_id': client_id }, { 'client.client_secret': 0, hashedPassword: 0 });
};
memberSchema.statics.updateByAgree = function (client_id, agree) {
  return this.findOneAndUpdate({ 'client.client_id': client_id }, { agree }, { new: true });
};

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
