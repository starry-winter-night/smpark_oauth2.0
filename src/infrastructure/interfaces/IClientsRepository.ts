import { ClientSession } from 'mongodb';

import { ClientsDTO, ClientsResponseDTO } from '@dtos/ClientsDTO';

export interface IClientsRepository {
  findById(id: string): Promise<ClientsDTO | null>;
  findByClients(clients: {
    client_id: string;
    client_secret: string;
  }): Promise<ClientsDTO | null>;
  updateByClients(
    id: string,
    updates: { client_id?: string; client_secret?: string; api_key?: string },
  ): Promise<ClientsResponseDTO | null>;
  updateByClientsDetail(id: string, updates: ClientsDTO): Promise<boolean>;
  saveClientsDetail(
    clients: ClientsDTO,
    option?: { session: ClientSession },
  ): Promise<boolean>;
}
