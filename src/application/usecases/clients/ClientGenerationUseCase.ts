import { injectable, inject } from 'inversify';

import ClientsService from '@services/ClientsService';
import ClientsRepository from '@repository/ClientsRepository';
import { ClientsRequestDTO, ClientsResponseDTO } from '@dtos/ClientsDTO';
import OAuthVerifierService from '@services/OAuthVerifierService';

@injectable()
class ClientGenerationUseCase {
  constructor(
    @inject(ClientsService) public clientsService: ClientsService,
    @inject(ClientsRepository) public clientsRepository: ClientsRepository,
    @inject(OAuthVerifierService)
    private oAuthVerifierService: OAuthVerifierService,
  ) {}

  async execute(
    clientRequested: ClientsRequestDTO,
    id?: string,
  ): Promise<ClientsResponseDTO | null> {
    const verifiedId = this.oAuthVerifierService.verifyId(id);

    const { client_id, client_secret, api_key } = clientRequested;
    let updatedClients = {};

    if (client_id) {
      updatedClients = {
        ...updatedClients,
        client_id: this.clientsService.generateClientId(verifiedId),
      };
    }
    if (client_secret) {
      updatedClients = {
        ...updatedClients,
        client_secret: this.clientsService.generateClientSecret(),
      };
    }
    if (api_key) {
      updatedClients = {
        ...updatedClients,
        api_key: this.clientsService.generateAPIKey(),
      };
    }

    const fetchedClients = await this.clientsRepository.updateByClients(
      verifiedId,
      updatedClients,
    );

    this.oAuthVerifierService.verifyOperation(fetchedClients ? true : false);

    return fetchedClients;
  }
}
export default ClientGenerationUseCase;
