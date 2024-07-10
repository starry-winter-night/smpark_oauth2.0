export class TokenDTO {
  constructor(
    public id: string,
    public accessToken: string,
    public refreshToken: string,
    public expiresAt: number,
    public tokenGrantedScopes: { id: boolean; email: boolean; name: boolean },
  ) {}
}

export interface ScopeDTO {
  id: boolean;
  email: boolean;
  name: boolean;
  [key: string]: boolean;
}
