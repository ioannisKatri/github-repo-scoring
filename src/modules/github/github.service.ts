import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  Repository,
  ScoredRepository,
  FetchRepositoriesParams,
  FetchRepositoriesResponse,
  GetScoredRepositoriesParams,
  GetScoredRepositoriesResponse,
} from './types';
import { ScoringService } from '../scoring/scoring.service';

@Injectable()
export class GithubService {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly logger = new Logger(GithubService.name);

  constructor(
    private configService: ConfigService,
    private scoringService: ScoringService,
  ) {
    this.baseUrl = this.configService.get<string>('github.baseUrl');
    this.token = this.configService.get<string>('github.token');
  }

  private getRequestHeaders(): Record<string, string> {
    return {
      Authorization: `token ${this.token}`,
    };
  }

  private buildQueryString(params: FetchRepositoriesParams): string {
    const { language, date, perPage, page, order } = params;
    const query = `language:${language} created:>=${date}`;
    const queryString = new URLSearchParams({
      q: query,
      per_page: perPage.toString(),
      page: page.toString(),
      order: order,
    });
    return queryString.toString();
  }

  private buildUrl(params: FetchRepositoriesParams): string {
    const queryString = this.buildQueryString(params);
    return `${this.baseUrl}/search/repositories?${queryString}`;
  }

  /**
   * Fetches repositories from the GitHub API based on the provided parameters.
   * @param {FetchRepositoriesParams} params - The parameters for fetching repositories.
   * @returns {Promise<FetchRepositoriesResponse>} A promise that resolves to the fetched repositories and total count.
   * @throws {InternalServerErrorException} Throws an error if the GitHub API request fails.
   */
  private async fetchRepositories(
    params: FetchRepositoriesParams,
  ): Promise<FetchRepositoriesResponse> {
    const url = this.buildUrl(params);
    const headers = this.getRequestHeaders();

    try {
      const response = await axios.get(url, { headers });
      if (response.status !== 200) {
        throw new Error(
          `GitHub API error: ${response.statusText}, ${response.data}`,
        );
      }

      const total_count = response.data.total_count;
      const items = response.data.items.map((item) => ({
        name: item.full_name,
        stargazers_count: item.stargazers_count,
        forks_count: item.forks_count,
        updated_at: item.updated_at,
      }));

      return { items, total_count };
    } catch (error) {
      this.logger.error(`GitHub API error: ${error.message}`);
      throw new InternalServerErrorException(
        'An error occurred while fetching repositories.',
      );
    }
  }

  /**
   * Processes the fetched repositories by calculating their scores.
   * @param {Repository[]} repositories - The repositories to be processed.
   * @returns {ScoredRepository[]} The repositories with their calculated scores.
   */
  private processRepositories(repositories: Repository[]): ScoredRepository[] {
    return repositories.map((repo) => ({
      name: repo.name,
      score: this.scoringService.calculateScore(repo),
    }));
  }

  /**
   * Fetches and scores repositories based on the provided parameters.
   * @param {GetScoredRepositoriesParams} params - The parameters for fetching and scoring repositories.
   * @returns {Promise<GetScoredRepositoriesResponse>} A promise that resolves to the scored repositories and pagination details.
   */
  public async getScoredRepositories(
    params: GetScoredRepositoriesParams,
  ): Promise<GetScoredRepositoriesResponse> {
    const { items: repositories, total_count } =
      await this.fetchRepositories(params);
    const scoredRepositories = this.processRepositories(repositories);

    const totalPages = Math.ceil(total_count / params.perPage);

    return {
      items: scoredRepositories,
      count: scoredRepositories.length,
      totalCount: total_count,
      page: Number(params.page),
      totalPages,
    };
  }
}
