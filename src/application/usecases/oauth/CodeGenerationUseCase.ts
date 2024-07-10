import { injectable, inject } from 'inversify';
import CodeService from '@services/CodeService';
import CodeRepository from '@repository/CodeRepository';
import OAuthVerifierService from '@services/OAuthVerifierService';
import { CodeDTO } from '@dtos/CodeDTO';
import type { EnvConfig } from '@lib/dotenv-env';

@injectable()
class CodeGenerationUseCase {
  constructor(
    @inject('env') private env: EnvConfig,
    @inject(CodeService) private codeService: CodeService,
    @inject(CodeRepository) private codeRepository: CodeRepository,
    @inject(OAuthVerifierService)
    private oAuthVerifierService: OAuthVerifierService,
  ) {}

  async execute(id?: string): Promise<string> {
    const verifiedId = this.oAuthVerifierService.verifyId(id);
    const code = this.codeService.generateCode();
    const expiresAt = this.codeService.calculateExpiryTime(
      Number(this.env.oauthCodeExpiresIn),
    );

    await this.updateCode({ id: verifiedId, code, expiresAt });
    return code;
  }

  private async updateCode(code: CodeDTO): Promise<void> {
    const isUpdated = await this.codeRepository.updateByCode(code);

    this.oAuthVerifierService.verifyOperation(isUpdated);
  }
}

export default CodeGenerationUseCase;
