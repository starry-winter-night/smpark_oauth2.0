import { injectable, inject } from 'inversify';
import { Collection, ClientSession } from 'mongodb';

import MongoDB from '@database/MongoDB';
import UserMapper from '@mapper/UserMapper';
import { UserDTO } from '@dtos/UserDTO';
import { ScopeDTO } from '@dtos/TokenDTO';
import { IUserRepository } from 'src/infrastructure/interfaces/IUserRepository';

@injectable()
class UserRepository implements IUserRepository {
  private collection: Collection<UserDTO>;

  constructor(
    @inject(MongoDB) database: MongoDB,
    @inject(UserMapper) private userMapper: UserMapper,
  ) {
    this.collection = database.getCollection('members');
  }

  async findById(id: string): Promise<UserDTO | null> {
    const result = await this.collection.findOne({ id });
    return result
      ? this.userMapper.toDTO(this.userMapper.toEntity(result), result.password)
      : null;
  }
  async findByEmail(email: string): Promise<UserDTO | null> {
    const result = await this.collection.findOne({ email: email });
    return result
      ? this.userMapper.toDTO(this.userMapper.toEntity(result), result.password)
      : null;
  }

  async updateByAgreedScope(
    id: string,
    agreedScopes: ScopeDTO,
  ): Promise<boolean> {
    const result = await this.collection.updateOne(
      { id },
      { $set: { agreedScopes } },
      { upsert: true },
    );

    return result.modifiedCount > 0 || result.upsertedCount > 0;
  }

  async saveUser(
    userInfo: UserDTO,
    option?: { session: ClientSession },
  ): Promise<boolean> {
    const result = await this.collection.insertOne(userInfo, option);
    return result.acknowledged;
  }
}

export default UserRepository;
