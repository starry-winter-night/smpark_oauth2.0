export class TokenDTO {
  constructor(
    public id: string,
    public accessToken: string,
    public refreshToken: string,
    public expiresAt: number,
    public tokenGrantedScopes: { id: boolean; email: boolean; name: boolean },
  ) {}
}

export class TokenResponseDTO {
  constructor(
    public accessToken: string,
    public refreshToken: string,
  ) {}
}

export interface ScopeDTO {
  id: boolean;
  email: boolean;
  name: boolean;
  [key: string]: boolean;
}
