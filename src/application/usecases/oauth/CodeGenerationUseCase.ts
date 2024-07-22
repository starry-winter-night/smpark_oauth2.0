import { injectable, inject } from 'inversify';
import type { EnvConfig } from '@lib/dotenv-env';
import CodeMapper from '@mapper/CodeMapper';
import type { ICodeRepository } from '@domain-interfaces/repository/ICodeRepository';
import type { ICodeService } from '@domain-interfaces/services/ICodeService';
import type { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';
import { ICodeGenerationUseCase } from '@application-interfaces/usecases/IOAuthUseCase';

@injectable()
class CodeGenerationUseCase implements ICodeGenerationUseCase{
  constructor(
    @inject('env') private env: EnvConfig,
    @inject('ICodeRepository') private codeRepository: ICodeRepository,
    @inject('ICodeService') private codeService: ICodeService,
    @inject('IOAuthVerifierService') private oAuthVerifierService: IOAuthVerifierService,
    @inject(CodeMapper) private codeMapper: CodeMapper,
  ) {}

  async execute(id?: string): Promise<string> {
    const verifiedId = this.oAuthVerifierService.verifyId(id);
    const code = this.codeService.generateCode();
    const expiresAt = this.codeService.calculateExpiryTime(
      Number(this.env.oauthCodeExpiresIn),
    );

    const codeDTO = this.codeMapper.toDTO(verifiedId, code, expiresAt);
    const isUpdated = await this.codeRepository.update(codeDTO);
    this.oAuthVerifierService.verifyOperation(isUpdated);

    return code;
  }
}

export default CodeGenerationUseCase;
