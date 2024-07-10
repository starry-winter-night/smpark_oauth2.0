export class UserDTO {
  constructor(
    public id: string,
    public password: string,
    public name: string,
    public email: string,
    public agreedScopes: { id: boolean; email: boolean; name: boolean },
  ) {}
}

export class UserResponseDTO {
  constructor(
    public sessionUser: { id: string; name: string; email: string },
    public token: string,
  ) {}
}
