import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { authSerialize } from '@utils/serialize';
import { IAuthenticationController } from '@adapters-interfaces/controllers/IAuthenticationController';
import type { EnvConfig } from '@lib/dotenv-env';
import type {
  IUserLoginUseCase,
  IUserRegistrationUseCase,
} from '@application-interfaces/usecases/IAuthUseCase';
import UserMapper from '@mapper/UserMapper';

@injectable()
class AuthenticationController implements IAuthenticationController {
  constructor(
    @inject('env') private env: EnvConfig,
    @inject(UserMapper) private userMapper: UserMapper,
    @inject('IUserLoginUseCase') private userLoginUseCase: IUserLoginUseCase,
    @inject('IUserRegistrationUseCase')
    private userRegistrationUseCase: IUserRegistrationUseCase,
  ) {}

  renderLoginPage(req: Request, res: Response): void {
    req.session.user ? res.redirect('/oauth/register') : res.render('auth/login');
  }

  renderRegisterPage(req: Request, res: Response): void {
    req.session.user ? res.redirect('/oauth/register') : res.render('auth/register');
  }

  async userLogin(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    const { id, password } = req.body;

    try {
      const loginDTO = this.userMapper.toLoginDTO(id, password);
      const { authenticatedUser, token } = await this.userLoginUseCase.execute(loginDTO);

      res.cookie('auth_token', token, {
        maxAge: Number(this.env.loginExpiresIn) * 1000,
        httpOnly: true,
      });

      req.session.user = authenticatedUser;

      req.body = authSerialize(req.body, ['password']);

      return res.status(200).send({ message: '로그인 성공', redirect: '/oauth/register' });
    } catch (error) {
      return next(error);
    }
  }
  async userRegister(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    const userRegisterInfo = req.body;

    try {
      const registerDTO = this.userMapper.toRegisterDTO(userRegisterInfo);
      await this.userRegistrationUseCase.execute(registerDTO);

      req.body = authSerialize(req.body, ['password']);

      return res.status(200).send({ message: '회원가입 성공', redirect: '/login' });
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
