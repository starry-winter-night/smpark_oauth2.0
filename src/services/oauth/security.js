const xss = require('xss');

const referrerCheck = (referer, hpAddr) => {
  // 홈페이지 주소 '/' 제거
  referer = referer.endsWith('/') ? referer.slice(0, -1) : referer;
  hpAddr = hpAddr.endsWith('/') ? hpAddr.slice(0, -1) : hpAddr;

  return referer === hpAddr;
};

const xssCheck = (referer, originUri) => {
  let fullUri = referer;

  // originUri 값이 있을 경우 전체 URL 생성
  if (originUri) {
    fullUri += originUri;
  }

  // 위험요소 제거
  const sanitizedReferer = xss(fullUri);

  return fullUri === sanitizedReferer;
};

const redirectCheck = (clientRedirectUri, redirect_uri) => {
  //등록된 uri와 query로 넘어몬 uri를 비교 검증한다.
  return clientRedirectUri === redirect_uri;
};

module.exports = {
  referrerCheck,
  xssCheck,
  redirectCheck,
};
