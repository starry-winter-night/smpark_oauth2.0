import { injectable, inject } from 'inversify';

import UserRepository from '@repository/UserRepository';
import { ScopeDTO } from '@dtos/TokenDTO';
import TokenService from '@services/TokenService';
import ClientsRepository from '@repository/ClientsRepository';
import { deepEqual } from '@utils/deepEqual';
import OAuthVerifierService from '@services/OAuthVerifierService';

@injectable()
class ScopeComparatorUseCase {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(TokenService) private tokenService: TokenService,
    @inject(ClientsRepository) private clientsRepository: ClientsRepository,
    @inject(OAuthVerifierService)
    private oAuthVerifierService: OAuthVerifierService,
  ) {}
  async execute(
    requestScope?: string,
    id?: string,
  ): Promise<{ scope: Partial<ScopeDTO>; updated: boolean }> {
    const verifiedId = this.oAuthVerifierService.verifyId(id);
    const fetchedUser = await this.userRepository.findById(verifiedId);
    const verifiedUser = this.oAuthVerifierService.verifyUser(fetchedUser);
    const { agreedScopes } = verifiedUser;

    if (!requestScope) {
      return this.handleDefaultScope(agreedScopes);
    }

    return this.handleRequestScope(verifiedId, requestScope, agreedScopes);
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
    const resultScope = this.tokenService.validateScope(
      clientAllowedScopes,
      requestScope,
    );

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
