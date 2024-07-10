import OAuthVerifierService from '@services/OAuthVerifierService';
import { ClientsDTO } from '@dtos/ClientsDTO';
import { CodeDTO } from '@dtos/CodeDTO';
import { UserDTO } from '@dtos/UserDTO';
import { ScopeDTO } from '@dtos/TokenDTO';
import { ERROR_MESSAGES } from '@constants/errorMessages';

describe('OAuthVerifierService', () => {
  let service: OAuthVerifierService;

  beforeEach(() => {
    service = new OAuthVerifierService();
  });

  describe('verifyId', () => {
    it('id 누락 시 에러 발생(401, 메시지)', () => {
      expect(() => service.verifyId()).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.LOGIN.REQUIRED,
          statusCode: 401,
        }),
      );
    });

    it('id 존재 시 아이디 반환', () => {
      const id = 'testId';
      expect(service.verifyId(id)).toBe(id);
    });
  });

  describe('verifyIds', () => {
    it('ids 누락 시 에러 발생(401, 메시지)', () => {
      expect(() => service.verifyIds(null)).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.LOGIN.REQUIRED,
          statusCode: 401,
        }),
      );
    });

    it('ids 존재 시 ids 반환', () => {
      const ids = { id: 'testId', client_id: 'testClientId' };
      expect(service.verifyIds(ids)).toBe(ids);
    });
  });

  describe('verifyUser', () => {
    it('user 누락 시 에러 발생(401, 메시지)', () => {
      expect(() => service.verifyUser(null)).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.NOT_FOUND.USER,
          statusCode: 401,
        }),
      );
    });

    it('user 존재 시 user 반환', () => {
      const user: UserDTO = {
        id: 'userId',
        password: 'password',
        name: 'name',
        email: 'example@example.com',
        agreedScopes: { id: true, email: false, name: false },
      };
      expect(service.verifyUser(user)).toBe(user);
    });
  });

  describe('verifyRegUser', () => {
    it('user 누락 시 true 반환', () => {
      expect(service.verifyRegUser(null)).toBe(true);
    });

    it('user 존재 시 에러 발생(409, 메시지)', () => {
      const user: UserDTO = {
        id: 'userId',
        password: 'password',
        name: 'name',
        email: 'example@example.com',
        agreedScopes: { id: true, email: false, name: false },
      };
      expect(() => service.verifyRegUser(user)).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.VALIDATION.DUPLICATE.ID,
          statusCode: 409,
        }),
      );
    });
  });

  describe('verifyClient', () => {
    it('clients 누락 시 에러 발생(401, 메시지)', () => {
      expect(() => service.verifyClient(null)).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.NOT_FOUND.CLIENT,
          statusCode: 401,
        }),
      );
    });

    it('clients 존재 시 clients 반환', () => {
      const clients: ClientsDTO = {
        id: '',
        client_id: '',
        client_secret: '',
        api_key: '',
        application_name: '',
        redirect_uri: '',
        address_uri: '',
        grant_type: 'authorization_code',
        clientAllowedScopes: {
          id: false,
          email: false,
          name: false,
        },
      };
      expect(service.verifyClient(clients)).toBe(clients);
    });
  });

  describe('verifyCodeExists', () => {
    it('code 누락 시 에러 발생(401, 메시지)', () => {
      expect(() => service.verifyCodeExists(null)).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.NOT_FOUND.CODE,
          statusCode: 401,
        }),
      );
    });

    it('code 존재 시 code 반환', () => {
      const code: CodeDTO = { id: '', code: 'codeValue', expiresAt: 0 };
      expect(service.verifyCodeExists(code)).toBe(code);
    });
  });

  describe('verifyCodeExpiration', () => {
    it('code 만료 시 에러 발생(401, 메시지)', () => {
      expect(() => service.verifyCodeExpiration(true)).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.VALIDATION.EXPIRED.CODE,
          statusCode: 401,
        }),
      );
    });

    it('code 유효 시 에러 미발생', () => {
      expect(() => service.verifyCodeExpiration(false)).not.toThrow();
    });
  });

  describe('verifyOperation', () => {
    it('db operation 실패 시 에러 발생(500, 메시지)', () => {
      expect(() => service.verifyOperation(false)).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.SERVER.ISSUE,
          statusCode: 500,
        }),
      );
    });

    it('db operation 성공시 에러 미발생', () => {
      expect(() => service.verifyOperation(true)).not.toThrow();
    });
  });

  describe('verifyScope', () => {
    it('scope 누락 시 에러 발생(500, 메시지)', () => {
      expect(() => service.verifyScope(null)).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.VALIDATION.MISSING.SCOPE,
          statusCode: 500,
        }),
      );
    });

    it('scope 존재 시 scope 반환', () => {
      const scope: ScopeDTO = { id: true, email: false, name: false };
      expect(service.verifyScope(scope)).toBe(scope);
    });
  });

  describe('verifyUpdated', () => {
    it('updated undefined 시 에러 발생(500, 메시지)', () => {
      expect(() => service.verifyUpdated(undefined)).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.VALIDATION.MISSING.CONSENT_UPDATE,
          statusCode: 500,
        }),
      );
    });

    it('updated true 시 에러 미발생', () => {
      expect(service.verifyUpdated(true)).toBe(true);
    });

    it('updated false 시 에러 미발생', () => {
      expect(service.verifyUpdated(false)).toBe(true);
    });
  });
});
