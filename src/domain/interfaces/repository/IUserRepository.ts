import { ScopeDTO } from '@dtos/TokenDTO';
import { UserDTO } from '@dtos/UserDTO';

export interface IUserRepository<TContext = void> {
  findById(id: string): Promise<UserDTO | null>;
  findByEmail(email: string): Promise<UserDTO | null>;
  updateAgreedScope(id: string, agreedScopes: ScopeDTO): Promise<boolean>;
  save(
    userInfo: UserDTO,
    options?: { transactionContext?: TContext },
  ): Promise<boolean>;
}
