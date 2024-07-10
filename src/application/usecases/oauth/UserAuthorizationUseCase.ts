import { injectable, inject } from 'inversify';

import OAuthRequestValidService from '@services/OAuthRequestValidService';
import { AuthorizeRequestDTO } from '@dtos/OAuthDTO';
import ClientsRepository from '@repository/ClientsRepository';
import ClientsMapper from '@mapper/ClientsMapper';

@injectable()
class UserAuthorizationUseCase {
  constructor(
    @inject(ClientsRepository) private clientsRepository: ClientsRepository,
    @inject(OAuthRequestValidService)
    private oAuthRequestValidService: OAuthRequestValidService,
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
