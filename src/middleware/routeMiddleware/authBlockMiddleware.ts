import { Request, Response, NextFunction } from 'express';

const authBlockMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.session && req.session.user) {
    return res.redirect('/oauth/register');
  }
  next();
};

export default authBlockMiddleware;
