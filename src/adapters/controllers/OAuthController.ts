import createError from 'http-errors';
import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import { authSerialize } from '@utils/serialize';
import { AuthorizeRequestDTO } from '@dtos/OAuthDTO';

import UserLoginUseCase from '@usecases/auth/UserLoginUseCase';
import TokenGenerationUseCase from '@usecases/token/TokenGenerationUseCase';
import CodeGenerationUseCase from '@usecases/oauth/CodeGenerationUseCase';
import UserScopeUpdaterUseCase from '@usecases/oauth/UserScopeUpdaterUseCase';
import UserAuthorizationUseCase from '@usecases/oauth/UserAuthorizationUseCase';
import TokenPreparationUseCase from '@usecases/oauth/TokenPreparationUseCase';
import { ERROR_MESSAGES } from '@constants/errorMessages';
import { TRANSLATIONS } from '@constants/scopes';
import ScopeComparatorUseCase from '@usecases/oauth/ScopeComparatorUseCase';
import { IOauthRequest } from 'src/adapters/interfaces/IOauthRequest';

@injectable()
class OAuthController {
  constructor(
    @inject(UserLoginUseCase)
    private userLoginUseCase: UserLoginUseCase,
    @inject(CodeGenerationUseCase)
    private codeGenerationUseCase: CodeGenerationUseCase,
    @inject(TokenGenerationUseCase)
    private tokenGenerationUseCase: TokenGenerationUseCase,
    @inject(UserScopeUpdaterUseCase)
    private userScopeUpdaterUseCase: UserScopeUpdaterUseCase,
    @inject(UserAuthorizationUseCase)
    private userAuthorizationUseCase: UserAuthorizationUseCase,
    @inject(TokenPreparationUseCase)
    private tokenPreparationUseCase: TokenPreparationUseCase,
    @inject(ScopeComparatorUseCase)
    private scopeComparatorUseCase: ScopeComparatorUseCase,
  ) {}

  async verifyOauthRequest(
    req: IOauthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const request = {
      ...req.query,
      ...req.body,
    };

    const unVerifiedParams: AuthorizeRequestDTO = {
      ...request,
      referer_uri: req.headers.referer || req.session.unVerifiedRefererUri,
    };

    const id = req.session.user?.id;

    try {
      await this.userAuthorizationUseCase.execute(unVerifiedParams, id);

      req.session.verifiedRefererUri = unVerifiedParams.referer_uri;
    } catch (error) {
      next(error);
    }
    next();
  }

  async oAuthUserLogin(
    req: IOauthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const {
      id,
      password,
      client_id,
      redirect_uri,
      state,
      scope,
      response_type,
    } = req.body;

    try {
      const { sessionUser, token } = await this.userLoginUseCase.execute(
        id,
        password,
      );

      res.cookie('auth_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
      });

      req.session.user = sessionUser;

      req.body = authSerialize(req.body, ['password']);

      return res.status(200).send({
        message: '로그인 성공',
        redirect: `/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}&response_type=${response_type}`,
      });
    } catch (error) {
      return next(error);
    }
  }

  async compareScope(
    req: IOauthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const { scope, redirect_uri, state } = req.query;
    const id = req.session.user?.id;

    try {
      const { scope: comparedScope, updated } =
        await this.scopeComparatorUseCase.execute(scope, id);

      Object.assign(req.session, {
        scope: comparedScope,
        updated,
        redirect_uri,
        state,
      });

      return res.render('oauth/consent', {
        scope: comparedScope,
        updated,
        translations: TRANSLATIONS,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserAgreedScope(
    req: IOauthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const { scope, updated } = req.session;
    const id = req.session.user?.id;

    try {
      await this.userScopeUpdaterUseCase.execute(scope, updated, id);

      next();
    } catch (error) {
      next(error);
    }
  }

  async verifyTokenRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return next(
        createError(401, ERROR_MESSAGES.VALIDATION.FORMAT.AUTHENTICATION),
      );
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii',
    );
    const [client_id, client_secret] = credentials.split(':');
    const tokenRequest = req.body;

    const extendedTokenRequest = {
      ...tokenRequest,
      client_id,
      client_secret,
    };
    try {
      req.session.codeValidatedIds =
        await this.tokenPreparationUseCase.execute(extendedTokenRequest);
      next();
    } catch (error) {
      next(error);
    }
  }

  async generateCode(
    req: IOauthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const id = req.session.user?.id;

    try {
      const { redirect_uri, state } = req.session;
      const code = await this.codeGenerationUseCase.execute(id);

      return res.redirect(`${redirect_uri}?code=${code}&state=${state}`);
    } catch (error) {
      next(error);
    }
  }

  async generateAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const ids = req.session.codeValidatedIds;

    try {
      const tokens = await this.tokenGenerationUseCase.execute(ids);

      return res.json({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        token_type: 'Bearer',
      });
    } catch (error) {
      next(error);
    }
  }

  disagree(req: Request, res: Response, next: NextFunction): void {
    const referer = req.session.verifiedRefererUri;
    if (referer) {
      res.redirect(referer);
    } else {
      next(createError(400, ERROR_MESSAGES.VALIDATION.MISSING.REFERER_URI));
    }
  }
}

export default OAuthController;
