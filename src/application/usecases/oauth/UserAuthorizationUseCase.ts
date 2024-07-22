import { injectable, inject } from 'inversify';

import { AuthorizeRequestDTO } from '@dtos/OAuthDTO';
import ClientsMapper from '@mapper/ClientsMapper';
import type { IClientsRepository } from '@domain-interfaces/repository/IClientsRepository';
import type { IOAuthRequestValidService } from '@domain-interfaces/services/IOAuthRequestValidService';
import { IUserAuthorizationUseCase } from '@application-interfaces/usecases/IOAuthUseCase';

@injectable()
class UserAuthorizationUseCase implements IUserAuthorizationUseCase{
  constructor(
    @inject('IClientsRepository') private clientsRepository: IClientsRepository,
    @inject('IOAuthRequestValidService') private oAuthRequestValidService: IOAuthRequestValidService,
    @inject(ClientsMapper) private clientsMapper: ClientsMapper,
  ) {}

  async execute(
    authorizeRequest: AuthorizeRequestDTO,
    id?: string,
  ): Promise<void> {
    if (id) {
      const fetchedClient = await this.clientsRepository.findById(id);

      this.oAuthRequestValidService.validateAuthorizationRequest(
        authorizeRequest,
        fetchedClient
          ? this.clientsMapper.toRequestValidDTO(fetchedClient)
          : null,
      );
    } else {
      this.oAuthRequestValidService.validateAuthorizationRequest(
        authorizeRequest,
      );
    }
  }
}

export default UserAuthorizationUseCase;
