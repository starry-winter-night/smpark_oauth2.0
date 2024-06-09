const mongoose = require('mongoose');
const { Schema } = mongoose;
const { replaceManagerListArr } = require('../services/oauth/utils');

// Authorization Code Schema
const authorizationCodeSchema = new Schema(
  {
    authorization_code: { type: String }, // accessToken을 신청하기 위해 사용되는 code
    expiresAt: { type: Date }, // 만료기간 10분, rfc6749문서 권장
    redirect_uri: { type: String }, // 인증을 마치고 code가 반환되는 callback 주소
    user: { type: String }, // oauth서버에 로그인한 사용자(client X)
  },
  { _id: false }
);

// Request Information Schema
const reqInfoSchema = new Schema(
  {
    id: { type: Boolean, required: false },
    email: { type: Boolean, required: false },
    name: { type: Boolean, required: false },
  },
  { _id: false }
);

// Client Schema
const clientSchema = new Schema(
  {
    client_id: { type: String }, // oauth2.0을 사용하겠다고 등록한 client의 client_id
    client_secret: { type: String }, // client_secret token생성때 전달 받는다
    chatApiKey: { type: String },
    chatManagerList: { type: [String], default: [] },
    grants: { type: [String], default: [] }, // grant에 따라 인증방식이 바뀌는데, 현재는 grant_code방식만 구현했기 때문에 사용되지 않음
    redirect_uri: { type: String }, // client가 사용하겠다고 등록한 callback 주소
    reqInfo: reqInfoSchema, // client가 요구한 user의 정보 범위
    appName: { type: String }, // client의 어플리케이션 이름
    homepageAddr: { type: String }, // client의 웹 주소 referer 인증에 사용
    username: { type: String }, // client의 oauthServer ID
  },
  { _id: false }
);

// Token Schema
const tokenSchema = new Schema(
  {
    access_token: { type: String }, // reqInfo 또는 resourceServer의 api를 사용하기 위해 필요한 Token
    acsTknExpiresAt: { type: Date }, // 만료기간 1시간, rfc6749문서 권장
    refresh_token: { type: String }, // accessToken이 만료 되었을때 새로 갱신하기 위한 Token
    refTknExpiresAt: { type: Date }, // 만료기간 1일, 만료기간이 다 된다면 재로그인 하여 재발급
    client: { type: String }, // 현재 해당 토큰에 연결되어 있는 client
    client_id: { type: mongoose.Schema.Types.ObjectId }, // 현재 해당 토큰에 연결되어 있는 client의 고유 id
  },
  { _id: false }
);

// Main Auth Schema
const authSchema = new Schema(
  {
    authorization_code: authorizationCodeSchema,
    client: clientSchema,
    token: tokenSchema,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      currentTime: () => Date.now() + 3600000 * 9, // 한국 표준시 (KST) 시간 적용
    },
  }
);

authSchema.methods.updateClientData = function (list) {
  this.client.chatManagerList = list;
  this.client.reqInfo = !this.client.reqInfo ? {} : this.client.reqInfo;
};

authSchema.methods.updateByRegAppData = function (regData) {
  return this.updateOne({
    'client.redirect_uri': regData.redirect_uri,
    'client.reqInfo': regData.reqInfo,
    'client.appName': regData.appName,
    'client.homepageAddr': regData.homepageAddr,
    'client.chatManagerList': regData.chatManagerList,
    'client.grants': regData.grants,
  });
};

authSchema.methods.updateByAuthCode = function (code, expiresAt, redirect_uri, username) {
  return this.updateOne({
    authorization_code: {
      authorization_code: code,
      expiresAt,
      redirect_uri,
      user: username,
    },
  });
};

authSchema.statics.findByUsername = function (username) {
  return this.findOne({ 'client.username': username });
};
authSchema.statics.findByClientId = function (client_id) {
  return this.findOne({ 'client.client_id': client_id }, { 'client.client_secret': false });
};
authSchema.statics.findByVerifyClient = function (data) {
  return this.findOne({
    'client.client_id': data.client_id,
    'client.client_secret': data.client_secret,
    'client.redirect_uri': data.redirect_uri,
    'authorization_code.authorization_code': data.code,
  });
};
authSchema.statics.findByAuthorizationCode = function (code, client_id) {
  return this.findOne({ 'authorization_code.authorization_code': code, 'client.client_id': client_id });
};
authSchema.statics.findByAccesstoken = function (token) {
  return this.findOne({ 'token.access_token': token }, { 'client.client_secret': false });
};

module.exports = mongoose.model('oauth', authSchema);
