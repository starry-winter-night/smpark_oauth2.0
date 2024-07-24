import { injectable, inject } from 'inversify';

import { UserDTO } from '@dtos/UserDTO';
import { ValidIdsDTO } from '@dtos/OAuthDTO';
import { ScopeDTO, TokenResponseDTO } from '@dtos/TokenDTO';
import type { EnvConfig } from '@lib/dotenv-env';
import type { ITokenRepository } from '@domain-interfaces/repository/ITokenRepository';
import type { IUserRepository } from '@domain-interfaces/repository/IUserRepository';
import type { ICodeRepository } from '@domain-interfaces/repository/ICodeRepository';
import type { ITokenService } from '@domain-interfaces/services/ITokenService';
import type { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';
import { ITokenGenerationUseCase } from '@application-interfaces/usecases/ITokenUseCase';
import TokenMapper from '@mapper/TokenMapper';

@injectable()
class TokenGenerationUseCase implements ITokenGenerationUseCase {
  constructor(
    @inject('env') private env: EnvConfig,
    @inject(TokenMapper) private tokenMapper: TokenMapper,
    @inject('ITokenService') public tokenService: ITokenService,
    @inject('ITokenRepository') public tokenRepository: ITokenRepository,
    @inject('IUserRepository') public userRepository: IUserRepository,
    @inject('ICodeRepository') public codeRepository: ICodeRepository,
    @inject('IOAuthVerifierService') public oAuthVerifierService: IOAuthVerifierService,
  ) {}

  async execute(ids?: ValidIdsDTO | null): Promise<TokenResponseDTO> {
    const { id, client_id } = this.oAuthVerifierService.verifyIds(ids);
    const user = await this.getUser(id);
    const agreedScopes = user.agreedScopes || this.tokenService.getDefaultScope();
    const verifiedScopes = this.oAuthVerifierService.verifyAgreedScopes(agreedScopes);

    const accessTokenPayload = {
      iss: this.env.issuer,
      sub: user.id,
      name: user.name,
      aud: client_id,
      scope: verifiedScopes,
    };
    const refreshTokenPayload = {
      iss: this.env.issuer,
      sub: user.id,
      aud: client_id,
      scope: verifiedScopes,
    };

    const tokens = {
      accessToken: this.generateToken(
        accessTokenPayload,
        this.env.oauthAccessSecret,
        Number(this.env.oauthAccessTokenExpiresIn),
      ),
      refreshToken: this.generateToken(
        refreshTokenPayload,
        this.env.oauthRefreshSecret,
        Number(this.env.oauthRefreshTokenExpiresIn),
      ),
    };

    await this.saveOrUpdateToken(id, tokens, verifiedScopes);
    await this.codeRepository.delete(id);
    return this.tokenMapper.toTokenResponseDTO(tokens);
  }

  private generateToken<T extends object>(
    payload: T,
    secretKey: string,
    expiresIn: number,
  ): string {
    return this.tokenService.generateToken(payload, secretKey, expiresIn);
  }

  private async getUser(id: string): Promise<UserDTO> {
    const user = await this.userRepository.findById(id);
    return this.oAuthVerifierService.verifyUser(user);
  }

  private async saveOrUpdateToken(
    id: string,
    tokens: { accessToken: string; refreshToken: string },
    verifiedScopes: ScopeDTO,
  ): Promise<void> {
    const jwtExpiresIn = Number(this.env.oauthAccessTokenExpiresIn);
    const token = {
      id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenGrantedScopes: verifiedScopes,
      expiresAt: this.tokenService.calculateJwtExpiresAt(jwtExpiresIn),
    };
    const isUpserted = await this.tokenRepository.upsert(token);
    this.oAuthVerifierService.verifyOperation(isUpserted);
  }
}
export default TokenGenerationUseCase;
