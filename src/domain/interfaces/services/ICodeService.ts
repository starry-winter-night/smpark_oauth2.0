export interface ICodeService {
  generateCode(): string;
  calculateExpiryTime(minutes: number): number;
  validateCodeExpiresAt(expiresAt: number): boolean;
}
