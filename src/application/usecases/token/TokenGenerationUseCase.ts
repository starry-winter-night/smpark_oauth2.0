import { injectable, inject } from 'inversify';

import TokenService from '@services/TokenService';
import OAuthVerifierService from '@services/OAuthVerifierService';
import UserRepository from '@repository/UserRepository';
import TokenRepository from '@repository/TokenRepository';
import CodeRepository from '@repository/CodeRepository';
import { UserDTO } from '@dtos/UserDTO';
import type { EnvConfig } from '@lib/dotenv-env';

@injectable()
class TokenGenerationUseCase {
  constructor(
    @inject('env') private env: EnvConfig,
    @inject(TokenService) public tokenService: TokenService,
    @inject(TokenRepository) public tokenRepository: TokenRepository,
    @inject(UserRepository) public userRepository: UserRepository,
    @inject(CodeRepository) public codeRepository: CodeRepository,
    @inject(OAuthVerifierService)
    public oAuthVerifierService: OAuthVerifierService,
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
      accessToken: this.generateToken(accessTokenPayload),
      refreshToken: this.generateToken(refreshTokenPayload),
    };
    await this.saveOrUpdateToken(id, tokens, user.agreedScopes);
    await this.codeRepository.deleteByCode(id);
    return tokens;
  }

  private generateToken<T extends object>(payload: T): string {
    const expiresIn = Number(this.env.oauthAccessTokenExpiresIn);
    return this.tokenService.generateToken(
      payload,
      this.env.oauthAccessSecret,
      expiresIn,
    );
  }

  private async getUser(id: string): Promise<UserDTO> {
    const user = await this.userRepository.findById(id);
    return this.oAuthVerifierService.verifyUser(user);
  }

  private async saveOrUpdateToken(
    id: string,
    tokens: { accessToken: string; refreshToken: string },
    agreedScopes: {
      id: boolean;
      email: boolean;
      name: boolean;
    },
  ): Promise<void> {
    const jwtExpiresIn = Number(this.env.oauthAccessTokenExpiresIn);
    const token = {
      id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenGrantedScopes: agreedScopes,
      expiresAt: this.tokenService.calculateJwtExpiresAt(jwtExpiresIn),
    };
    const fetchedToken = await this.tokenRepository.findById(id);
    if (!fetchedToken) {
      const isSaved = await this.tokenRepository.saveToken(token);
      this.oAuthVerifierService.verifyOperation(isSaved);
    } else {
      const isUpdated = await this.tokenRepository.updateByToken(id, token);
      this.oAuthVerifierService.verifyOperation(isUpdated);
    }
  }
}
export default TokenGenerationUseCase;
