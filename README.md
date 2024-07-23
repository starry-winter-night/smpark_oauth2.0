# smPark OAuth2.0 Server

`smPark OAuth2.0 Server`는 3년 전 보안 공부를 위해 만들었던 OAuth 2.0 서버를 클린 아키텍처와 최신 기술을 적용하여 리마스터한 프로젝트입니다.
README.md는 OAuth2.0에 대한 간단한 소개 및 사용방법, 폴더 구조 및 아키텍처, 기타 설정 등에 대한 소개입니다.

## 주요 특징

- **클린 아키텍처**:
  유지보수성과 확장성을 고려한 구조로 설계되었습니다.

- **Yarn PnP (Zero Install)**:
  PnP 기능을 체험하고 Zero Install의 속도를 확인하기 위해 적용해보았습니다.

- **TypeScript**:
  정적 타입 체크(Strict)를 통해 코드의 안정성과 가독성을 향상시켰습니다.

- **ESLint**:
  코드 품질과 일관성을 유지하기 위해 엄격한 린팅 규칙을 적용하였습니다.

- **Docker**:
  컨테이너화를 통해 개발 환경과 배포 환경의 일관성을 보장하였습니다.

- **JEST/Cypress**:

  - 서비스 로직을 유닛 테스트 하였습니다.
  - OAuth 인증의 성공 사례를 E2E 테스트 하였습니다.

- **CI/CD**:
  GitHub Actions를 통해 지속적인 통합 및 배포 파이프라인을 구축하였습니다.

## Version

`smPark OAuth2.0 Server`_(v1.0.0)_

## IDE

<img alt="VSCode" src="https://img.shields.io/badge/VSCode-v1.91.1-007ACC.svg?&flat&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDVweCIgaGVpZ2h0PSI0NHB4IiB2aWV3Qm94PSIwIDAgNDQgNDQiIHZlcnNpb249IjEuMSI+CjxnIGlkPSJzdXJmYWNlMSI+CjxwYXRoIHN0eWxlPSIgc3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDpyZ2IoMTQuMTE3NjQ3JSw1My43MjU0OSUsNzkuMjE1Njg2JSk7ZmlsbC1vcGFjaXR5OjE7IiBkPSJNIDEuMjU3ODEyIDE1LjczMDQ2OSBDIDEuMjU3ODEyIDE1LjczMDQ2OSAwLjIxNDg0NCAxNC45NjQ4NDQgMS40NjQ4NDQgMTMuOTQxNDA2IEwgNC4zNzg5MDYgMTEuMjkyOTY5IEMgNC4zNzg5MDYgMTEuMjkyOTY5IDUuMjEwOTM4IDEwLjM5ODQzOCA2LjA5Mzc1IDExLjE3NTc4MSBMIDMyLjk2NDg0NCAzMS44OTQ1MzEgTCAzMi45NjQ4NDQgNDEuODI4MTI1IEMgMzIuOTY0ODQ0IDQxLjgyODEyNSAzMi45NTMxMjUgNDMuMzkwNjI1IDMwLjk4NDM3NSA0My4yMTg3NSBaIE0gMS4yNTc4MTIgMTUuNzMwNDY5ICIvPgo8cGF0aCBzdHlsZT0iIHN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6cmdiKDYuMjc0NTElLDQzLjkyMTU2OSUsNzAuMTk2MDc4JSk7ZmlsbC1vcGFjaXR5OjE7IiBkPSJNIDguMTgzNTk0IDIyLjEzMjgxMiBMIDEuMjU3ODEyIDI4LjU0Njg3NSBDIDEuMjU3ODEyIDI4LjU0Njg3NSAwLjU0Njg3NSAyOS4wODU5MzggMS4yNTc4MTIgMzAuMDQ2ODc1IEwgNC40NzI2NTYgMzMuMDI3MzQ0IEMgNC40NzI2NTYgMzMuMDI3MzQ0IDUuMjM4MjgxIDMzLjg2MzI4MSA2LjM2NzE4OCAzMi45MTAxNTYgTCAxMy43MDcwMzEgMjcuMjQyMTg4IFogTSA4LjE4MzU5NCAyMi4xMzI4MTIgIi8+CjxwYXRoIHN0eWxlPSIgc3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDpyZ2IoMy4xMzcyNTUlLDQ2LjY2NjY2NyUsNzIuNTQ5MDIlKTtmaWxsLW9wYWNpdHk6MTsiIGQ9Ik0gMjAuMzQzNzUgMjIuMTg3NSBMIDMzLjA0Njg3NSAxMi4zMDg1OTQgTCAzMi45NjQ4NDQgMi40MjU3ODEgQyAzMi45NjQ4NDQgMi40MjU3ODEgMzIuNDIxODc1IDAuMjY5NTMxIDMwLjYxMzI4MSAxLjM5MDYyNSBMIDEzLjcwNzAzMSAxNy4wNTg1OTQgWiBNIDIwLjM0Mzc1IDIyLjE4NzUgIi8+CjxwYXRoIHN0eWxlPSIgc3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDpyZ2IoMjMuNTI5NDEyJSw2MCUsODMuMTM3MjU1JSk7ZmlsbC1vcGFjaXR5OjE7IiBkPSJNIDMwLjk4NDM3NSA0My4yMzA0NjkgQyAzMS43MjI2NTYgNDQgMzIuNjE3MTg4IDQzLjc1IDMyLjYxNzE4OCA0My43NSBMIDQyLjUxNTYyNSAzOC43ODEyNSBDIDQzLjc4NTE1NiAzNy45MDIzNDQgNDMuNjA1NDY5IDM2LjgwODU5NCA0My42MDU0NjkgMzYuODA4NTk0IEwgNDMuNjA1NDY5IDcuMTQ0NTMxIEMgNDMuNjA1NDY5IDUuODQzNzUgNDIuMjk2ODc1IDUuMzkwNjI1IDQyLjI5Njg3NSA1LjM5MDYyNSBMIDMzLjcxNDg0NCAxLjE3OTY4OCBDIDMxLjgzOTg0NCAwIDMwLjYxMzI4MSAxLjM5MDYyNSAzMC42MTMyODEgMS4zOTA2MjUgQyAzMC42MTMyODEgMS4zOTA2MjUgMzIuMTkxNDA2IDAuMjM0Mzc1IDMyLjk2NDg0NCAyLjQyNTc4MSBMIDMyLjk2NDg0NCA0MS42NDg0MzggQyAzMi45NjQ4NDQgNDEuOTE3OTY5IDMyLjkxMDE1NiA0Mi4xODM1OTQgMzIuNzk2ODc1IDQyLjQyMTg3NSBDIDMyLjU3MDMxMiA0Mi44ODY3MTkgMzIuMDc4MTI1IDQzLjMyMDMxMiAzMC45MDIzNDQgNDMuMTM2NzE5IFogTSAzMC45ODQzNzUgNDMuMjMwNDY5ICIvPgo8L2c+Cjwvc3ZnPgo="/> <img alt="Node.js" src="https://img.shields.io/badge/Node.js-v20.14.0-339933.svg?&flat&logo=Node.js"/> <img alt="Express" src="https://img.shields.io/badge/Express-v4.19.2-333333.svg?&flat&logo=Express"/> <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg?&flat&logo=JavaScript"/> <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-v5.5.2-3178C6.svg?&flat&logo=TypeScript"/> <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-v6.7.0-47A248.svg?&flat&logo=MongoDB"/> <img alt="Nginx" src="https://img.shields.io/badge/Nginx-v1.27.0-009639.svg?&flat&logo=nginx&logoColor=009639"/> <img alt="ESLint" src="https://img.shields.io/badge/ESLint-v9.5.0-6C54E6.svg?&flat&logo=ESLint&logoColor=6C54E6"/> <img alt="Prettier" src="https://img.shields.io/badge/Prettier-v3.3.2-F7B93E.svg?&flat&logo=Prettier"/> <img alt="Docker" src="https://img.shields.io/badge/Docker-v24.0.2-2496ED.svg?&flat&logo=Docker"/> <img alt="Yarn" src="https://img.shields.io/badge/Yarn-v4.3.1-2C8EBB.svg?&flat&logo=Yarn"/> <img alt="Git" src="https://img.shields.io/badge/Git-v2.40.1-F05032.svg?&flat&logo=Git"/> <img alt="Jest" src="https://img.shields.io/badge/Jest-v29.7.0-C21325.svg?&flat&logo=Jest&logoColor=C21325"/> <img alt="Cypress" src="https://img.shields.io/badge/Cypress-v13.13.0-00BFAA.svg?&flat&logo=Cypress"/>

- **Tool** - `VSCode` _(v1.91.1)_
- **Back End** - `Node.js` _(v20.14.0)_, `Express` _(v4.19.2)_
- **Front End** - `JavaScript Module` _(ES6+)_, `TypeScript` _(v5.5.2)_
- **Database** - `MongoDB (Atlas)` _(v6.7.0)_
- **Web Server** - `Nginx` _(v1.27.0)_
- **Linting** - `ESLint` _(v9.5.0)_
- **Formatting** - `Prettier` _(v3.3.2)_
- **Containerization** - `Docker` _(v24.0.2)_
- **Package Management** - `Yarn` _(v4.3.1)_
- **Version Control** - `Git` _(v2.40.1)_
- **Testing** - `Jest` _(v29.7.0)_, `Cypress` _(v13.13.0)_
- **Deployment Environment** - `macOS` _(v14.5 Sonoma on MacBook)_

<br>

[📑[rfc6749]](https://datatracker.ietf.org/doc/html/rfc6749)의 구조와 권고를 베이스로 제작하였습니다.

[🚀[smpark.ddns.net]](https://smpark.ddns.net) 사이트 이동
<br>

## Flow (OAuth 2.0)

<img src="src/public/image/oauth-flow.png" alt='OAuth Flow'>

<br>

#### Word

OAuth2.0에서 쓰이는 용어 설명입니다.

- `Client ID (client_id)` - 클라이언트 애플리케이션을 식별하기 위한 공개된 식별자.
- `Client Secret (client_secret)` - 클라이언트 애플리케이션을 인증하기 위한 비밀 키로, 서버 간 통신에서만 사용됨.
- `Scope` - 클라이언트가 접근하려는 리소스 서버의 자원 범위.
- `Authorization Callback URL (redirect_uri)` - 권한 부여 코드 또는 액세스 토큰을 전달받을 클라이언트의 URL.
- `Homepage Address` - 클라이언트의 홈페이지 URL로, 일반적으로 referer 도메인 검사를 위해 사용됨.
- `Access Token` - 리소스 서버에서 보호된 자원에 접근하기 위한 토큰. 유효 시간은 일반적으로 10분.
- `Refresh Token` - 새로운 액세스 토큰을 발급받기 위한 토큰. 유효 시간은 일반적으로 5시간.
- `State` - 요청의 무결성을 검증하기 위한 고유한 문자열.
- `Authorization Code` - 사용자가 클라이언트에 로그인하여 권한을 부여한 후 발급되는 코드. 클라이언트는 이 코드를 사용하여 액세스 토큰을 요청함.

<br>

## Secure

`smPark OAuth2.0 Server`를 제작하면서 가장 중점을 두었던 부분은 보안입니다.
아래와 같은 보안 검증을 구현하였습니다.

<br>

- `state` : CSRF 공격에 대비하여 공격자가 예상할 수 없는 state 데이터를 받아 클라이언트 어플리케이션의 redirect_uri에 담아 되돌려줍니다.
- ```javascript
  try {
    const { redirect_uri, state } = req.session;
    const code = await this.codeGenerationUseCase.execute(id);

    return res.redirect(`${redirect_uri}?code=${code}&state=${state}`);
  } catch (error) {
    next(error);
  }
  ```

<br>

- `redirect_uri` : redirect_uri 변조를 통한 code 탈취를 막기 위해 `smPark OAuth2.0 Server`에 등록된 redirect_uri와 실제로 요청된 redirect_uri의 동일성 검증합니다.
  [[📑[rfc6819]](https://datatracker.ietf.org/doc/html/rfc6819#section-5.2.3.5)] 권고

  ```javascript
  const redirect_uri = this.validateField(
    ERROR_MESSAGES.VALIDATION.MISSING.REDIRECT_URI,
    ERROR_MESSAGES.VALIDATION.MISMATCH.REDIRECT_URI,
    request.redirect_uri,
    oauth?.redirect_uri,
  );
  ```

<br>

- `xss` & `referer` xss 패키지를 이용하여 refererUri에서 스크립트를 제거한 후, 기존에 등록된 addressUri와 비교하여 레퍼러를 검사합니다.

  ```javascript
  private validateReferer(refererUri?: string, addressUri?: string): string {
      if (!refererUri) {
        throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.REFERER_URI);
      }

      if (
        addressUri &&
        this.normalizeUri(refererUri) !== this.normalizeUri(addressUri)
      ) {
        throw createError(401, ERROR_MESSAGES.VALIDATION.MISMATCH.ADDRESS_URI);
      }

      return refererUri;
    }

  private normalizeUri(uri: string): string {
    const validUri = xss(uri);
    return validUri.endsWith('/') ? validUri.slice(0, -1) : validUri;
  }
  ```

<br>

- `DoS(Denial of Service)` : Express-rate-limit 사용으로 반복된 요청을 통한 Server의 마비를 방지합니다. `DoS` 공격엔 어느정도 효과가 있지만 `DDoS(Distributed Denial of Service)`는 더 고도의 방어 방법 필요합니다. CDN을 통한 트래픽 분산, 방화벽 사용, DDoS 방어 전용 클라우드 서비스 등등이 있습니다.

  ```javascript
  const rateLimit = require('express-rate-limit');

  const rateLimiterMiddleware = rateLimit({
    windowMs: rateLimitWindowMs, // 1분
    max: maxRequestsPerWindow, // 1분 동안 최대 50번의 요청
    headers: true,
    message: ERROR_MESSAGES.RATE_LIMIT.EXCEEDED,
  });
  ```

<br>

- `Refresh Token` : 통신 중 `Access Token`을 탈취당할 위험을 최소화하기 위해 유효시간을 10분 이하로 설정하고 `Refresh Token`을 통해 재발급하도록 구현하였습니다. 유효시간이 만료되면 자동으로 로그아웃됩니다.

  ```javascript
  generateToken(
    payload: object,
    jwtSecretKey: string,
    expiresIn: number,
  ): string {
    const jwtToken = jwt.sign(payload, jwtSecretKey, {
      expiresIn,
    });

    return jwtToken;
  }
  ```

<br>

## Usage

간단한 이용 방법입니다.

#### Register

1. [📝[smpark.ddns.net]](https://smpark.ddns.net)에서 회원가입 후 로그인
2. Client ID, Client Secret 생성
3. Homepage Address, Authorization Callback URL, Check Required Information 항목 기재 후 등록

<img src="src/public/image/register.png" alt='OAuth 등록 페이지'>
<br>

#### Client 토큰 요청 (Example FE JavaScript Code)

1. Flow 1: 클라이언트 웹페이지에서 OAuth Server로 URI 전송

- `OAuth Server`의 정보를 원하는 클라이언트 웹페이지에서 아래와 같은 방식으로 URI를 보냅니다.
  혹은 Next Auth 패키지의 도움을 받아 전달하여도 가능합니다.

```javascript
const client_id = process.env.CLIENT_ID;
const redirect_uri = process.env.REDIRECT_URI;
const state = uuidv4(),
const scope = 'openid name email',
const response_type = 'code'


// uri redirect -> method GET
const uri = `https://smpark.ddns.net/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}&response_type=${response_type}`;

window.location.href = uri;
```

2. Flow 1-1: `OAuth Server` 인증 과정 진행
   <br>
   <img src="src/public/image/login.png" alt='login page'>
   <br>

3. Flow 1-2: 클라이언트에게 Scope 범위에 따른 정보 제공 동의 여부 묻기
   <br>
   <br>
   <img src="src/public/image/consent.png" alt='consent page'>
   <br>

  <br>
4. Flow 2: 동의 후 클라이언트에게 code 전달

<br>

```javascript
const { redirect_uri, state } = req.session;
const code = await this.codeGenerationUseCase.execute(id);

return res.redirect(`${redirect_uri}?code=${code}&state=${state}`);
```

<br>

5. Flow 3: 클라이언트는 전달받은 code와 state를 파싱하여 token 요청

```javascript
const response = await axios.post('https://smpark.ddns.net/oauth/token', {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  code,
  state,
  redirect_uri: process.env.REDIRECT_URI,
  grant_type: 'authorization_code',
});
```

5. Flow 4: `OAuth Server`는 받은 code를 검증하고 `access_token`과 `refresh_token`을 생성하여 클라이언트에 전달

```javascript
const tokens = await this.tokenGenerationUseCase.execute(ids);

return res.json({
  access_token: tokens.accessToken,
  refresh_token: tokens.refreshToken,
  token_type: 'Bearer',
});
```

6. Flow 5: 클라이언트는 `OAuth Server`에서 받은` access_token`을 Resource Server에 전달

```javascript
const response = await axios.get('https://resource-server.example.com/scope', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

7. Flow 6: 리소스 서버는 `access_token`을 검증하고 동의된 Scope와 요청 Scope에 따라 클라이언트에 정보 전달

```javascript
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  ... 검증 ...

  res.json({ userData });
```

<!-- ## ETC

#### Structure

처음 해당 프로젝트를 설계할 때 고민했던 프로젝트 구조입니다.
모든 로직을 하나의 폴더 혹은 파일에 구현하여 발생하는 스파게티 코드가 아닌 효율적으로 코드 구조를 나누고 싶었습니다.
유지보수를 위해서 각각 폴더와 파일에 역할을 부여하고 파일의 로직을 함수로 명명함으로써 함수형 프로그래밍 구조를 구현해보고 싶었습니다.

- **Middleware** : API 통신을 하기 전 실행할 로직을 수행하는 곳입니다. JWT를 통한 인가, 웹 통신의 제한, 검증, 로깅 등을 실행합니다.
- **API** : 브라우저와 웹 통신에 대한 것만을 처리하는 공간입니다.
- **Ctrl** : API 통신을 통해 들어오는 데이터를 혹은 로직을 처리하는 공간입니다. `Ctrl`에서 `Functions`를 통해 로직을 수행하고 `Models`를 통해 DB와 통신합니다.
- **Functions** : 오직 데이터를 가공하는 공간입니다.
- **Models** : 가공된 데이터를 `Ctrl`을 통해 받아, DB 통신을 통해 CRUD를 수행합니다. -->

<!-- Project structure -->
<!-- <img src="src/public/image/structure.png" alt='structure'>

위와 같은 `Structure`를 구현하여 이용해본 결과, 폴더와 파일 각각의 위치와 역할이 정해져 있고 그 안에서 로직을 함수로 명명함으로써 시간이 지나도 헷갈리지 않고 유지보수 시 필요한 요소를 빠르게 찾을 수 있으며, 문제 발생 시 문제의 원인을 빠르게 구분할 수 있었습니다. -->

#### Log

`winston`과 `margan`을 사용하여 접속과 에러 상황을 로그로 기록합니다. 또한, 콘솔에도 정보를 출력하여 개발을 원활하게 진행할 수 있도록 하였습니다.

```javascript
const consoleTransport = new winston.transports.Console({
  level: env.nodeEnv === 'production' ? 'warn' : 'debug',
  format: combine(colorize(), appendTimestamp({ tz: true }), simple()),
});
```

info.log
<img src="src/public/image/info-log.png" alt='info-log'>

<br>

error.log
<img src="src/public/image/error-log.png" alt='info-log'>

## architecture

작성중 ...
