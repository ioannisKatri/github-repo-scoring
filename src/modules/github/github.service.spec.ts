import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { InternalServerErrorException } from '@nestjs/common';
import { ScoringService } from '../scoring/scoring.service';
import { GithubService } from './github.service';
import { GetScoredRepositoriesParams } from './types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GithubService', () => {
  let service: GithubService;
  let scoringService: ScoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
        ScoringService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'github.baseUrl':
                  return 'https://api.github.com';
                case 'github.token':
                  return 'fake-token';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
    scoringService = module.get<ScoringService>(ScoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getScoredRepositories', () => {
    it('should return scored repositories with pagination', async () => {
      const params: GetScoredRepositoriesParams = {
        language: 'javascript',
        date: '2022-01-01',
        perPage: 1,
        page: 1,
        order: 'desc',
      };
      const fetchResponse = {
        items: [
          {
            full_name: 'repo1',
            stargazers_count: 100,
            forks_count: 50,
            updated_at: '2022-01-01T00:00:00Z',
          },
        ],
        total_count: 5,
      };

      mockedAxios.get.mockResolvedValue({
        data: fetchResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      jest
        .spyOn(scoringService, 'calculateScore')
        .mockImplementation(() => 150);

      const result = await service.getScoredRepositories(params);
      expect(result).toEqual({
        items: [{ name: 'repo1', score: 150 }],
        count: 1,
        totalCount: 5,
        page: 1,
        totalPages: 5,
      });
    });

    it('should return multilanguage scored repositories with pagination', async () => {
      const params: GetScoredRepositoriesParams = {
        language: 'javascript+java',
        date: '2022-01-01',
        perPage: 2,
        page: 1,
        order: 'desc',
      };

      const fetchResponse = {
        items: [
          {
            full_name: 'repo1',
            stargazers_count: 100,
            forks_count: 50,
            updated_at: '2022-01-01T00:00:00Z',
          },
          {
            full_name: 'repo2Javascript',
            stargazers_count: 120,
            forks_count: 9,
            updated_at: '2022-01-05T00:00:00Z',
          },
        ],
        total_count: 6,
      };

      mockedAxios.get.mockResolvedValue({
        data: fetchResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      jest
        .spyOn(scoringService, 'calculateScore')
        .mockImplementationOnce(() => 150)
        .mockImplementationOnce(() => 140);

      const result = await service.getScoredRepositories(params);
      expect(result).toEqual({
        items: [
          { name: 'repo1', score: 150 },
          { name: 'repo2Javascript', score: 140 },
        ],
        count: 2,
        totalCount: 6,
        page: 1,
        totalPages: 3,
      });
    });

    it('should throw an error if GitHub API returns non-200 status', async () => {
      const params: GetScoredRepositoriesParams = {
        language: 'javascript',
        date: '2022-01-01',
        perPage: 30,
        page: 1,
        order: 'desc',
      };
      mockedAxios.get.mockRejectedValue(
        new InternalServerErrorException('GitHub API error'),
      );

      await expect(service.getScoredRepositories(params)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
