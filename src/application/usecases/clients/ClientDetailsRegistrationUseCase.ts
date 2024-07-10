import { injectable, inject } from 'inversify';

import ClientsMapper from '@mapper/ClientsMapper';
import ClientsService from '@services/ClientsService';
import ClientsRepository from '@repository/ClientsRepository';
import { ClientsDTO } from '@dtos/ClientsDTO';
import OAuthVerifierService from '@services/OAuthVerifierService';

@injectable()
class ClientDetailsRegistrationUseCase {
  constructor(
    @inject(ClientsMapper) private clientsMapper: ClientsMapper,
    @inject(ClientsRepository) private clientsRepository: ClientsRepository,
    @inject(ClientsService) private clientsService: ClientsService,
    @inject(OAuthVerifierService)
    private oAuthVerifierService: OAuthVerifierService,
  ) {}

  async execute(ClientsData: ClientsDTO, id?: string): Promise<void> {
    const verifiedId = this.oAuthVerifierService.verifyId(id);

    this.clientsService.validateClientsDetail(
      this.clientsMapper.toEntity(ClientsData),
    );

    const fetchedClient = await this.clientsRepository.findById(verifiedId);

    if (!fetchedClient) {
      const isSaved =
        await this.clientsRepository.saveClientsDetail(ClientsData);

      this.oAuthVerifierService.verifyOperation(isSaved);
    } else {
      const isUpdated = await this.clientsRepository.updateByClientsDetail(
        verifiedId,
        ClientsData,
      );

      this.oAuthVerifierService.verifyOperation(isUpdated);
    }
  }
}

export default ClientDetailsRegistrationUseCase;
