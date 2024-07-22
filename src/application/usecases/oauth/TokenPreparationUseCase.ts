import { injectable, inject } from 'inversify';
import { TokenRequestDTO, TokenResponseDTO } from '@dtos/OAuthDTO';
import { ClientsDTO } from '@dtos/ClientsDTO';
import { CodeDTO } from '@dtos/CodeDTO';
import type { IClientsRepository } from '@domain-interfaces/repository/IClientsRepository';
import type { ICodeRepository } from '@domain-interfaces/repository/ICodeRepository';
import type { ICodeService } from '@domain-interfaces/services/ICodeService';
import type { IOAuthRequestValidService } from '@domain-interfaces/services/IOAuthRequestValidService';
import type { IOAuthVerifierService } from '@domain-interfaces/services/IOAuthVerifierService';
import { ITokenPreparationUseCase } from '@application-interfaces/usecases/IOAuthUseCase';

@injectable()
class TokenPreparationUseCase implements ITokenPreparationUseCase {
  constructor(
    @inject('ICodeRepository') private codeRepository: ICodeRepository,
    @inject('IClientsRepository') private clientsRepository: IClientsRepository,
    @inject('IOAuthRequestValidService') private oAuthRequestValidService: IOAuthRequestValidService,
    @inject('IOAuthVerifierService') private oAuthVerifierService: IOAuthVerifierService,
    @inject('ICodeService') private codeService: ICodeService,
  ) {}

  async execute(
    tokenRequest: TokenRequestDTO,
  ): Promise<{ id: string; client_id: string }> {
    const validatedRequest =
      this.oAuthRequestValidService.validateTokenRequest(tokenRequest);

    const client = await this.getClient(validatedRequest);
    const code = await this.getCode(validatedRequest.code);

    const isExpired = this.codeService.validateCodeExpiresAt(code.expiresAt);

    await this.deleteCode(code.id, isExpired);

    this.oAuthVerifierService.verifyCodeExpiration(isExpired);

    const extendsClientCode = this.extendedClientAndCode(client, code);

    this.oAuthRequestValidService.validateTokenRequest(
      tokenRequest,
      extendsClientCode,
    );

    return { id: code.id, client_id: client.client_id };
  }

  private async deleteCode(id: string, isExpired: boolean): Promise<void> {
    if (isExpired) {
      await this.codeRepository.delete(id);
    }
  }

  private async getClient(tokenRequest: TokenResponseDTO): Promise<ClientsDTO> {
    const client = await this.clientsRepository.findByClients({
      clientId: tokenRequest.client_id,
      clientSecret: tokenRequest.client_secret,
    });

    const verifiedClient = this.oAuthVerifierService.verifyClient(client);

    return verifiedClient;
  }

  private async getCode(code: string): Promise<CodeDTO> {
    const fetchedCode = await this.codeRepository.findByCode(code);

    const verifiedCode =
      this.oAuthVerifierService.verifyCodeExists(fetchedCode);

    return verifiedCode;
  }

  private extendedClientAndCode(
    clients: ClientsDTO,
    code: CodeDTO,
  ): TokenRequestDTO {
    return {
      client_id: clients.client_id,
      client_secret: clients.client_secret,
      code: code.code,
      redirect_uri: clients.redirect_uri,
      grant_type: clients.grant_type,
    };
  }
}

export default TokenPreparationUseCase;
