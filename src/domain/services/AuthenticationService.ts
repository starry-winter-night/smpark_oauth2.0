import bcrypt from 'bcrypt';
import createError from 'http-errors';
import { injectable } from 'inversify';

import User from '@entities/User';
import { ERROR_MESSAGES } from '@constants/errorMessages';

@injectable()
class AuthenticationService {
  async hashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  validateSignupInfo(user: User): void {
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

  async authenticate(
    user: User,
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const isId = user.isValidId(user.id);
    const isPassword = isId && user.isValidPassword(password);
    const isCompare =
      isPassword && (await this.comparePassword(password, hashedPassword));

    if (!isId || !isPassword || !isCompare) {
      throw createError(401, ERROR_MESSAGES.VALIDATION.MISMATCH.CREDENTIALS);
    }
  }
}

export default AuthenticationService;
