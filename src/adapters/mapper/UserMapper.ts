import { injectable } from 'inversify';

import User from '@entities/User';
import { UserDTO } from '@dtos/UserDTO';

@injectable()
class UserMapper {
  toDTO(user: User, hashedPassword: string): UserDTO {
    return new UserDTO(
      user.id,
      hashedPassword,
      user.name,
      user.email,
      user.agreedScopes,
    );
  }

  toEntity(userDTO: UserDTO): User {
    return new User(
      userDTO.id,
      userDTO.name,
      userDTO.email,
      userDTO.agreedScopes,
    );
  }
}

export default UserMapper;
