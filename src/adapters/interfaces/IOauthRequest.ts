import { Request } from 'express';

import { AuthorizeRequestDTO } from '@dtos/OAuthDTO';

export interface IOauthRequest extends Request {
  query: Partial<AuthorizeRequestDTO>;
}
