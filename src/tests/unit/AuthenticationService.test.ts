import AuthenticationService from '@services/AuthenticationService';
import User from '@entities/User';
import { ERROR_MESSAGES } from '@constants/errorMessages';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('@entities/User');

describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let mockUser: jest.Mocked<User>;

  beforeEach(() => {
    authService = new AuthenticationService();
    mockUser = jest.mocked(
      new User('smpark', '박상민', 'smpark@gmail.com', {
        id: true,
        email: false,
        name: false,
      }),
    );
  });

  describe('hashedPassword', () => {
    it('패스워드 해시', async () => {
      jest.mocked(bcrypt.hash).mockImplementation(() => 'hashedPassword');
      const result = await authService.hashedPassword('password');
      expect(result).toBe('hashedPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    });
  });

  describe('comparePassword', () => {
    it('패스워드 비교', async () => {
      jest.mocked(bcrypt.compare).mockImplementation(() => true);
      const result = await authService.comparePassword(
        'password',
        'hashedPassword',
      );
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    });
  });

  describe('validateSignupInfo', () => {
    it('아이디 포맷 불일치 시 에러 발생(400, 메시지)', () => {
      mockUser.isValidId.mockReturnValue(false);

      expect(() => authService.validateSignupInfo(mockUser)).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.VALIDATION.FORMAT.USERNAME,
          status: 400,
        }),
      );
    });

    it('이메일 포맷 불일치 시 에러 발생(400, 메시지)', () => {
      mockUser.isValidId.mockReturnValue(true);
      mockUser.isValidEmail.mockReturnValue(false);

      expect(() => authService.validateSignupInfo(mockUser)).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.VALIDATION.FORMAT.EMAIL,
          status: 400,
        }),
      );
    });

    it('이름 포맷 불일치 시 에러 발생(400, 메시지)', () => {
      mockUser.isValidId.mockReturnValue(true);
      mockUser.isValidEmail.mockReturnValue(true);
      mockUser.isValidName.mockReturnValue(false);

      expect(() => authService.validateSignupInfo(mockUser)).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.VALIDATION.FORMAT.NAME,
          status: 400,
        }),
      );
    });

    it('회원등록 데이터 검증 충족 시 에러 미발생', () => {
      mockUser.isValidId.mockReturnValue(true);
      mockUser.isValidEmail.mockReturnValue(true);
      mockUser.isValidName.mockReturnValue(true);

      expect(() => authService.validateSignupInfo(mockUser)).not.toThrow();
    });
  });

  describe('authenticate', () => {
    it('로그인 인증 실패 시 에러 발생(401, 메시지)', async () => {
      mockUser.isValidId.mockReturnValue(false);
      await expect(() =>
        authService.authenticate(mockUser, 'password', 'hashedPassword'),
      ).rejects.toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.VALIDATION.MISMATCH.CREDENTIALS,
          statusCode: 401,
        }),
      );
    });

    it('로그인 인증 성공 시 에러 미발생', async () => {
      mockUser.isValidId.mockReturnValue(true);
      mockUser.isValidPassword.mockReturnValue(true);
      jest.mocked(bcrypt.compare).mockImplementation(() => true);
      await expect(
        authService.authenticate(mockUser, 'password', 'hashedPassword'),
      ).resolves.not.toThrow();
    });
  });
});
