class Token {
  constructor(
    public id: string,
    public accessToken: string,
    public refreshToken: string,
    public expiresAt: number,
    public tokenGrantedScopes: { id: boolean; email: boolean; name: boolean },
  ) {
    this.id = id;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;
    this.tokenGrantedScopes = tokenGrantedScopes;
  }
}

export default Token;
