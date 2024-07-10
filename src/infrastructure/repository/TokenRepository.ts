import { injectable, inject } from 'inversify';
import { Collection, ClientSession, DeleteResult } from 'mongodb';

import MongoDB from '@database/MongoDB';
import { TokenDTO } from '@dtos/TokenDTO';
import { ITokenRepository } from 'src/infrastructure/interfaces/ITokenRepository';

@injectable()
class TokenRepository implements ITokenRepository {
  private collection: Collection<TokenDTO>;

  constructor(@inject(MongoDB) database: MongoDB) {
    this.collection = database.getCollection('tokens');
  }

  async findById(id: string): Promise<TokenDTO | null> {
    const result = await this.collection.findOne({ id });
    return result || null;
  }

  async updateByToken(id: string, token: TokenDTO): Promise<boolean> {
    const result = await this.collection.updateOne({ id }, { $set: token });

    return result.matchedCount > 0 && result.modifiedCount > 0;
  }

  async deleteByToken(code: string): Promise<DeleteResult> {
    return await this.collection.deleteOne({ code });
  }

  async saveToken(
    token: TokenDTO,
    option?: { session: ClientSession },
  ): Promise<boolean> {
    const result = await this.collection.insertOne(token, option);
    return result.acknowledged;
  }
}

export default TokenRepository;
