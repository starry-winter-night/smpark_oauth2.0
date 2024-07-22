import { injectable, inject } from 'inversify';

import ClientsMapper from '@mapper/ClientsMapper';
import { ClientsDTO } from '@dtos/ClientsDTO';
import type { IClientsRepository } from '@domain-interfaces/repository/IClientsRepository';
import type { IClientsService } from '@domain-interfaces/services/IClientsService';
import type { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';
import { IClientDetailsRegistrationUseCase } from '@application-interfaces/usecases/IClientsUseCase';

@injectable()
class ClientDetailsRegistrationUseCase implements IClientDetailsRegistrationUseCase {
  constructor(
    @inject(ClientsMapper) private clientsMapper: ClientsMapper,
    @inject('IClientsRepository') private clientsRepository: IClientsRepository,
    @inject('IClientsService') private clientsService: IClientsService,
    @inject('IOAuthVerifierService') private oAuthVerifierService: IOAuthVerifierService,
  ) {}

  async execute(clientsData: ClientsDTO, id?: string): Promise<void> {
    const verifiedId = this.oAuthVerifierService.verifyId(id);
    const clientEntity = this.clientsMapper.toEntity(clientsData);

    this.clientsService.validateClientsDetail(clientEntity);

    const existingClient = await this.clientsRepository.findById(verifiedId);

    if (!existingClient) {
      await this.createNewClient(clientsData, verifiedId);
    } else {
      await this.updateExistingClient(clientsData, verifiedId);
    }
  }

  private async createNewClient(
    clientsData: ClientsDTO,
    id: string,
  ): Promise<void> {
    const newClientData = { ...clientsData, id };
    const isSaved = await this.clientsRepository.save(newClientData);
    this.verifyOperation(isSaved, 'Client creation');
  }

  private async updateExistingClient(
    clientsData: ClientsDTO,
    id: string,
  ): Promise<void> {
    const isUpdated = await this.clientsRepository.update(id, clientsData);
    this.verifyOperation(isUpdated !== null, 'Client update');
  }

  private verifyOperation(isSuccessful: boolean, operationType: string): void {
    this.oAuthVerifierService.verifyOperation(isSuccessful);
    if (!isSuccessful) {
      throw new Error(`${operationType} failed`);
    }
  }
}

export default ClientDetailsRegistrationUseCase;
