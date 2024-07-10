import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import UserLoginUseCase from '@usecases/auth/UserLoginUseCase';
import UserRegistrationUseCase from '@usecases/auth/UserRegistrationUseCase';
import { authSerialize } from '@utils/serialize';
import type { EnvConfig } from '@lib/dotenv-env';

@injectable()
class AuthenticationController {
  constructor(
    @inject('env') private env: EnvConfig,
    @inject(UserLoginUseCase) private userLoginUseCase: UserLoginUseCase,
    @inject(UserRegistrationUseCase)
    private userRegistrationUseCase: UserRegistrationUseCase,
  ) {}
  renderLoginPage(req: Request, res: Response): void {
    req.session.user
      ? res.redirect('/oauth/register')
      : res.render('auth/login');
  }

  renderRegisterPage(req: Request, res: Response): void {
    req.session.user
      ? res.redirect('/oauth/register')
      : res.render('auth/register');
  }

  async userLogin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const { id, password } = req.body;

    try {
      const { sessionUser, token } = await this.userLoginUseCase.execute(
        id,
        password,
      );
      res.cookie('auth_token', token, {
        maxAge: Number(this.env.loginExpiresIn),
        httpOnly: true,
      });

      req.session.user = sessionUser;

      req.body = authSerialize(req.body, ['password']);

      return res
        .status(200)
        .send({ message: '로그인 성공', redirect: '/oauth/register' });
    } catch (error) {
      return next(error);
    }
  }
  async userRegister(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const userRegisterInfo = req.body;

    try {
      await this.userRegistrationUseCase.execute(userRegisterInfo);

      req.body = authSerialize(req.body, ['password']);

      return res
        .status(200)
        .send({ message: '회원가입 성공', redirect: '/login' });
    } catch (error) {
      return next(error);
    }
  }

  userLogout(req: Request, res: Response, next: NextFunction): void {
    req.session.destroy((error) => {
      if (error) {
        next(error);
      }
      res.clearCookie('auth_token');
      res.clearCookie('connect.sid');
      return res.redirect('/');
    });
  }
}

export default AuthenticationController;
