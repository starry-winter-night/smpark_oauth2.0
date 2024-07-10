import CodeService from '@services/CodeService';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

describe('CodeService', () => {
  let service: CodeService;

  beforeEach(() => {
    service = new CodeService();
  });

  it('코드 생성', () => {
    jest.mocked(uuidv4).mockReturnValue('asfkl23n2fnd9023f2fn2fhfda');
    const code = service.generateCode();
    expect(code).toBe('asfkl23n2fnd902');
    expect(uuidv4).toHaveBeenCalled();
  });

  it('코드 만료시간 생성', () => {
    const expirationTime = service.calculateExpiryTime(5); // 5분
    expect(expirationTime).toBeGreaterThanOrEqual(new Date().getTime() / 1000); // 현재 시간보다 큰가?
    expect(expirationTime).toBeLessThanOrEqual(
      new Date().getTime() / 1000 + 300,
    ); // 5분 보다 큰가?
  });

  it('코드 만료시간 검증', () => {
    const currentTime = Date.now() / 1000;

    const isExpired = service.validateCodeExpiresAt(currentTime - 1000);
    expect(isExpired).toBe(true);

    const isNotExpired = service.validateCodeExpiresAt(currentTime + 1000);
    expect(isNotExpired).toBe(false);

    const isExpiredSameTime = service.validateCodeExpiresAt(currentTime);
    expect(isExpiredSameTime).toBe(true);
  });
});
