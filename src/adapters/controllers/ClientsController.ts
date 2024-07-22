import { injectable, inject } from 'inversify';
import { Response, NextFunction } from 'express';

import { IClientsController } from '@adapters-interfaces/controllers/IClientsController';
import { IOauthRequest } from '@adapters-interfaces/express/IOauthRequest';
import type {
  IClientDetailsLoaderUseCase,
  IClientGenerationUseCase,
  IClientDetailsRegistrationUseCase,
} from '@application-interfaces/usecases/IClientsUseCase';

@injectable()
class ClientsController implements IClientsController {
  constructor(
    @inject('IClientDetailsLoaderUseCase')
    private clientDetailsLoaderUseCase: IClientDetailsLoaderUseCase,
    @inject('IClientGenerationUseCase')
    private clientGenerationUseCase: IClientGenerationUseCase,
    @inject('IClientDetailsRegistrationUseCase')
    private clientDetailsRegistrationUseCase: IClientDetailsRegistrationUseCase,
  ) {}

  async renderClientRegistrationPage(
    req: IOauthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const id = req.session.user?.id;
    try {
      const clients = await this.clientDetailsLoaderUseCase.execute(id);

      return res.render('oauth/register', {
        client: clients,
      });
    } catch (error) {
      next(error);
    }
  }

  async registerClientsDetail(
    req: IOauthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const id = req.session.user?.id;

    try {
      const clientsRequested = req.body;
      await this.clientDetailsRegistrationUseCase.execute(clientsRequested, id);

      return res.status(200).send({ message: 'OAuth 등록 완료' });
    } catch (error) {
      next(error);
    }
  }

  async generateCredentials(
    req: IOauthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> {
    const id = req.session.user?.id;

    try {
      const clientRequested = req.body;

      const clients = await this.clientGenerationUseCase.execute(
        clientRequested,
        id,
      );

      return res.status(200).send({ client: clients });
    } catch (error) {
      next(error);
    }
  }
}

export default ClientsController;
