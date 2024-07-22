import { UserDTO, LoginDTO, RegisterDTO } from '@dtos/UserDTO';
import User from '@entities/User';

export interface IAuthenticationService {
  hashedPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  validSignUpInfo(user: User): void;
  authenticate(user: User, password: string, hashedPassword: string): Promise<void>;
  verifySignInInfo(user: LoginDTO): { id: string; password: string };
  verifySignUpInfo(user: RegisterDTO): UserDTO;
}
