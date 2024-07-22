import { injectable, inject } from 'inversify';

import { ScopeDTO } from '@dtos/TokenDTO';
import { deepEqual } from '@utils/deepEqual';
import type { IClientsRepository } from '@domain-interfaces/repository/IClientsRepository';
import type { IUserRepository } from '@domain-interfaces/repository/IUserRepository';
import type { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';
import type { ITokenService } from '@domain-interfaces/services/ITokenService';
import { IScopeComparatorUseCase } from '@application-interfaces/usecases/IOAuthUseCase';

@injectable()
class ScopeComparatorUseCase implements IScopeComparatorUseCase {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IClientsRepository') private clientsRepository: IClientsRepository,
    @inject('ITokenService') private tokenService: ITokenService,
    @inject('IOAuthVerifierService') private oAuthVerifierService: IOAuthVerifierService,
  ) {}
  async execute(
    requestScope?: string,
    id?: string,
  ): Promise<{ scope: Partial<ScopeDTO>; updated: boolean }> {
    const verifiedId = this.oAuthVerifierService.verifyId(id);
    const fetchedUser = await this.userRepository.findById(verifiedId);
    const verifiedUser = this.oAuthVerifierService.verifyUser(fetchedUser);
    const verifiedScopes = this.oAuthVerifierService.verifyAgreedScopes(verifiedUser.agreedScopes);

    if (!requestScope) {
      return this.handleDefaultScope(verifiedScopes);
    }

    return this.handleRequestScope(verifiedId, requestScope, verifiedScopes);
  }

  private handleDefaultScope(agreedScopes: ScopeDTO): {
    scope: Partial<ScopeDTO>;
    updated: boolean;
  } {
    const defaultScope = this.tokenService.getDefaultScope();
    return this.compareAndReturnScope(defaultScope, agreedScopes);
  }

  private async handleRequestScope(
    id: string,
    requestScope: string,
    agreedScopes: ScopeDTO,
  ): Promise<{ scope: Partial<ScopeDTO>; updated: boolean }> {
    const fetchedClients = await this.clientsRepository.findById(id);

    if (!fetchedClients) {
      return this.handleDefaultScope(agreedScopes);
    }

    const { clientAllowedScopes } = fetchedClients;
    const resultScope = this.tokenService.validateScope(clientAllowedScopes, requestScope);

    return this.compareAndReturnScope(resultScope, agreedScopes);
  }

  private compareAndReturnScope(
    newScope: Partial<ScopeDTO>,
    agreedScopes: ScopeDTO,
  ): { scope: Partial<ScopeDTO>; updated: boolean } {
    const isEqual = deepEqual(newScope, agreedScopes);
    return { scope: newScope, updated: !isEqual };
  }
}

export default ScopeComparatorUseCase;
