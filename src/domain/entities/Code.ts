class Code {
  constructor(
    public id: string,
    public code: string,
    public expiresAt: number,
  ) {
    this.id = id;
    this.code = code;
    this.expiresAt = expiresAt;
  }
}

export default Code;
