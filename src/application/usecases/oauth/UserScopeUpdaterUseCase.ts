import { injectable, inject } from 'inversify';

import UserRepository from '@repository/UserRepository';
import { ScopeDTO } from '@dtos/TokenDTO';
import OAuthVerifierService from '@services/OAuthVerifierService';

@injectable()
class UserScopeUpdaterUseCase {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(OAuthVerifierService)
    private oAuthVerifierService: OAuthVerifierService,
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
      const isUpdated = await this.userRepository.updateByAgreedScope(
        verifiedId,
        verifiedScope,
      );

      this.oAuthVerifierService.verifyOperation(isUpdated);
    }
  }
}

export default UserScopeUpdaterUseCase;
