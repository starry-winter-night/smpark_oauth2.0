import Clients from '@entities/Clients';

export interface IClientsService {
  generateClientId(id: string): string;
  generateClientSecret(): string;
  generateAPIKey(): string;
  validateClientsDetail(clients: Clients): void;
}
