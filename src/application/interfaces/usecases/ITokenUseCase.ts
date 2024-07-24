import { TokenResponseDTO } from '@dtos/TokenDTO';
import { ValidIdsDTO } from '@dtos/OAuthDTO';

export interface ITokenGenerationUseCase {
  execute(ids?: ValidIdsDTO | null): Promise<TokenResponseDTO>;
}
