import xss from 'xss';
import createError from 'http-errors';
import { injectable } from 'inversify';

import {
  AuthorizeRequestDTO,
  TokenRequestDTO,
  TokenResponseDTO,
} from '@dtos/OAuthDTO';
import { RequestValidDTO } from '@dtos/ClientsDTO';
import { ERROR_MESSAGES } from '@constants/errorMessages';
import { GrantType } from '@enums/oauth';
import { IOAuthRequestValidService } from '@domain-interfaces/services/IOAuthRequestValidService';

@injectable()
class OAuthRequestValidService implements IOAuthRequestValidService {
  validateAuthorizationRequest(
    request: AuthorizeRequestDTO,
    clients?: RequestValidDTO | null,
  ): void {
    this.validateField(
      ERROR_MESSAGES.VALIDATION.MISSING.CLIENT_ID,
      ERROR_MESSAGES.VALIDATION.MISMATCH.CLIENT_ID,
      request.client_id,
      clients?.client_id,
    );

    this.validateField(
      ERROR_MESSAGES.VALIDATION.MISSING.REDIRECT_URI,
      ERROR_MESSAGES.VALIDATION.MISMATCH.REDIRECT_URI,
      request.redirect_uri,
      clients?.redirect_uri,
    );

    this.validateReferer(request.referer_uri, clients?.address_uri);
    this.validateResponseType(request.response_type);
  }

  validateTokenRequest(
    request: TokenRequestDTO,
    oauth?: TokenRequestDTO | null,
  ): TokenResponseDTO {
    const client_id = this.validateField(
      ERROR_MESSAGES.VALIDATION.MISSING.CLIENT_ID,
      ERROR_MESSAGES.VALIDATION.MISMATCH.CLIENT_ID,
      request.client_id,
      oauth?.client_id,
    );
    const client_secret = this.validateField(
      ERROR_MESSAGES.VALIDATION.MISSING.CLIENT_SECRET,
      ERROR_MESSAGES.VALIDATION.MISMATCH.CLIENT_SECRET,
      request.client_secret,
      oauth?.client_secret,
    );
    const redirect_uri = this.validateField(
      ERROR_MESSAGES.VALIDATION.MISSING.REDIRECT_URI,
      ERROR_MESSAGES.VALIDATION.MISMATCH.REDIRECT_URI,
      request.redirect_uri,
      oauth?.redirect_uri,
    );
    const code = this.validateField(
      ERROR_MESSAGES.VALIDATION.MISSING.CODE,
      ERROR_MESSAGES.VALIDATION.MISMATCH.CODE,
      request.code,
      oauth?.code,
    );
    const grant_type = this.validateGrantType(request.grant_type);

    return {
      client_id,
      client_secret,
      redirect_uri,
      code,
      grant_type,
    };
  }

  private validateField(
    missingErrorMsg: string,
    mismatchErrorMsg: string,
    requestValue?: string,
    clientValue?: string,
  ): string {
    if (!requestValue) {
      throw createError(400, missingErrorMsg);
    }

    if (clientValue && requestValue !== clientValue) {
      throw createError(401, mismatchErrorMsg);
    }

    return requestValue;
  }

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

  private validateResponseType(responseType?: string): string {
    if (responseType && responseType.toLowerCase() !== 'code') {
      throw createError(
        401,
        ERROR_MESSAGES.VALIDATION.UNSUPPORTED.RESPONSE_TYPE,
      );
    }

    if (!responseType) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.RESPONSE_TYPE);
    }

    return responseType;
  }

  private validateGrantType(grantType?: string): GrantType {
    if (!grantType) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.GRANT_TYPE);
    }

    if (grantType !== 'authorization_code' && grantType !== 'refresh_token') {
      throw createError(401, ERROR_MESSAGES.VALIDATION.UNSUPPORTED.GRANT_TYPE);
    }
    return grantType;
  }

  private normalizeUri(uri: string): string {
    const filteredUri = xss(uri);
    return filteredUri.endsWith('/') ? filteredUri.slice(0, -1) : filteredUri;
  }
}

export default OAuthRequestValidService;
