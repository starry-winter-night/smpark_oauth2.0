import { ClientsDTO } from '@dtos/ClientsDTO';
import { CodeDTO } from '@dtos/CodeDTO';
import { ScopeDTO } from '@dtos/TokenDTO';
import { UserDTO } from '@dtos/UserDTO';

export interface IOAuthVerifierService {
  verifyId(id?: string): string;
  verifyIds(ids?: { id: string; client_id: string } | null): {
    id: string;
    client_id: string;
  };
  verifyUser(user: UserDTO | null): UserDTO;
  verifyAgreedScopes(agreedScopes?: ScopeDTO): ScopeDTO;
  verifyRegUser(user: UserDTO | null): boolean;
  verifyClient(clients: ClientsDTO | null): ClientsDTO;
  verifyCodeExists(code: CodeDTO | null): CodeDTO;
  verifyCodeExpiration(expired: boolean): void;
  verifyOperation(success: boolean | null): void;
  verifyScope(scope?: ScopeDTO | null): ScopeDTO;
  verifyUpdated(updated?: boolean): boolean;
}
