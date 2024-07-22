import argon2 from 'argon2';
import createError from 'http-errors';
import { injectable } from 'inversify';

import User from '@entities/User';
import { ERROR_MESSAGES } from '@constants/errorMessages';
import { IAuthenticationService } from '@domain-interfaces/services/IAuthenticationService';
import { UserDTO, LoginDTO, RegisterDTO } from '@dtos/UserDTO';

@injectable()
class AuthenticationService implements IAuthenticationService {
  async hashedPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await argon2.verify(hashedPassword, password);
  }

  validSignUpInfo(user: User): void {
    const isId = user.isValidId(user.id);

    if (!isId) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.FORMAT.USERNAME);
    }

    const isEmail = user.isValidEmail(user.email);

    if (!isEmail) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.FORMAT.EMAIL);
    }

    const isName = user.isValidName(user.name);

    if (!isName) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.FORMAT.NAME);
    }
  }

  verifySignUpInfo(user: RegisterDTO): UserDTO {
    const { id, password, name, email } = user;

    if (!id) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.ID);
    }

    if (!password) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.PASSWORD);
    }

    if (!name) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.NAME);
    }

    if (!email) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.EMAIL);
    }

    return { id, password, name, email };
  }

  verifySignInInfo(user: LoginDTO): { id: string; password: string } {
    const { id, password } = user;

    if (!id) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.ID);
    }

    if (!password) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.PASSWORD);
    }

    return { id, password };
  }

  async authenticate(user: User, password: string, hashedPassword: string): Promise<void> {
    const isId = user.isValidId(user.id);
    const isPassword = isId && user.isValidPassword(password);
    const isCompare = isPassword && (await this.comparePassword(password, hashedPassword));

    if (!isId || !isPassword || !isCompare) {
      throw createError(401, ERROR_MESSAGES.VALIDATION.MISMATCH.CREDENTIALS);
    }
  }
}

export default AuthenticationService;
