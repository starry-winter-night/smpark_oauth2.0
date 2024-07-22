import { injectable, inject } from 'inversify';
import { Collection, ClientSession, DeleteResult } from 'mongodb';

import MongoDB from '@database/MongoDB';
import { TokenDTO } from '@dtos/TokenDTO';
import { ITokenRepository } from '@domain-interfaces/repository/ITokenRepository';

@injectable()
class TokenRepository implements ITokenRepository<ClientSession> {
  private collection: Collection<TokenDTO>;

  constructor(@inject(MongoDB) database: MongoDB) {
    this.collection = database.getCollection('tokens');
  }

  async findById(id: string): Promise<TokenDTO | null> {
    const result = await this.collection.findOne({ id });
    return result || null;
  }

  async upsert(
    token: TokenDTO,
    options?: { transactionContext?: ClientSession },
  ): Promise<boolean> {
    const session = options?.transactionContext;
    const result = await this.collection.updateOne(
      { id: token.id },
      { $set: token },
      { upsert: true, session },
    );
    return (
      result.acknowledged &&
      (result.modifiedCount > 0 || result.upsertedCount > 0)
    );
  }

  async delete(code: string): Promise<DeleteResult> {
    return await this.collection.deleteOne({ code });
  }
}

export default TokenRepository;
