import { ClientSession, DeleteResult } from 'mongodb';

import { TokenDTO } from '@dtos/TokenDTO';

export interface ITokenRepository {
  findById(id: string): Promise<TokenDTO | null>;
  updateByToken(id: string, token: TokenDTO): Promise<boolean>;
  deleteByToken(code: string): Promise<DeleteResult>;
  saveToken(
    token: TokenDTO,
    option?: { session: ClientSession },
  ): Promise<boolean>;
}
