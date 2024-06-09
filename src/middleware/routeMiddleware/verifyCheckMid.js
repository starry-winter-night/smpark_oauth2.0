const Oauth = require('../../models/oauth');
const createError = require('http-errors');
const { referrerCheck, xssCheck, redirectCheck } = require('../../services/oauth/security');
const helmet = require('helmet');

// 각종 검증 로직 미들웨어
const verifyCheck = async (req, res, next) => {
  const { client_id, redirect_uri } = !Object.keys(req.query).length //
    ? req.body
    : req.query;

  // 예외 처리 예시
  if (!client_id || !redirect_uri) {
    return next(createError(400, '필수 파라미터 부재'));
  }

  const referer = req.headers['referer'] || req.headers['referrer'] || req.cookies.referer;
  const originUri = req.originalUrl;

  try {
    //query와 등록자 대조
    const oauth = await Oauth.findByClientId(client_id);

    if (!oauth) {
      return next(createError(404, '등록되지 않은 client_id.'));
    }

    //referer 검증
    const hpAddr = oauth.client.homepageAddr;

    if (!hpAddr || hpAddr === '') {
      return next(createError(400, 'Homepage Address 미등록'));
    }

    const isReferrerValid = referrerCheck(referer, hpAddr);

    if (!isReferrerValid) {
      return next(createError(412, '등록 address와 접속 address 불일치'));
    }

    res.cookie('referer', referer, { httpOnly: true });

    //xss uri 검증
    const isXssValid = xssCheck(referer, originUri);
    if (!isXssValid) {
      return next(createError(403, '잠재적인 XSS 공격 감지'));
    }

    //redirect 대조 검증
    const clientRedirectUri = oauth.client.redirect_uri;

    if (!clientRedirectUri || clientRedirectUri === '') {
      return next(createError(400, 'redirect 미등록'));
    }

    const isRedirectValid = redirectCheck(clientRedirectUri, redirect_uri);

    if (!isRedirectValid) {
      return next(createError(412, 'redirect 불일치'));
    }

    try {
      const url = new URL(redirect_uri);
      const cspDirectives = {
        directives: {
          defaultSrc: ["'self'"],
          formAction: ["'self'", url.href],
          scriptSrc: ["'self'"],
        },
      };

      helmet.contentSecurityPolicy(cspDirectives)(req, res, next);
    } catch (e) {
      return next(e);
    }
  } catch (e) {
    return next(e);
  }
};

module.exports = verifyCheck;
