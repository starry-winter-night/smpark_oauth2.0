class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public agreedScopes: { id: boolean; email: boolean; name: boolean },
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.agreedScopes = agreedScopes;
  }

  isValidId(id: string): boolean {
    const idPattern = /^[a-zA-Z0-9]{4,16}$/;

    return idPattern.test(id);
  }

  isValidPassword(passwordHash: string): boolean {
    const passwordPattern = /^(?=.*\S).+$/;

    return passwordPattern.test(passwordHash);
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailPattern.test(email);
  }

  isValidName(name: string): boolean {
    const namePattern = /^[^\s]{1,200}$/;

    return namePattern.test(name);
  }
}

export default User;
