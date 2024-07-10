import { injectable, inject } from 'inversify';
import CodeRepository from '@repository/CodeRepository';
import ClientsRepository from '@repository/ClientsRepository';
import OAuthRequestValidService from '@services/OAuthRequestValidService';
import { TokenRequestDTO, TokenResponseDTO } from '@dtos/OAuthDTO';
import { ClientsDTO } from '@dtos/ClientsDTO';
import { CodeDTO } from '@dtos/CodeDTO';
import OAuthVerifierService from '@services/OAuthVerifierService';
import CodeService from '@services/CodeService';

@injectable()
class TokenPreparationUseCase {
  constructor(
    @inject(CodeRepository) private codeRepository: CodeRepository,
    @inject(ClientsRepository) private clientsRepository: ClientsRepository,
    @inject(OAuthRequestValidService)
    private oAuthRequestValidService: OAuthRequestValidService,
    @inject(OAuthVerifierService)
    private oAuthVerifierService: OAuthVerifierService,
    @inject(CodeService) private codeService: CodeService,
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
      await this.codeRepository.deleteByCode(id);
    }
  }

  private async getClient(tokenRequest: TokenResponseDTO): Promise<ClientsDTO> {
    const client = await this.clientsRepository.findByClients({
      client_id: tokenRequest.client_id,
      client_secret: tokenRequest.client_secret,
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
