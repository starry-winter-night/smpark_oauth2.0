import { injectable } from 'inversify';

import Clients from '@entities/Clients';
import {
  ClientsDTO,
  CredentialResponseDTO,
  CredentialRequestDTO,
  RequestValidDTO,
  ClientsRequestDTO,
} from '@dtos/ClientsDTO';

@injectable()
class ClientsMapper {
  toClientsDTO(clients: Clients, client_secret: string): ClientsDTO {
    return new ClientsDTO(
      clients.id,
      clients.client_id,
      client_secret,
      clients.application_name,
      clients.redirect_uri,
      clients.address_uri,
      clients.clientAllowedScopes,
      clients.grant_type,
      clients.api_key,
      clients.manager_list,
    );
  }

  toClientsRequestDTO(clients: ClientsRequestDTO): ClientsRequestDTO {
    return new ClientsRequestDTO(
      clients.id,
      clients.client_id,
      clients.client_secret,
      clients.application_name,
      clients.redirect_uri,
      clients.address_uri,
      clients.clientAllowedScopes,
      clients.grant_type,
      clients.api_key,
      clients.manager_list,
    );
  }

  toEntity(clientsDTO: ClientsDTO): Clients {
    return new Clients(
      clientsDTO.id,
      clientsDTO.client_id,
      clientsDTO.application_name,
      clientsDTO.redirect_uri,
      clientsDTO.address_uri,
      clientsDTO.clientAllowedScopes,
      clientsDTO.grant_type,
      clientsDTO.api_key,
      clientsDTO.manager_list,
    );
  }

  toCredentialRequestDTO(clientDTO: CredentialRequestDTO): CredentialRequestDTO {
    return new CredentialRequestDTO(
      clientDTO.id,
      clientDTO.client_id,
      clientDTO.client_secret,
      clientDTO.api_key,
    );
  }

  toCredentialResponseDTO(clientsDTO: ClientsDTO): CredentialResponseDTO {
    return new CredentialResponseDTO(
      clientsDTO.client_id || '',
      clientsDTO.client_secret || '',
      clientsDTO.api_key || '',
    );
  }

  toRequestValidDTO(clientDTO: ClientsDTO): RequestValidDTO {
    return new RequestValidDTO(clientDTO.client_id, clientDTO.redirect_uri, clientDTO.address_uri);
  }
}

export default ClientsMapper;
