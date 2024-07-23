import createError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import { injectable } from 'inversify';

import Clients from '@entities/Clients';
import { ERROR_MESSAGES } from '@constants/errorMessages';
import { IClientsService } from '@domain-interfaces/services/IClientsService';
import { ClientsRequestDTO, ClientsDTO, CredentialRequestDTO } from '@dtos/ClientsDTO';

@injectable()
class ClientsService implements IClientsService {
  generateClientId(id: string): string {
    return `${uuidv4().substring(0, 15)}-${id}`;
  }

  generateClientSecret(): string {
    return uuidv4().substring(0, 20);
  }

  generateAPIKey(): string {
    return uuidv4();
  }

  validClientsDetail(clients: Clients): void {
    if (!clients.isValidURI(clients.address_uri)) {
      throw createError(422, ERROR_MESSAGES.VALIDATION.FORMAT.ADDRESS_URI);
    }

    if (!clients.isValidURI(clients.redirect_uri)) {
      throw createError(422, ERROR_MESSAGES.VALIDATION.FORMAT.REDIRECT_URI);
    }
  }

  verifyCredentialRequest(credentialRequest: CredentialRequestDTO): CredentialRequestDTO {
    const { client_id, client_secret, api_key } = credentialRequest;

    if (!client_id && !client_secret && !api_key) {
      throw createError(401, ERROR_MESSAGES.NOT_FOUND.CREDENTIAL);
    }

    return { client_id, client_secret, api_key };
  }

  verifyClientsDetail(clientsRequestDTO: ClientsRequestDTO): ClientsDTO {
    const {
      id,
      client_id,
      client_secret,
      address_uri,
      redirect_uri,
      clientAllowedScopes,
      application_name,
      manager_list,
    } = clientsRequestDTO;

    if (!id) {
      throw createError(401, ERROR_MESSAGES.NOT_FOUND.USER);
    }

    if (!client_id) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.CLIENT_ID);
    }

    if (!client_secret) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.CLIENT_SECRET);
    }

    if (!address_uri) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.ADDRESS_URI);
    }

    if (!redirect_uri) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.REDIRECT_URI);
    }

    if (!clientAllowedScopes) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.SCOPE);
    }

    if (!application_name) {
      throw createError(400, ERROR_MESSAGES.VALIDATION.MISSING.APPLICATION_NAME);
    }

    return {
      id,
      client_id,
      client_secret,
      address_uri,
      redirect_uri,
      clientAllowedScopes,
      application_name,
      manager_list,
    };
  }
}

export default ClientsService;
