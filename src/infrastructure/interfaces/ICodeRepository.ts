import { DeleteResult } from 'mongodb';

import { CodeDTO } from '@dtos/CodeDTO';

export interface ICodeRepository {
  findById(id: string): Promise<CodeDTO | null>;
  findByCode(code: string): Promise<CodeDTO | null>;
  updateByCode(code: CodeDTO): Promise<boolean>;
  deleteByCode(code: string): Promise<DeleteResult>;
}
