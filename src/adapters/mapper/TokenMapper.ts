import { TokenResponseDTO } from '@dtos/TokenDTO';
import { injectable } from 'inversify';

@injectable()
class TokenMapper {
  toTokenResponseDTO(tokenResponse: TokenResponseDTO): TokenResponseDTO {
    return new TokenResponseDTO(tokenResponse.accessToken, tokenResponse.refreshToken);
  }
}

export default TokenMapper;
