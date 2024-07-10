import { injectable } from 'inversify';

import Clients from '@entities/Clients';
import {
  ClientsDTO,
  ClientsResponseDTO,
  RequestValidDTO,
} from '@dtos/ClientsDTO';

@injectable()
class ClientsMapper {
  toClientsDTO(clients: Clients, client_secret: string): ClientsDTO {
    return new ClientsDTO(
      clients.id,
      clients.client_id,
      client_secret,
      clients.api_key,
      clients.application_name,
      clients.redirect_uri,
      clients.address_uri,
      clients.grant_type,
      clients.clientAllowedScopes,
    );
  }

  toEntity(clientsDTO: ClientsDTO): Clients {
    return new Clients(
      clientsDTO.id,
      clientsDTO.client_id,
      clientsDTO.api_key,
      clientsDTO.application_name,
      clientsDTO.redirect_uri,
      clientsDTO.address_uri,
      clientsDTO.grant_type,
      clientsDTO.clientAllowedScopes,
    );
  }

  toClientsResponseDTO(clientsDTO: ClientsDTO): ClientsResponseDTO {
    return new ClientsResponseDTO(
      clientsDTO.client_id || '',
      clientsDTO.client_secret || '',
      clientsDTO.api_key || '',
    );
  }

  toRequestValidDTO(clientDTO: ClientsDTO): RequestValidDTO {
    return new RequestValidDTO(
      clientDTO.client_id,
      clientDTO.redirect_uri,
      clientDTO.address_uri,
    );
  }
}

export default ClientsMapper;
