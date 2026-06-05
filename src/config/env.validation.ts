const requiredEnvKeys = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
] as const;

export function validateEnv(config: Record<string, unknown>) {
  for (const key of requiredEnvKeys) {
    if (!config[key]) {
      throw new Error(`${key} is required`);
    }
  }

  const accessSecret = String(config.JWT_ACCESS_SECRET);
  const refreshSecret = String(config.JWT_REFRESH_SECRET);

  if (accessSecret.length < 32) {
    throw new Error('JWT_ACCESS_SECRET must be at least 32 characters');
  }

  if (refreshSecret.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters');
  }

  return config;
}
