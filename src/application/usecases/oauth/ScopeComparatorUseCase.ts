import { injectable, inject } from 'inversify';

import { ScopeDTO } from '@dtos/TokenDTO';
import { deepEqual } from '@utils/deepEqual';
import type { IClientsRepository } from '@domain-interfaces/repository/IClientsRepository';
import type { IUserRepository } from '@domain-interfaces/repository/IUserRepository';
import type { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';
import type { ITokenService } from '@domain-interfaces/services/ITokenService';
import { IScopeComparatorUseCase } from '@application-interfaces/usecases/IOAuthUseCase';
import { ScopeRequestDTO, ScopeResponseDTO } from '@dtos/OAuthDTO';
import OAuthMapper from '@mapper/OAuthMapper';

@injectable()
class ScopeComparatorUseCase implements IScopeComparatorUseCase {
  constructor(
    @inject(OAuthMapper) private oAuthMapper: OAuthMapper,
    @inject('IUserRepository') private userRepository: IUserRepository,
    @inject('IClientsRepository') private clientsRepository: IClientsRepository,
    @inject('ITokenService') private tokenService: ITokenService,
    @inject('IOAuthVerifierService') private oAuthVerifierService: IOAuthVerifierService,
  ) {}
  async execute(
    requestScope: ScopeRequestDTO,
  ): Promise<{ scope: Partial<ScopeDTO>; updated: boolean }> {
    const { client_id, scope } = requestScope;
    const verifiedClientId = this.oAuthVerifierService.verifyClientId(client_id);
    const fetchedClients = await this.clientsRepository.findByClientId(verifiedClientId);
    const { id, clientAllowedScopes } = this.oAuthVerifierService.verifyClient(fetchedClients);
    const fetchedUser = await this.userRepository.findById(id);
    const { agreedScopes } = this.oAuthVerifierService.verifyUser(fetchedUser);

    return this.determineScope(scope, clientAllowedScopes, agreedScopes);
  }

  private determineScope(
    scope?: string,
    clientAllowedScopes?: ScopeDTO,
    agreedScopes?: ScopeDTO,
  ): ScopeResponseDTO {
    if (!clientAllowedScopes) {
      const defaultScope = this.tokenService.getDefaultScope();
      return this.oAuthMapper.toScopeResponseDTO(defaultScope, false);
    }

    if (!scope) {
      return this.oAuthMapper.toScopeResponseDTO(clientAllowedScopes, false);
    }

    const resultScope = this.tokenService.validateScope(clientAllowedScopes, scope);
    const isEqual = this.compareScope(resultScope, agreedScopes);
    return this.oAuthMapper.toScopeResponseDTO(resultScope, !isEqual);
  }

  private compareScope(newScope: Partial<ScopeDTO>, agreedScopes?: ScopeDTO): boolean {
    return agreedScopes ? deepEqual(newScope, agreedScopes) : false;
  }
}

export default ScopeComparatorUseCase;
