import { AuthorizeRequestDTO, TokenRequestDTO } from '@dtos/OAuthDTO';
import { ScopeDTO } from '@dtos/TokenDTO';

export interface ICodeGenerationUseCase {
  execute(id?: string): Promise<string>;
}

export interface IScopeComparatorUseCase {
  execute(
    requestScope?: string,
    id?: string,
  ): Promise<{ scope: Partial<ScopeDTO>; updated: boolean }>;
}

export interface ITokenPreparationUseCase {
  execute(
    tokenRequest: TokenRequestDTO,
  ): Promise<{ id: string; client_id: string }>;
}

export interface IUserAuthorizationUseCase {
  execute(authorizeRequest: AuthorizeRequestDTO, id?: string): Promise<void>;
}

export interface IUserScopeUpdaterUseCase {
  execute(scope?: ScopeDTO, updated?: boolean, id?: string): Promise<void>;
}
