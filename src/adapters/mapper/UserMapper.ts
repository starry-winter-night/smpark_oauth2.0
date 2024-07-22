import { injectable } from 'inversify';

import User from '@entities/User';
import { UserDTO, LoginDTO, UserResponseDTO, RegisterDTO } from '@dtos/UserDTO';

@injectable()
class UserMapper {
  toUserDTO(user: User, password: string): UserDTO {
    return new UserDTO(user.id, password, user.name, user.email, user.agreedScopes);
  }

  toRegisterDTO(register: RegisterDTO): RegisterDTO {
    return new RegisterDTO(register.id, register.password, register.name, register.email);
  }

  toLoginDTO(id?: string, password?: string): LoginDTO {
    return new LoginDTO(id, password);
  }

  toUserResponseDTO(
    authenticatedUser: { id: string; name: string; email: string },
    token: string,
  ): UserResponseDTO {
    return new UserResponseDTO(authenticatedUser, token);
  }

  toEntity({ id, name, email, agreedScopes }: UserDTO): User {
    return new User(id, name, email, agreedScopes);
  }
}

export default UserMapper;
