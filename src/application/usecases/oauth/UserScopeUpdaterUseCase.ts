import { injectable, inject } from 'inversify';

import { ScopeRequestDTO } from '@dtos/OAuthDTO';
import type { IUserRepository } from '@domain-interfaces/repository/IUserRepository';
import type { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';
import { IUserScopeUpdaterUseCase } from '@application-interfaces/usecases/IOAuthUseCase';

@injectable()
class UserScopeUpdaterUseCase implements IUserScopeUpdaterUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IOAuthVerifierService') private oAuthVerifierService: IOAuthVerifierService,
  ) {}

  async execute(scopeRequest: ScopeRequestDTO): Promise<void> {
    const { id, agreedScope, updated } = scopeRequest;
    const verifiedId = this.oAuthVerifierService.verifyId(id);
    const verifiedScope = this.oAuthVerifierService.verifyScope(agreedScope);
    this.oAuthVerifierService.verifyUpdated(updated);

    if (updated) {
      const isUpdated = await this.userRepository.updateAgreedScope(verifiedId, verifiedScope);

      this.oAuthVerifierService.verifyOperation(isUpdated);
    }
  }
}

export default UserScopeUpdaterUseCase;
