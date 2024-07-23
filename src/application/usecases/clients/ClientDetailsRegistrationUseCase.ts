import { injectable, inject } from 'inversify';

import ClientsMapper from '@mapper/ClientsMapper';
import { ClientsRequestDTO } from '@dtos/ClientsDTO';
import { IClientDetailsRegistrationUseCase } from '@application-interfaces/usecases/IClientsUseCase';
import type { IClientsRepository } from '@domain-interfaces/repository/IClientsRepository';
import type { IClientsService } from '@domain-interfaces/services/IClientsService';
import type { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';

@injectable()
class ClientDetailsRegistrationUseCase implements IClientDetailsRegistrationUseCase {
  constructor(
    @inject(ClientsMapper) private clientsMapper: ClientsMapper,
    @inject('IClientsRepository') private clientsRepository: IClientsRepository,
    @inject('IClientsService') private clientsService: IClientsService,
    @inject('IOAuthVerifierService') private oAuthVerifierService: IOAuthVerifierService,
  ) {}

  async execute(clientsData: ClientsRequestDTO): Promise<void> {
    const verifiedClients = this.clientsService.verifyClientsDetail(clientsData);
    const clientsEntity = this.clientsMapper.toEntity(verifiedClients);
    this.clientsService.validClientsDetail(clientsEntity);
    const {
      client_id: _client_id,
      client_secret: _client_secret,
      api_key: _api_key,
      ...clientDetail
    } = verifiedClients;

    const isSave = await this.clientsRepository.save(clientDetail);
    this.oAuthVerifierService.verifyOperation(isSave);
  }
}

export default ClientDetailsRegistrationUseCase;
