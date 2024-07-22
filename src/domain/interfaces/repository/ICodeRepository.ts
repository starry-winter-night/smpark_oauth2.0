import { CodeDTO } from '@dtos/CodeDTO';

export interface ICodeRepository {
  findById(id: string): Promise<CodeDTO | null>;
  findByCode(code: string): Promise<CodeDTO | null>;
  update(code: CodeDTO): Promise<boolean>;
  delete(code: string): Promise<boolean>;
}
