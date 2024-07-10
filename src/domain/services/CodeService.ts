import { v4 as uuidv4 } from 'uuid';
import { injectable } from 'inversify';

@injectable()
class CodeService {
  generateCode(): string {
    return uuidv4().substring(0, 15);
  }

  calculateExpiryTime(minutes: number): number {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return Math.floor(now.getTime() / 1000);
  }

  validateCodeExpiresAt(expiresAt: number): boolean {
    const currentTime = Date.now() / 1000;

    return currentTime >= expiresAt;
  }
}
export default CodeService;
