import { injectable, inject } from 'inversify';

import { ClientsRequestDTO, ClientsResponseDTO } from '@dtos/ClientsDTO';
import type { IClientsRepository } from '@domain-interfaces/repository/IClientsRepository';
import type { IClientsService } from '@domain-interfaces/services/IClientsService';
import type { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';
import { IClientGenerationUseCase } from '@application-interfaces/usecases/IClientsUseCase';

@injectable()
class ClientGenerationUseCase implements IClientGenerationUseCase {
  constructor(
    @inject('IClientsService') public clientsService: IClientsService,
    @inject('IClientsRepository') public clientsRepository: IClientsRepository,
    @inject('IOAuthVerifierService') private oAuthVerifierService: IOAuthVerifierService,
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

    const fetchedClients = await this.clientsRepository.update(
      verifiedId,
      updatedClients,
    );

    this.oAuthVerifierService.verifyOperation(fetchedClients ? true : false);

    return fetchedClients;
  }
}
export default ClientGenerationUseCase;
