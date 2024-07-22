import {
  ClientsDTO,
  ClientsRequestDTO,
  ClientsResponseDTO,
} from '@dtos/ClientsDTO';

export interface IClientDetailsLoaderUseCase {
  execute(id?: string): Promise<ClientsDTO | null>;
}

export interface IClientDetailsRegistrationUseCase {
  execute(clientsData: ClientsDTO, id?: string): Promise<void>;
}

export interface IClientGenerationUseCase {
  execute(
    clientRequested: ClientsRequestDTO,
    id?: string,
  ): Promise<ClientsResponseDTO | null>;
}
