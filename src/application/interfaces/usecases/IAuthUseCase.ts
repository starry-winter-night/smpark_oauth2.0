import { LoginDTO, RegisterDTO, UserResponseDTO } from '@dtos/UserDTO';

export interface IUserLoginUseCase {
  execute(authenticationDTO: LoginDTO): Promise<UserResponseDTO>;
}

export interface IUserRegistrationUseCase {
  execute(userRegisterInfo: RegisterDTO): Promise<void>;
}
