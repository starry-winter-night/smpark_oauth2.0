import { DEFAULT_SCOPE } from '@constants/scopes';
import { ScopeDTO } from '@dtos/TokenDTO';
import TokenService from '@services/TokenService';

describe('TokenService', () => {
  const jwtSecretKey = 'test_secret_key';
  const expiresIn = 3600;

  const loginPayload = {
    id: 'testId',
    name: 'tester',
    email: 'email@example.com',
  };
  const accessTokenPayload = {
    sub: 'testId',
    name: 'tester',
    iss: 'http://localhost:3000',
    aud: 'clientId',
  };
  const refreshTokenPayload = {
    sub: 'testId',
    iss: 'http://localhost:3000',
    aud: 'clientId',
  };
  let service: TokenService;
  beforeEach(() => {
    service = new TokenService();
  });

  describe('generateToken', () => {
    it('토큰 생성', () => {
      const loginToken = service.generateToken(
        loginPayload,
        jwtSecretKey,
        expiresIn,
      );
      const accessToken = service.generateToken(
        accessTokenPayload,
        jwtSecretKey,
        expiresIn,
      );
      const refreshToken = service.generateToken(
        refreshTokenPayload,
        jwtSecretKey,
        expiresIn,
      );

      expect(typeof loginToken).toBe('string');
      expect(typeof accessToken).toBe('string');
      expect(typeof refreshToken).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('토큰 검증', () => {
      const token = service.generateToken(
        loginPayload,
        jwtSecretKey,
        expiresIn,
      );
      const decoded = service.verifyToken<typeof loginPayload>(
        token,
        jwtSecretKey,
      );
      expect(decoded).toMatchObject(loginPayload);
    });
  });

  describe('getDefaultScope', () => {
    it('디폴트 스코프 반환', () => {
      const defaultScope = service.getDefaultScope();
      expect(defaultScope).toEqual(DEFAULT_SCOPE);
    });
  });

  describe('validateScope', () => {
    it('허용 범위와 요청 범위의 교집합 반환', () => {
      const allowedScope: ScopeDTO = {
        id: true,
        email: true,
        name: true,
      };
      const requestScope = 'id email';
      const validatedScope = service.validateScope(allowedScope, requestScope);
      expect(validatedScope).toEqual({
        id: true,
        email: true,
        name: false,
      });
    });

    it('id 항상 포함 후 반환', () => {
      const allowedScope: ScopeDTO = {
        id: true,
        email: true,
        name: false,
      };
      const requestScope = 'email';
      const validatedScope = service.validateScope(allowedScope, requestScope);
      expect(validatedScope).toEqual({
        id: true,
        email: true,
        name: false,
      });
    });
  });

  describe('calculateJwtExpiresAt', () => {
    it('JWT 만료 시간 계산', () => {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const jwtExpiresIn = 3600;
      const expectedExpiresAt = currentTimestamp + jwtExpiresIn;
      const actualExpiresAt = service.calculateJwtExpiresAt(jwtExpiresIn);

      expect(actualExpiresAt).toBeGreaterThanOrEqual(expectedExpiresAt - 1);
      expect(actualExpiresAt).toBeLessThanOrEqual(expectedExpiresAt + 1);
    });
  });
});
