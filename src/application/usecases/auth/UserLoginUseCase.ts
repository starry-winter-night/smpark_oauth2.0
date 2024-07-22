import { injectable, inject } from 'inversify';

import UserMapper from '@mapper/UserMapper';
import { LoginDTO, UserResponseDTO } from '@dtos/UserDTO';
import type { EnvConfig } from '@lib/dotenv-env';
import type { IUserRepository } from '@domain-interfaces/repository/IUserRepository';
import type { IAuthenticationService } from '@domain-interfaces/services/IAuthenticationService';
import type { ITokenService } from '@domain-interfaces/services/ITokenService';
import type { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';
import { IUserLoginUseCase } from '@application-interfaces/usecases/IAuthUseCase';

@injectable()
class UserLoginUseCase implements IUserLoginUseCase {
  constructor(
    @inject('env') private env: EnvConfig,
    @inject(UserMapper) private userMapper: UserMapper,
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('ITokenService') private tokenService: ITokenService,
    @inject('IAuthenticationService') private authService: IAuthenticationService,
    @inject('IOAuthVerifierService') private oAuthVerifierService: IOAuthVerifierService,
  ) {}

  async execute(loginDTO: LoginDTO): Promise<UserResponseDTO> {
    const { id, password } = this.authService.verifySignInInfo(loginDTO);
    const fetchedUser = await this.userRepository.findById(id);
    const verifiedUser = this.oAuthVerifierService.verifyUser(fetchedUser);
    const user = this.userMapper.toEntity(verifiedUser);
    await this.authService.authenticate(user, password, verifiedUser.password);

    const loginPayload = { id: user.id, name: user.name, email: user.email };
    const token = this.tokenService.generateToken(
      loginPayload,
      this.env.loginJWTSecretKey,
      Number(this.env.loginExpiresIn),
    );
    const authenticatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return this.userMapper.toUserResponseDTO(authenticatedUser, token);
  }
}

export default UserLoginUseCase;
