import { injectable, inject } from 'inversify';

import { ClientsDTO } from '@dtos/ClientsDTO';
import ClientsRepository from '@repository/ClientsRepository';
import OAuthVerifierService from '@services/OAuthVerifierService';

@injectable()
class ClientDetailsLoaderUseCase {
  constructor(
    @inject(ClientsRepository) private clientsRepository: ClientsRepository,
    @inject(OAuthVerifierService)
    private oAuthVerifierService: OAuthVerifierService,
  ) {}

  async execute(id?: string): Promise<ClientsDTO | null> {
    const verifiedId = this.oAuthVerifierService.verifyId(id);

    const fetchedClients = await this.clientsRepository.findById(verifiedId);

    return fetchedClients;
  }
}

export default ClientDetailsLoaderUseCase;
