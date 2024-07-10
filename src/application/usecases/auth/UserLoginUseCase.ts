import { injectable, inject } from 'inversify';

import UserMapper from '@mapper/UserMapper';
import { UserResponseDTO } from '@dtos/UserDTO';
import AuthenticationService from '@services/AuthenticationService';
import TokenService from '@services/TokenService';
import OAuthVerifierService from '@services/OAuthVerifierService';
import UserRepository from '@repository/UserRepository';
import type { EnvConfig } from '@lib/dotenv-env';

@injectable()
class UserLoginUseCase {
  constructor(
    @inject('env') private env: EnvConfig,
    @inject(TokenService) private tokenService: TokenService,
    @inject(AuthenticationService) private authService: AuthenticationService,
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(UserMapper) private userMapper: UserMapper,
    @inject(OAuthVerifierService)
    private oAuthVerifierService: OAuthVerifierService,
  ) {}

  async execute(id: string, password: string): Promise<UserResponseDTO> {
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
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return { sessionUser, token };
  }
}

export default UserLoginUseCase;
