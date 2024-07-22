import { GrantType } from '@enums/oauth';

export class ClientsResponseDTO {
  constructor(
    public client_id: string,
    public client_secret: string,
    public api_key: string,
  ) {}
}

export class ClientsRequestDTO {
  constructor(
    public id: string,
    public client_id: boolean,
    public client_secret: boolean,
    public api_key: boolean,
  ) {}
}

export class RequestValidDTO {
  constructor(
    public client_id: string,
    public redirect_uri: string,
    public address_uri: string,
  ) {}
}

export class ClientsDTO {
  constructor(
    public id: string,
    public client_id: string,
    public client_secret: string,
    public api_key: string,
    public application_name: string,
    public redirect_uri: string,
    public address_uri: string,
    public grant_type: GrantType,
    public clientAllowedScopes: { id: boolean; email: boolean; name: boolean },
  ) {}
}
