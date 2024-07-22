import { injectable, inject } from 'inversify';
import { ClientSession, Collection } from 'mongodb';

import MongoDB from '@database/MongoDB';
import ClientsMapper from '@mapper/ClientsMapper';
import { ClientsDTO, ClientsResponseDTO } from '@dtos/ClientsDTO';
import { IClientsRepository } from '@domain-interfaces/repository/IClientsRepository';

@injectable()
class ClientsRepository implements IClientsRepository<ClientSession> {
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

  async findByClients(credentials: {
    clientId: string;
    clientSecret: string;
  }): Promise<ClientsDTO | null> {
    const result = await this.collection.findOne({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
    });
    return result || null;
  }

  async update(
    id: string,
    updates: Partial<ClientsDTO>,
  ): Promise<ClientsResponseDTO | null> {
    const result = await this.collection.findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after', upsert: true },
    );

    return result ? this.clientsMapper.toClientsResponseDTO(result) : null;
  }

  async save(
    client: ClientsDTO,
    options?: { transactionContext?: ClientSession },
  ): Promise<boolean> {
    const session = options?.transactionContext;
    const result = await this.collection.updateOne(
      { id: client.id },
      { $set: client },
      { upsert: true, session },
    );
    return result.acknowledged && result.matchedCount > 0;
  }
}

export default ClientsRepository;
