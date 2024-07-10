import { ClientSession } from 'mongodb';

import { UserDTO } from '@dtos/UserDTO';

export interface IUserRepository {
  findById(id: string): Promise<UserDTO | null>;
  findByEmail(email: string): Promise<UserDTO | null>;
  saveUser(
    userInfo: UserDTO,
    option?: { session: ClientSession },
  ): Promise<boolean>;
}
