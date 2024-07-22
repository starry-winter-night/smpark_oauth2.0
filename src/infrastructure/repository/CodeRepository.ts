import { injectable, inject } from 'inversify';
import { Collection } from 'mongodb';

import MongoDB from '@database/MongoDB';
import { CodeDTO } from '@dtos/CodeDTO';
import { ICodeRepository } from '@domain-interfaces/repository/ICodeRepository';

@injectable()
class CodeRepository implements ICodeRepository {
  private collection: Collection<CodeDTO>;

  constructor(@inject(MongoDB) database: MongoDB) {
    this.collection = database.getCollection('codes');
  }

  async findById(id: string): Promise<CodeDTO | null> {
    const result = await this.collection.findOne({ id });
    return result || null;
  }

  async findByCode(code: string): Promise<CodeDTO | null> {
    const result = await this.collection.findOne({ code });
    return result || null;
  }

  async update(code: CodeDTO): Promise<boolean> {
    const result = await this.collection.updateOne(
      { id: code.id },
      { $set: code },
      { upsert: true },
    );

    return result.modifiedCount > 0 || result.upsertedCount > 0;
  }

  async delete(code: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ code });
    return result.acknowledged;
  }
}

export default CodeRepository;
