import { ClientsRequestDTO, CredentialRequestDTO, ClientsDTO } from '@dtos/ClientsDTO';
import Clients from '@entities/Clients';

export interface IClientsService {
  generateClientId(id: string): string;
  generateClientSecret(): string;
  generateAPIKey(): string;
  validClientsDetail(clients: Clients): void;
  verifyClientsDetail(clientsDetailDTO: ClientsRequestDTO): ClientsDTO;
  verifyCredentialRequest(credentialRequest: CredentialRequestDTO): CredentialRequestDTO;
}
