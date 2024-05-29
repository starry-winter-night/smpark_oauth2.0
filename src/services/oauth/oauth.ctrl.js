const Member = require('../../models/member');
const Oauth = require('../../models/oauth');
const {
  createVerifyRule,
  xssCheck,
  createCode,
  createRedirect,
  createExpiresAt,
  createLoginToken,
  createAccessToken,
  createRefreshToken,
  replaceManagerListArr,
  expiresTimeComparison,
  jwtVerify,
} = require('./oauth.functions.js');

// app 페이지
const regAppView = async (user) => {
  try {
    // app을 등록한 경우
    const oauthInfo = await Oauth.findByUsername(user.username);
    if (oauthInfo) {
      oauthInfo.client.chatManagerList = replaceManagerListArr(oauthInfo.client.chatManagerList);
      oauthInfo.client.reqInfo = oauthInfo.client.reqInfo === undefined ? {} : oauthInfo.client.reqInfo;
      return oauthInfo.client;
    } else {
      // app을 등록하지 않은 경우
      const memberInfo = await Member.findByUsername(user.username);
      // oauth에 등록
      const oauth = new Oauth({
        client: {
          username: user.username,
          clientId: memberInfo.client.clientId,
          clientSecret: memberInfo.client.clientSecret,
          chatApiKey: memberInfo.client.chatApiKey,
          reqInfo: {},
        },
      });
      await oauth.save();
      return oauth.client;
    }
  } catch (e) {
    const error = {
      code: 500,
      message: `function regAppView 에러:: ${e}`,
    };
    return error;
  }
};

// app 등록
const regApp = async (regData, user) => {
  // 파라미터 유효성 검증
  const updatedRegData = {
    ...regData,
    reqInfo: JSON.parse(regData.reqInfo),
    chatManagerList: JSON.parse(regData.chatManagerList),
    grants: ['authorization_code', 'refresh_token'], //아직 사용하진 않지만 추후 업데이트를 통해 사용할 수 있으므로 일단 저장
  };

  const schema = createVerifyRule('regappPost');
  const { error, value } = schema.validate(updatedRegData);
  if (error) {
    const error = {
      code: 400,
      message: `function regApp 파라미터 검증 오류:: ${error}`,
    };
    return error;
  }

  try {
    const oauthInfo = await Oauth.findByUsername(user.username);
    await oauthInfo.updateByRegAppData(value);
    return true;
  } catch (e) {
    const error = {
      state: 'error',
      code: 500,
      message: `regApp 함수 내 비동기 에러:: ${e}`,
    };
    return error;
  }
};
/***************** client용 로그인 페이지 뷰  *******************/
const authLoginView = (clientId, redirectUris, state) => {
  const validata = { clientId, redirectUris, state };
  // 파라미터 유효성 검증
  const schema = createVerifyRule('authorizeGet');
  const { error, _ } = schema.validate(validata);
  if (error) {
    const error = {
      code: 412,
      message: `function authLoginView 파라미터 검증 오류:: ${error}`,
      clientMessage: `파라미터에 오류가 있습니다. : ${error}`,
    };
    return error;
  }
  const agreeList = loadAgreeList(clientId);
  return agreeList;
};
/***************** 로그인 진행  *******************/
const authLogin = async (bodyData, referer) => {
  const validata = {
    clientId: bodyData.client_id,
    redirectUris: bodyData.redirect_uri,
    state: bodyData.state,
    username: bodyData.username,
    password: bodyData.password,
    referer,
  };
  const { username, password } = bodyData;
  //유효성 검사
  const schema = createVerifyRule('authorizePost');
  const { error, _ } = schema.validate(validata);
  if (error) {
    const error = {
      code: 412,
      message: `function authLogin 파라미터 검증 오류:: ${error}`,
      clientMessage: `파라미터에 오류가 있습니다. : ${error}`,
    };
    return error;
  }

  // xss 검증
  const xssResult = xssCheck(referer);
  if (!xssResult) {
    const error = {
      code: 412,
      message: `function authLogin 파라미터 검증 오류:: xss 탐지 `,
      clientMessage: `script를 사용하실 수 없습니다.`,
    };
    return error;
  }
  try {
    // db에서 아이디 검색
    const member = await Member.findByUsername(username);
    if (member === null) {
      const error = {
        code: 401,
        message: '등록되지 않은 계정입니다.',
      };
      return error;
    }
    // db에서 비밀번호 일치 확인
    const valid = await member.checkPassword(password);
    if (!valid) {
      const error = {
        code: 401,
        message: '아이디 또는 비밀번호가 일치하지 않습니다.',
      };
      return error;
    }
    // 로그인 토큰 생성
    const time = 1; // 1시간
    const token = createLoginToken({
      id: member._id,
      username: member.username,
      expiresIn: createExpiresAt('hour', time),
    });
    // 결과 객체
    const result = {
      token: token,
      agree: member.agree,
    };
    return result;
  } catch (e) {
    const error = {
      code: 500,
      message: `function authLogin 비동기 에러:: ${e}`,
    };
    return error;
  }
};
/***************** 동의 후 code 생성  *******************/
const callback = async (bodyData, username) => {
  const validata = {
    clientId: bodyData.client_id,
    redirectUris: bodyData.redirect_uri,
    state: bodyData.state,
    username,
  };
  const { client_id, redirect_uri, state } = bodyData;
  /// 동의를 누른사람만 오기때문에 최초 1번만 온다.
  /// 한번 동의를 누른사람은 여기로 오지 않는다.
  // 유효성 검사
  const schema = createVerifyRule('callbackPost');
  const { error, _ } = schema.validate(validata);
  if (error) {
    const error = {
      code: 412,
      message: `function callback 파라미터 검증 오류:: ${error}`,
      clientMessage: `파라미터에 오류가 있습니다. : ${error}`,
    };
    return error;
  }

  try {
    const oauth = await Oauth.findByClientId(client_id);
    const member = await Member.findByUsername(username);
    if (oauth === null || member === null) {
      const error = {
        code: 500,
        message: 'function callback db 에러',
      };
      return error;
    }

    // 정보제공 동의
    const agree = true;
    // db 업데이트
    await member.updateOne({ agree: agree });

    const agreeResult = await agreeProcessLogic(client_id, redirect_uri, state, username);
    return agreeResult;
  } catch (e) {
    const error = {
      code: 500,
      message: `function callback 비동기 에러:: ${e}`,
    };
    return error;
  }
};

const token = async (tokenData) => {
  try {
    const { clientSecret, client_id, grant_type, code, refreshToken } = tokenData;
    const schema = createVerifyRule('tokenPost');
    const { error, _ } = schema.validate(tokenData);
    if (error) {
      const error = {
        code: 412,
        message: `token 함수 내 파라미터 검증 오류:: ${error}`,
        clientMessage: `파라미터에 오류가 있습니다. : ${error}`,
      };
      return error;
    }
    // 접속 토큰 발행 시
    if (grant_type === 'authorization_code') {
      //받아온 query의 정보와 모두 일치하는 클라이언트를 찾고(검증) code의 유효기간을 불러온다.
      const oauth = await Oauth.findByVerifyClient(tokenData);
      if (oauth === null) {
        const error = {
          code: 500,
          message: 'function token bodyData 검증 에러',
        };
        return error;
      }
      // owner의 유저아이디
      const username = oauth.authorizationCode.user;
      // 인증코드의 유효시간 불러오기
      const expiresAt = new Date(oauth.authorizationCode.expiresAt).getTime();
      // 만료시간과 현재 시간 비교
      const comparisonResult = await expiresTimeComparison(expiresAt);

      // 만료되었다면
      if (!comparisonResult) {
        const error = {
          code: 403,
          message: 'function token 코드 만료',
          clientMessage: `authorize code가 만료되었습니다.`,
        };
        return error;
      }
      // 접속 토큰 10분
      const acsTknTime = 10;
      // 만료시간 구하기
      const acsTknExpiresAt = createExpiresAt('minute', acsTknTime);
      // 재발행 토큰 5시간
      const refTknTime = 5;
      // 만료시간 구하기
      const refTknExpiresAt = createExpiresAt('hour', refTknTime);

      // access token 생성
      const access_token = createAccessToken({
        id: client_id,
        secret: clientSecret,
        user: username,
        expiresIn: acsTknExpiresAt,
      });
      // refresh token 생성
      const refresh_token = createRefreshToken({
        id: client_id,
        secret: clientSecret,
        user: username,
        expiresIn: refTknExpiresAt,
      });
      // owner의 _id를 찾기위해 검색
      const member = await Member.findByUsername(username);
      // client에게 보낼 토큰 객체
      const token = {
        access_token: access_token,
        expires_at: acsTknExpiresAt,
        refresh_token: refresh_token,
        refresh_expires_at: refTknExpiresAt,
        client: oauth.client.appName,
        _id: member._id,
      };

      // db 업데이트
      await oauth.updateOne({ token: token });
      // json 문자열로 변환

      return token;
      // 재발급 토큰 발행 시
    } else if (grant_type === 'refresh_token') {
      // 토큰 decode 하기
      const jwtResult = await jwtVerify(grant_type, refreshToken);
      if (!jwtResult) {
        const error = {
          code: 401,
          message: 'function token jwt 토큰 decode 에러',
          clientMessage: `유효한 token 정보가 아닙니다.`,
        };
        return error;
      }

      // decode 값과 파라미터 값이 같으면
      if (jwtResult.id == client_id && jwtResult.secret == clientSecret) {
        const oauth = await Oauth.findByUsername(decoded.user);
        // 접속 토큰 10분
        const acsTknTime = 10;
        // 만료시간 구하기
        const acsTknExpiresAt = createExpiresAt('minute', acsTknTime);
        // access token 생성
        const access_token = createAccessToken({
          id: client_id,
          secret: clientSecret,
          user: username,
          expiresIn: acsTknExpiresAt,
        });
        // client에게 보낼 토큰 객체
        const token = {
          accessToken: access_token,
          acsTknExpiresAt: acsTknExpiresAt,
        };
        // db 업데이트
        await oauth.updateOne({ token: token });
        // json 문자열로 변환

        return token;
      } else {
        const error = {
          code: 401,
          message: 'function token 토큰과 파라미터가 불일치',
          clientMessage: `토큰 정보와 파라미터 정보가 일치하지 않습니다.`,
        };
        return error;
      }
    } else {
      const error = {
        code: 412,
        message: 'function token 토큰과 grant_type 에러',
        clientMessage: `올바른 grant_type이 아닙니다.`,
      };
      return error;
    }
  } catch (e) {
    const error = {
      code: 500,
      message: `function token 비동기 에러:: ${e}`,
    };
    return error;
  }
};

// 인증코드 및 유효시간 설정하고 디비에 저장 후 uri 생성
// 중복으로 사용 할 일이 많아서 로직 함수화함
const agreeProcessLogic = async (client_id, redirect_uri, state, username) => {
  try {
    // client_id db 검색
    const oauth = await Oauth.findByClientId(client_id);
    if (!oauth) {
      const error = {
        code: 412,
        message: 'function agreeProcessLogic db 에러',
        clientMessage: `등록된 client_id가 아닙니다.`,
      };
      return error;
    }
    // authrization code를 생성한다.
    const code = createCode();
    // 10분
    const time = 10;
    // 코드 유효시간
    const expiresAt = createExpiresAt('minute', time);
    // db 업데이트
    await oauth.updateByAuthCode(code, expiresAt, redirect_uri, username);
    // redirect할 uri 생성
    const uriResult = createRedirect(redirect_uri, code, state);

    return uriResult;
  } catch (e) {
    const error = {
      code: 500,
      message: `agreeProcessLogic 함수 내 비동기 에러:: ${e}`,
    };
    return error;
  }
};

const loadAgreeList = async (client_id) => {
  // client_id db 검색
  const oauth = await Oauth.findByClientId(client_id);

  // 유저의 정보제공 key값 구하기
  const reqInfo = Object.keys(oauth.client.reqInfo);
  return reqInfo;
};

module.exports = {
  regAppView,
  regApp,
  authLoginView,
  authLogin,
  callback,
  token,
  agreeProcessLogic,
  loadAgreeList,
};
