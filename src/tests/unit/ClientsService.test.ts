import { v4 as uuidv4 } from 'uuid';
import ClientsService from '@services/ClientsService';
import Clients from '@entities/Clients';
import { ERROR_MESSAGES } from '@constants/errorMessages';

jest.mock('uuid');
jest.mock('@entities/Clients');

describe('ClientsService', () => {
  let service: ClientsService;
  let mockClients: jest.Mocked<Clients>;

  beforeEach(() => {
    service = new ClientsService();
    mockClients = jest.mocked({
      id: '',
      client_id: '',
      api_key: '',
      application_name: '',
      redirect_uri: '',
      address_uri: '',
      grant_type: 'authorization_code',
      clientAllowedScopes: {
        id: false,
        email: false,
        name: false,
      },
      isValidScope: jest.fn(),
      isValidURI: jest.fn(),
    });
  });

  describe('generateClientId', () => {
    it('clientId 생성', () => {
      jest.mocked(uuidv4).mockReturnValue('Dfalfj23kjfkejfk3djslkfjakwej23k');
      const result = service.generateClientId('testId');
      expect(result).toBe('Dfalfj23kjfkejf-testId');
      expect(uuidv4).toHaveBeenCalled();
    });
  });

  describe('generateClientSecret', () => {
    it('clientSecret 생성', () => {
      jest.mocked(uuidv4).mockReturnValue('sdfke23k23j3oif2fj490jfsdfwf23jf');
      const result = service.generateClientSecret();
      expect(result).toBe('sdfke23k23j3oif2fj49');
      expect(uuidv4).toHaveBeenCalled();
    });
  });

  describe('generateAPIKey', () => {
    it('APIKey 생성', () => {
      jest.mocked(uuidv4).mockReturnValue('2kfmke23rigj493j0fjjefw2as323asf');
      const result = service.generateAPIKey();
      expect(result).toBe('2kfmke23rigj493j0fjjefw2as323asf');
      expect(uuidv4).toHaveBeenCalled();
    });
  });

  describe('validClientsDetail', () => {
    it('유효하지 않은 address_uri 시 에러 발생(422, 메시지)', () => {
      mockClients.isValidURI.mockReturnValue(false);
      mockClients.address_uri = 'invalid_uri';

      expect(() => service.validClientsDetail(mockClients)).toThrow(
        expect.objectContaining({
          message: ERROR_MESSAGES.VALIDATION.FORMAT.ADDRESS_URI,
          statusCode: 422,
        }),
      );
    });

    it('유효한 address_uri 시 에러 미발생', () => {
      mockClients.isValidURI.mockReturnValue(true);
      mockClients.address_uri = 'http://valid.uri';

      expect(() => service.validClientsDetail(mockClients)).not.toThrow();
    });
  });
});
