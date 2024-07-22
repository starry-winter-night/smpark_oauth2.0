import { injectable, inject } from 'inversify';

import { ScopeDTO } from '@dtos/TokenDTO';
import type { IUserRepository } from '@domain-interfaces/repository/IUserRepository';
import type { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';
import { IUserScopeUpdaterUseCase } from '@application-interfaces/usecases/IOAuthUseCase';

@injectable()
class UserScopeUpdaterUseCase implements IUserScopeUpdaterUseCase{
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IOAuthVerifierService') private oAuthVerifierService: IOAuthVerifierService,
  ) {}

  async execute(
    scope?: ScopeDTO,
    updated?: boolean,
    id?: string,
  ): Promise<void> {
    const verifiedId = this.oAuthVerifierService.verifyId(id);
    const verifiedScope = this.oAuthVerifierService.verifyScope(scope);
    this.oAuthVerifierService.verifyUpdated(updated);

    if (updated) {
      const isUpdated = await this.userRepository.updateAgreedScope(
        verifiedId,
        verifiedScope,
      );

      this.oAuthVerifierService.verifyOperation(isUpdated);
    }
  }
}

export default UserScopeUpdaterUseCase;
