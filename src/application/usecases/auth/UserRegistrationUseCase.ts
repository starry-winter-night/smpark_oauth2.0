import { injectable, inject } from 'inversify';

import UserMapper from '@mapper/UserMapper';
import { RegisterDTO } from '@dtos/UserDTO';
import type { IUserRepository } from '@domain-interfaces/repository/IUserRepository';
import type { IAuthenticationService } from '@domain-interfaces/services/IAuthenticationService';
import type { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';
import { IUserRegistrationUseCase } from '@application-interfaces/usecases/IAuthUseCase';

@injectable()
class UserRegistrationUseCase implements IUserRegistrationUseCase {
  constructor(
    @inject(UserMapper) private userMapper: UserMapper,
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IAuthenticationService') private authService: IAuthenticationService,
    @inject('IOAuthVerifierService') private oAuthVerifierService: IOAuthVerifierService,
  ) {}

  async execute(userInfo: RegisterDTO): Promise<void> {
    const verifiedInfo = this.authService.verifySignUpInfo(userInfo);

    const user = this.userMapper.toEntity(verifiedInfo);

    this.authService.validSignUpInfo(user);

    const { id, password } = verifiedInfo;

    const fetchedUser = await this.userRepository.findById(id);

    this.oAuthVerifierService.verifyRegUser(fetchedUser);

    // const userByEmail = await this.userRepository.findByEmail(email); // 이메일 관련 기능 보류

    const hashedPassword = await this.authService.hashedPassword(password);
    const updatedInfo = {
      ...verifiedInfo,
      password: hashedPassword,
    };

    const isSaved = await this.userRepository.save(updatedInfo);

    this.oAuthVerifierService.verifyOperation(isSaved);
  }
}

export default UserRegistrationUseCase;
