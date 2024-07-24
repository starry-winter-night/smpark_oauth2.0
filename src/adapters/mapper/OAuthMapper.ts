import {
  AuthorizeRequestDTO,
  ScopeResponseDTO,
  ScopeRequestDTO,
  TokenRequestDTO,
  ValidIdsDTO,
} from '@dtos/OAuthDTO';
import { ScopeDTO } from '@dtos/TokenDTO';
import { injectable } from 'inversify';

@injectable()
class OAuthMapper {
  toAuthorizeRequestDTO(authorizeRequest: AuthorizeRequestDTO): AuthorizeRequestDTO {
    return new AuthorizeRequestDTO(
      authorizeRequest.id,
      authorizeRequest.client_id,
      authorizeRequest.redirect_uri,
      authorizeRequest.referer_uri,
      authorizeRequest.scope,
      authorizeRequest.state,
      authorizeRequest.response_type,
    );
  }

  toScopeRequestDTO({
    client_id,
    scope,
    updated,
    id,
    agreedScope,
  }: ScopeRequestDTO): ScopeRequestDTO {
    return new ScopeRequestDTO(client_id, scope, updated, id, agreedScope);
  }

  toScopeResponseDTO(scope: Partial<ScopeDTO>, updated: boolean): ScopeResponseDTO {
    return new ScopeResponseDTO(scope, updated);
  }

  toTokenRequestDTO(tokenRequest: TokenRequestDTO): TokenRequestDTO {
    return new TokenRequestDTO(
      tokenRequest.client_id,
      tokenRequest.client_secret,
      tokenRequest.code,
      tokenRequest.codeExpiresAt,
      tokenRequest.redirect_uri,
      tokenRequest.grant_type,
      tokenRequest.refresh_token,
    );
  }

  toTokenResponseDTO(tokenResponse: ValidIdsDTO): ValidIdsDTO {
    return new ValidIdsDTO(tokenResponse.client_id, tokenResponse.id);
  }
}

export default OAuthMapper;
