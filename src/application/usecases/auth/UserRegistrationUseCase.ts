import { injectable, inject } from 'inversify';

import UserMapper from '@mapper/UserMapper';
import { UserDTO } from '@dtos/UserDTO';
import AuthenticationService from '@services/AuthenticationService';
import OAuthVerifierService from '@services/OAuthVerifierService';
import UserRepository from '@repository/UserRepository';

@injectable()
class UserRegistrationUseCase {
  constructor(
    @inject(AuthenticationService) private authService: AuthenticationService,
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(UserMapper) private userMapper: UserMapper,
    @inject(OAuthVerifierService)
    private oAuthVerifierService: OAuthVerifierService,
  ) {}

  async execute(userRegisterInfo: UserDTO): Promise<void> {
    const user = this.userMapper.toEntity(userRegisterInfo);

    this.authService.validateSignupInfo(user);

    const { id, password } = userRegisterInfo;

    const fetchedUser = await this.userRepository.findById(id);

    this.oAuthVerifierService.verifyRegUser(fetchedUser);

    // const userByEmail = await this.userRepository.findByEmail(email); // 이메일 관련 기능 보류

    const hashedPassword = await this.authService.hashedPassword(password);
    const updateuserRegisterInfo = {
      ...userRegisterInfo,
      password: hashedPassword,
    };

    const isSaved = await this.userRepository.saveUser(updateuserRegisterInfo);

    this.oAuthVerifierService.verifyOperation(isSaved);
  }
}

export default UserRegistrationUseCase;
