import { injectable, inject } from 'inversify';

import { UserDTO } from '@dtos/UserDTO';
import type { EnvConfig } from '@lib/dotenv-env';
import type { ITokenRepository } from '@domain-interfaces/repository/ITokenRepository';
import type { IUserRepository } from '@domain-interfaces/repository/IUserRepository';
import type { ICodeRepository } from '@domain-interfaces/repository/ICodeRepository';
import type { ITokenService } from '@domain-interfaces/services/ITokenService';
import type { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';
import { ITokenGenerationUseCase } from '@application-interfaces/usecases/ITokenUseCase';

@injectable()
class TokenGenerationUseCase implements ITokenGenerationUseCase {
  constructor(
    @inject('env') private env: EnvConfig,
    @inject('ITokenService') public tokenService: ITokenService,
    @inject('ITokenRepository') public tokenRepository: ITokenRepository,
    @inject('IUserRepository') public userRepository: IUserRepository,
    @inject('ICodeRepository') public codeRepository: ICodeRepository,
    @inject('IOAuthVerifierService') public oAuthVerifierService: IOAuthVerifierService,
  ) {}

  async execute(
    ids?: { id: string; client_id: string } | null,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { id, client_id } = this.oAuthVerifierService.verifyIds(ids);
    const user = await this.getUser(id);
    const accessTokenPayload = {
      iss: this.env.issuer,
      sub: user.id,
      name: user.name,
      aud: client_id,
    };
    const refreshTokenPayload = {
      iss: this.env.issuer,
      sub: user.id,
      aud: client_id,
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
    await this.saveOrUpdateToken(id, tokens, user.agreedScopes);
    await this.codeRepository.delete(id);
    return tokens;
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
    agreedScopes?: {
      id: boolean;
      email: boolean;
      name: boolean;
    },
  ): Promise<void> {
    const verifiedScopes = this.oAuthVerifierService.verifyAgreedScopes(agreedScopes);
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
