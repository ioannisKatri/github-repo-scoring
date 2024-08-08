import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from '../github/types';

@Injectable()
export class ScoringService {
  private readonly starsWeight: number;
  private readonly forksWeight: number;
  private readonly recencyWeight: number;
  private readonly RECENCY_CONSTANT: number = 30;

  constructor(private configService: ConfigService) {
    this.starsWeight = this.configService.get<number>('scoring.starsWeight');
    this.forksWeight = this.configService.get<number>('scoring.forksWeight');
    this.recencyWeight = this.configService.get<number>(
      'scoring.recencyWeight',
    );
  }

  /**
   * Calculates the score for a given repository.
   *
   * The score is based on three factors:
   * 1. The number of stargazers, weighted by `starsWeight`.
   * 2. The number of forks, weighted by `forksWeight`.
   * 3. The recency of the last update, weighted by `recencyWeight`.
   *
   * The recency factor is calculated using the formula:
   * (RECENCY_CONSTANT / timeDifference) * recencyWeight
   * where `timerDifference` is the number of days since the last update.
   * Moreover also ensures that repositories updated more recently get a higher score.
   *
   * @param repository The repository for which to calculate the score.
   * @returns The calculated score.
   */
  calculateScore(repository: Repository): number {
    const { stargazers_count, forks_count, updated_at } = repository;
    const now = new Date();
    const updatedDate = new Date(updated_at);

    // Converts the time difference from milliseconds to days.
    const timeDifference =
      (now.getTime() - updatedDate.getTime()) / (1000 * 3600 * 24);

    const starsScore = stargazers_count * this.starsWeight;
    const forksScore = forks_count * this.forksWeight;
    const recencyScore =
      (this.RECENCY_CONSTANT / timeDifference) * this.recencyWeight;

    const score = starsScore + forksScore + recencyScore;
    return parseFloat(score.toFixed(3));
  }
}
