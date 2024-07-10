import { injectable, inject } from 'inversify';
import { Collection, DeleteResult } from 'mongodb';

import MongoDB from '@database/MongoDB';
import { CodeDTO } from '@dtos/CodeDTO';
import { ICodeRepository } from 'src/infrastructure/interfaces/ICodeRepository';

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

  async updateByCode(code: CodeDTO): Promise<boolean> {
    const result = await this.collection.updateOne(
      { id: code.id },
      { $set: code },
      { upsert: true },
    );

    return result.modifiedCount > 0 || result.upsertedCount > 0;
  }

  async deleteByCode(code: string): Promise<DeleteResult> {
    return await this.collection.deleteOne({ code });
  }
}

export default CodeRepository;
