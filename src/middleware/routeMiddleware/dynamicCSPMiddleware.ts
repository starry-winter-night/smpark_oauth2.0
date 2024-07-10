import { Response, NextFunction } from 'express';
import createError from 'http-errors';
import helmet from 'helmet';

import { ERROR_MESSAGES } from '@constants/errorMessages';
import { IOauthRequest } from 'src/adapters/interfaces/IOauthRequest';

const dynamicCSPMiddleware = (
  req: IOauthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const refererUri = req.session.verifiedRefererUri;

  if (!refererUri) {
    return next(
      createError(401, ERROR_MESSAGES.VALIDATION.MISSING.REFERER_URI),
    );
  }

  // 동적으로 formAction 설정
  const directives = helmet.contentSecurityPolicy.getDefaultDirectives();
  directives['form-action'] = ["'self'", refererUri];

  helmet.contentSecurityPolicy({
    directives,
  })(req, res, next);
};

export default dynamicCSPMiddleware;
