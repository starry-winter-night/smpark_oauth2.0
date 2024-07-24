import jwt from 'jsonwebtoken';
import { injectable } from 'inversify';

import { ScopeDTO } from '@dtos/TokenDTO';
import { DEFAULT_SCOPE } from '@constants/scopes';
import { ITokenService } from '@domain-interfaces/services/ITokenService';

@injectable()
class TokenService implements ITokenService {
  generateToken(payload: object, jwtSecretKey: string, expiresIn: number): string {
    const jwtToken = jwt.sign(payload, jwtSecretKey, {
      expiresIn,
    });

    return jwtToken;
  }

  verifyToken<T>(token: string, jwtSecretKey: string): T {
    return jwt.verify(token, jwtSecretKey) as T;
  }

  getDefaultScope(): ScopeDTO {
    return DEFAULT_SCOPE;
  }

  validateScope(allowedScope: ScopeDTO, requestScope: string): Partial<ScopeDTO> {
    const requestScopesArray = requestScope.toLowerCase().split(' ');
    const resultScope: Partial<ScopeDTO> = {};

    for (const key in allowedScope) {
      if (allowedScope[key] === true && requestScopesArray.includes(key)) {
        resultScope[key] = true;
      } else {
        resultScope[key] = false;
      }
    }

    if (!resultScope.id) {
      resultScope.id = true;
    }

    return resultScope;
  }

  calculateJwtExpiresAt(jwtExpiresIn: number): number {
    const currentTimestamp = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
    const jwtExpiresAt = currentTimestamp + jwtExpiresIn; // 만료 시점 계산
    return jwtExpiresAt;
  }
}

export default TokenService;
