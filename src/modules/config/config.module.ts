import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validateConfig } from './config.validator';
import { configuration } from './configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      validate: validateConfig,
      isGlobal: true,
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
