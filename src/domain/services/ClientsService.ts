import createError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import { injectable } from 'inversify';

import Clients from '@entities/Clients';
import { ERROR_MESSAGES } from '@constants/errorMessages';
import { IClientsService } from '@domain-interfaces/services/IClientsService';

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

  validateClientsDetail(clients: Clients): void {
    if (!clients.isValidURI(clients.address_uri)) {
      throw createError(422, ERROR_MESSAGES.VALIDATION.FORMAT.ADDRESS_URI);
    }
  }
}

export default ClientsService;
