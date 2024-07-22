import { GrantType } from '@enums/oauth';

export class AuthorizeRequestDTO {
  constructor(
    public client_id?: string,
    public redirect_uri?: string,
    public referer_uri?: string,
    public scope?: string,
    public state?: string,
    public response_type?: ResponseType,
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

export class TokenResponseDTO {
  constructor(
    public client_id: string,
    public client_secret: string,
    public code: string,
    public redirect_uri: string,
    public grant_type: GrantType,
  ) {}
}
