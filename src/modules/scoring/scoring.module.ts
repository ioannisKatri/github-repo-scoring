import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScoringService } from './scoring.service';

@Module({
  imports: [ConfigModule],
  providers: [ScoringService],
  exports: [ScoringService],
})
export class ScoringModule {}
