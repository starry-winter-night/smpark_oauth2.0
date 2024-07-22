export interface ITokenGenerationUseCase {
  execute(
    ids?: { id: string; client_id: string } | null,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
