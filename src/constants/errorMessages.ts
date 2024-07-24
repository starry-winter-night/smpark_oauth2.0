export const ERROR_MESSAGES = {
  LOGIN: {
    REQUIRED: '로그인이 필요한 서비스입니다.',
  },
  SCOPE_CONSENT: {
    UPDATE_FAILURE: 'scope 동의여부를 업데이트하는 중 문제가 발생했습니다. 다시 시도해 주세요.',
  },
  SERVER: {
    ISSUE: '서버에 문제가 발생했습니다. 나중에 다시 시도해 주세요.',
  },
  RATE_LIMIT: {
    EXCEEDED: '해당 IP의 요청이 너무 많습니다. 잠시 후에 다시 시도해 주세요.',
  },
  CONSENT: {
    UPDATE_FAILURE: '동의 여부 업데이트에 실패했습니다.',
  },
  NOT_FOUND: {
    USER: '등록되지 않은 유저입니다.',
    CODE: '등록되지 않은 코드입니다.',
    CLIENT: '등록되지 않은 클라이언트 입니다.',
    CLIENT_ID: '등록되지 않은 클라이언트 아이디 입니다.',
    PAGE: '페이지를 찾을 수 없습니다.',
    AGREED_SCOPES: '허용 데이터 제공 범위가 없습니다.',
    CREDENTIAL: '생성 요청이 모두 누락되었습니다.',
  },
  VALIDATION: {
    MISSING: {
      ID: 'id가 존재하지 않습니다.',
      PASSWORD: 'password가 존재하지 않습니다.',
      NAME: 'name이 존재하지 않습니다.',
      EMAIL: 'email이 존재하지 않습니다.',
      CLIENT_ID: 'client_id가 존재하지 않습니다.',
      CLIENT_SECRET: 'client_secret가 존재하지 않습니다.',
      REFERER_URI: 'referer_uri가 존재하지 않습니다.',
      REDIRECT_URI: 'redirect_uri가 존재하지 않습니다.',
      GRANT_TYPE: 'grant_type이 존재하지 않습니다.',
      CODE: 'code가 존재하지 않습니다.',
      STATUS: '존재하지 않는 status입니다.',
      RESPONSE_TYPE: 'response_type이 존재하지 않습니다.',
      SCOPE: 'scope가 존재하지 않습니다.',
      CONSENT_UPDATE: 'consent_update가 존재하지 않습니다.',
      ADDRESS_URI: 'address_uri가 존재하지 않습니다.',
      APPLICATION_NAME: 'application_name이 존재하지 않습니다.',
    },
    MISMATCH: {
      CLIENT_ID: '등록된 client_id와 요청된 client_id가 일치하지 않습니다.',
      CLIENT_SECRET: '등록된 client_secret와 요청된 client_secret가 일치하지 않습니다.',
      REDIRECT_URI: '등록된 redirect_uri와 요청된 redirect_uri가 일치하지 않습니다.',
      ADDRESS_URI: '등록된 address_uri와 요청된 address_uri가 일치하지 않습니다.',
      CODE: '등록된 code와 요청된 code가 일치하지 않습니다.',
      CREDENTIALS: '아이디 또는 패스워드가 일치하지 않습니다.',
    },
    FORMAT: {
      USERNAME:
        '아이디는 4~16자로, 소문자 알파벳, 대문자 알파벳, 그리고 숫자로만 구성되어야 합니다.',
      EMAIL: '이메일 주소가 형식에 맞지 않습니다.',
      NAME: '이름은 1~200자로 구성되어야 합니다.',
      ADDRESS_URI: 'address_uri가 형식에 맞지 않습니다.',
      REDIRECT_URI: 'redirect_uri(Authorization Callback URL)가 형식에 맞지 않습니다.',
      TOKEN: '토큰 형식이 올바르지 않습니다. 유효한 토큰을 제공해 주세요.',
      AUTHENTICATION: '잘못된 형식의 클라이언트 인증 정보입니다. "Basic" 형식을 사용해야 합니다.',
    },
    UNSUPPORTED: {
      RESPONSE_TYPE: 'response_type은 code만 지원됩니다.',
      GRANT_TYPE: 'grant_type은 authorization_code 또는 refresh_token만 지원됩니다.',
    },
    EXPIRED: {
      TOKEN: '세션이 만료되었습니다. 다시 로그인해 주세요.',
      CODE: '코드의 유효기간이 만료되었습니다.',
    },
    DUPLICATE: {
      ID: '이미 등록된 아이디입니다.',
      EMAIL: '이미 등록된 이메일입니다.',
    },
  },
};
