import { Request, Response, NextFunction } from 'express';

export interface IAuthenticationController {
  renderLoginPage(req: Request, res: Response): void;
  renderRegisterPage(req: Request, res: Response): void;
  userLogin(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  userRegister(req: Request, res: Response, next: NextFunction): Promise<void | Response>;
  userLogout(req: Request, res: Response, next: NextFunction): void;
}