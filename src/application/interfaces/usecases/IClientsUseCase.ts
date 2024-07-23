import {
  ClientsDTO,
  CredentialRequestDTO,
  CredentialResponseDTO,
  ClientsRequestDTO,
} from '@dtos/ClientsDTO';

export interface IClientDetailsLoaderUseCase {
  execute(id?: string): Promise<ClientsDTO | null>;
}

export interface IClientDetailsRegistrationUseCase {
  execute(clientsData: ClientsRequestDTO): Promise<void>;
}

export interface IClientGenerationUseCase {
  execute(
    credentialRequest: CredentialRequestDTO,
    id?: string,
  ): Promise<CredentialResponseDTO | null>;
}
