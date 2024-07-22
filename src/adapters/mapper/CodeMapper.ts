import { injectable } from 'inversify';
import { CodeDTO } from '@dtos/CodeDTO';

@injectable()
class CodeMapper {
  toDTO(id: string, code: string, expiresAt: number): CodeDTO {
    return new CodeDTO(id, code, expiresAt);
  }
}

export default CodeMapper;
