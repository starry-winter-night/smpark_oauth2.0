import { AuthorizeRequestDTO, TokenRequestDTO } from '@dtos/OAuthDTO';
import { ScopeRequestDTO, ScopeResponseDTO, ValidIdsDTO } from '@dtos/OAuthDTO';

export interface ICodeGenerationUseCase {
  execute(id?: string): Promise<string>;
}

export interface IScopeComparatorUseCase {
  execute(requestScope: ScopeRequestDTO): Promise<ScopeResponseDTO>;
}

export interface ITokenPreparationUseCase {
  execute(tokenRequest: TokenRequestDTO): Promise<ValidIdsDTO>;
}

export interface IUserAuthorizationUseCase {
  execute(authorizeRequest: AuthorizeRequestDTO): Promise<void>;
}

export interface IUserScopeUpdaterUseCase {
  execute(scopeRequest: ScopeRequestDTO): Promise<void>;
}
