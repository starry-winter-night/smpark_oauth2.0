import { GrantType } from '@enums/oauth';

export class CredentialResponseDTO {
  constructor(
    public client_id: string,
    public client_secret: string,
    public api_key: string,
  ) {}
}

export class CredentialRequestDTO {
  constructor(
    public id?: string,
    public client_id?: boolean,
    public client_secret?: boolean,
    public api_key?: boolean,
  ) {}
}

export class RequestValidDTO {
  constructor(
    public client_id: string,
    public redirect_uri: string,
    public address_uri: string,
  ) {}
}

export class ClientsDetailDTO {
  constructor(
    public id: string,
    public application_name: string,
    public redirect_uri: string,
    public address_uri: string,
    public clientAllowedScopes: { id: boolean; email: boolean; name: boolean },
    public grant_type?: GrantType,
    public manager_list?: string[],
  ) {}
}

export class ClientsRequestDTO {
  constructor(
    public id?: string,
    public client_id?: string,
    public client_secret?: string,
    public application_name?: string,
    public redirect_uri?: string,
    public address_uri?: string,
    public clientAllowedScopes?: { id: boolean; email: boolean; name: boolean },
    public grant_type?: GrantType,
    public api_key?: string,
    public manager_list?: string[],
  ) {}
}

export class ClientsDTO {
  constructor(
    public id: string,
    public client_id: string,
    public client_secret: string,
    public application_name: string,
    public redirect_uri: string,
    public address_uri: string,
    public clientAllowedScopes: { id: boolean; email: boolean; name: boolean },
    public grant_type?: GrantType,
    public api_key?: string,
    public manager_list?: string[],
  ) {}
}
