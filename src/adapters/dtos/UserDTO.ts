export class UserDTO {
  constructor(
    public id: string,
    public password: string,
    public name: string,
    public email: string,
    public agreedScopes?: { id: boolean; email: boolean; name: boolean },
  ) {}
}

export class LoginDTO {
  constructor(
    public id?: string,
    public password?: string,
  ) {}
}

export class RegisterDTO {
  constructor(
    public id?: string,
    public password?: string,
    public name?: string,
    public email?: string,
  ) {}
}

export class UserResponseDTO {
  constructor(
    public authenticatedUser: { id: string; name: string; email: string },
    public token: string,
  ) {}
}
