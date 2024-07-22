import { IOauthRequest } from '@adapters-interfaces/express/IOauthRequest';
import { Response, NextFunction } from 'express';

export interface IAuthenticationMiddleware {
  handle(req: IOauthRequest, res: Response, next: NextFunction): void;
}
