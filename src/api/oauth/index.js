const oauth = require('express').Router();
const nonLoginCheckMiddleware = require('../../middleware/routeMiddleware/nonLoginCheckMid');
const verifyCheck = require('../../middleware/routeMiddleware/verifyCheckMid');
const oAuthCtrl = require('../../controllers/oauthController');

// app 등록 페이지 뷰
oauth.get('/regapp', nonLoginCheckMiddleware, oAuthCtrl.regAppView);

// app 등록 처리
oauth.post('/regapp', nonLoginCheckMiddleware, oAuthCtrl.regApp);

// 비로그인, 로그인(동의 or 비동의)로 접근
oauth.get('/authorize', verifyCheck, oAuthCtrl.validateOAuthRequest);

// oauth서버 로그인 처리
oauth.post('/authorize', oAuthCtrl.oAuthLogin);

// 동의서 저장
oauth.post('/agreement', oAuthCtrl.saveAgreement);

// 접속 토큰 및 재발행 토큰 처리 api
oauth.post('/token', oAuthCtrl.createTokens);

module.exports = oauth;
