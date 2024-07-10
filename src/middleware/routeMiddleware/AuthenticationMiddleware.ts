import createError from 'http-errors';
import { Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { JwtPayload } from 'jsonwebtoken';

import User from '@entities/User';
import TokenService from '@services/TokenService';
import type { EnvConfig } from '@lib/dotenv-env';
import { ERROR_MESSAGES } from '@constants/errorMessages';
import { IOauthRequest } from 'src/adapters/interfaces/IOauthRequest';

@injectable()
class AuthenticationMiddleware {
  constructor(
    @inject('env') private env: EnvConfig,
    @inject(TokenService) private tokenService: TokenService,
  ) {}

  public handle = (
    req: IOauthRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (req.session.user) {
      return next();
    }

    const token = req.cookies.auth_token;

    if (!token) {
      return this.handleUnauthenticatedUser(req, res);
    }

    this.verifyAndSetUserSession(token, req, res, next);
  };

  private handleUnauthenticatedUser(req: IOauthRequest, res: Response): void {
    if (req.originalUrl.startsWith('/oauth')) {
      req.session.unVerifiedRefererUri = req.headers.referer;
      res.render('oauth/login', req.query);
    } else {
      res.redirect('/login');
    }
  }

  private verifyAndSetUserSession(
    token: string,
    req: IOauthRequest,
    res: Response,
    next: NextFunction,
  ): void {
    try {
      const user = this.tokenService.verifyToken<User & JwtPayload>(
        token,
        this.env.loginJWTSecretKey,
      );
      req.session.user = user;
      next();
    } catch (error) {
      this.handleTokenVerificationError(error, res, next);
    }
  }

  private handleTokenVerificationError(
    error: unknown,
    res: Response,
    next: NextFunction,
  ): void {
    if (error instanceof Error) {
      switch (error.name) {
        case 'JsonWebTokenError':
          return next(createError(401, ERROR_MESSAGES.VALIDATION.FORMAT.TOKEN));
        case 'TokenExpiredError':
          res.clearCookie('auth_token');
          return next(
            createError(401, ERROR_MESSAGES.VALIDATION.EXPIRED.TOKEN),
          );
        default:
          return next(error);
      }
    }
    next(error);
  }
}

export default AuthenticationMiddleware;
