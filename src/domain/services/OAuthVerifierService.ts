import createError from 'http-errors';
import { injectable } from 'inversify';

import { ClientsDTO } from '@dtos/ClientsDTO';
import { CodeDTO } from '@dtos/CodeDTO';
import { UserDTO } from '@dtos/UserDTO';
import { ScopeDTO } from '@dtos/TokenDTO';
import { ERROR_MESSAGES } from '@constants/errorMessages';
import { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';

@injectable()
class OAuthVerifierService implements IOAuthVerifierService {
  private verify<T>(entity: T | null | undefined, errorMessage: string, errorCode?: number): T {
    if (!entity) {
      throw createError(errorCode || 401, errorMessage);
    }
    return entity;
  }

  verifyId(id?: string): string {
    return this.verify(id, ERROR_MESSAGES.LOGIN.REQUIRED);
  }

  verifyIds(ids?: { id: string; client_id: string } | null): {
    id: string;
    client_id: string;
  } {
    return this.verify(ids, ERROR_MESSAGES.LOGIN.REQUIRED);
  }

  verifyUser(user: UserDTO | null): UserDTO {
    return this.verify(user, ERROR_MESSAGES.NOT_FOUND.USER);
  }

  verifyAgreedScopes(agreedScopes?: ScopeDTO): ScopeDTO {
    return this.verify(agreedScopes, ERROR_MESSAGES.NOT_FOUND.AGREED_SCOPES);
  }

  verifyRegUser(user: UserDTO | null): boolean {
    return this.verify(user ? false : true, ERROR_MESSAGES.VALIDATION.DUPLICATE.ID, 409);
  }

  verifyClientId(clientId?: string): string {
    return this.verify(clientId, ERROR_MESSAGES.NOT_FOUND.CLIENT_ID);
  }

  verifyClient(clients: ClientsDTO | null): ClientsDTO {
    return this.verify(clients, ERROR_MESSAGES.NOT_FOUND.CLIENT);
  }

  verifyCodeExists(code: CodeDTO | null): CodeDTO {
    return this.verify(code, ERROR_MESSAGES.NOT_FOUND.CODE);
  }

  verifyCodeExpiration(expired: boolean): void {
    this.verify(expired ? false : true, ERROR_MESSAGES.VALIDATION.EXPIRED.CODE);
  }

  verifyOperation(success: boolean | null): void {
    this.verify(success, ERROR_MESSAGES.SERVER.ISSUE, 500);
  }

  verifyScope(scope?: ScopeDTO | null): ScopeDTO {
    return this.verify(scope, ERROR_MESSAGES.VALIDATION.MISSING.SCOPE, 500);
  }

  verifyUpdated(updated?: boolean): boolean {
    return this.verify(
      typeof updated === 'boolean' ? true : false,
      ERROR_MESSAGES.VALIDATION.MISSING.CONSENT_UPDATE,
      500,
    );
  }
}

export default OAuthVerifierService;
