
import { IOauthRequest } from '@adapters-interfaces/express/IOauthRequest';
import { Response, NextFunction } from 'express';

export interface IClientsController {
  renderClientRegistrationPage(
    req: IOauthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  registerClientsDetail(
    req: IOauthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response>;
  generateCredentials(
    req: IOauthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response>;
}
