import { ClientsDTO, ClientsResponseDTO } from '@dtos/ClientsDTO';

export interface IClientsRepository<TContext = void> {
  findById(id: string): Promise<ClientsDTO | null>;

  findByClients(credentials: {
    clientId: string;
    clientSecret: string;
  }): Promise<ClientsDTO | null>;

  update(
    id: string,
    updates: Partial<ClientsDTO>,
  ): Promise<ClientsResponseDTO | null>;

  save(
    client: ClientsDTO,
    options?: { transactionContext?: TContext },
  ): Promise<boolean>;
}
