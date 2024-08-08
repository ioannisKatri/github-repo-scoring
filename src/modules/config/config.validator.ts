import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ConfigRules } from './config.rules';

export function validateConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(ConfigRules, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
