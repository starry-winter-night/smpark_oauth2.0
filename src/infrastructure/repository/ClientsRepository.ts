import { injectable, inject } from 'inversify';
import { Collection, ClientSession } from 'mongodb';

import MongoDB from '@database/MongoDB';
import ClientsMapper from '@mapper/ClientsMapper';
import { ClientsDTO, ClientsResponseDTO } from '@dtos/ClientsDTO';
import { IClientsRepository } from 'src/infrastructure/interfaces/IClientsRepository';

@injectable()
class ClientsRepository implements IClientsRepository {
  private collection: Collection<ClientsDTO>;

  constructor(
    @inject(MongoDB) database: MongoDB,
    @inject(ClientsMapper) private clientsMapper: ClientsMapper,
  ) {
    this.collection = database.getCollection('clients');
  }

  async findById(id: string): Promise<ClientsDTO | null> {
    const result = await this.collection.findOne({ id });
    return result || null;
  }

  async findByClients(clients: {
    client_id: string;
    client_secret: string;
  }): Promise<ClientsDTO | null> {
    const result = await this.collection.findOne(clients);
    return result || null;
  }

  async updateByClients(
    id: string,
    clients: { client_id?: string; client_secret?: string; api_key?: string },
  ): Promise<ClientsResponseDTO | null> {
    const result = await this.collection.findOneAndUpdate(
      { id },
      { $set: clients },
      { returnDocument: 'after', upsert: true },
    );

    return result ? this.clientsMapper.toClientsResponseDTO(result) : null;
  }

  async updateByClientsDetail(
    id: string,
    clients: ClientsDTO,
  ): Promise<boolean> {
    const result = await this.collection.updateOne({ id }, { $set: clients });
    return result.acknowledged && result.matchedCount > 0;
  }

  async saveClientsDetail(
    clients: ClientsDTO,
    option?: { session: ClientSession },
  ): Promise<boolean> {
    const result = await this.collection.insertOne(clients, option);
    return result.acknowledged;
  }
}

export default ClientsRepository;
