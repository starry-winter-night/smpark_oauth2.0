import { ScopeDTO } from '@dtos/TokenDTO';
import { GrantType, ResponseType } from '@enums/oauth';

export class AuthorizeRequestDTO {
  constructor(
    public id?: string,
    public client_id?: string,
    public redirect_uri?: string,
    public referer_uri?: string,
    public scope?: string,
    public state?: string,
    public response_type?: ResponseType,
  ) {}
}

export class ScopeRequestDTO {
  constructor(
    public client_id?: string,
    public scope?: string,
    public updated?: boolean,
    public id?: string,
    public agreedScope?: ScopeDTO,
  ) {}
}

export class ScopeResponseDTO {
  constructor(
    public scope: Partial<ScopeDTO>,
    public updated: boolean,
  ) {}
}

export class TokenRequestDTO {
  constructor(
    public client_id?: string,
    public client_secret?: string,
    public code?: string,
    public codeExpiresAt?: number,
    public redirect_uri?: string,
    public grant_type?: GrantType,
    public refresh_token?: string,
  ) {}
}

export class ValidIdsDTO {
  constructor(
    public client_id: string,
    public id: string,
  ) {}
}

export class TokenValidateDTO {
  constructor(
    public client_id: string,
    public client_secret: string,
    public code: string,
    public redirect_uri: string,
    public grant_type: GrantType,
  ) {}
}
