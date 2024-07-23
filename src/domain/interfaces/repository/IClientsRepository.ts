import { ClientsDetailDTO, ClientsDTO, CredentialResponseDTO } from '@dtos/ClientsDTO';

export interface IClientsRepository<TContext = void> {
  findById(id: string): Promise<ClientsDTO | null>;

  findByClients(credentials: {
    clientId: string;
    clientSecret: string;
  }): Promise<ClientsDTO | null>;

  update(id: string, updates: Partial<ClientsDTO>): Promise<CredentialResponseDTO | null>;

  save(client: ClientsDetailDTO, options?: { transactionContext?: TContext }): Promise<boolean>;
}
