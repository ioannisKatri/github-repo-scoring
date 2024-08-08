import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { ScoringModule } from '../scoring/scoring.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule, ScoringModule],
  controllers: [GithubController],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
