import { RequestValidDTO } from '@dtos/ClientsDTO';
import {
  AuthorizeRequestDTO,
  TokenRequestDTO,
  TokenResponseDTO,
} from '@dtos/OAuthDTO';

export interface IOAuthRequestValidService {
  validateAuthorizationRequest(
    request: AuthorizeRequestDTO,
    clients?: RequestValidDTO | null,
  ): void;
  validateTokenRequest(
    request: TokenRequestDTO,
    oauth?: TokenRequestDTO | null,
  ): TokenResponseDTO;
}
