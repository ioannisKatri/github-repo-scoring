import { Test, TestingModule } from '@nestjs/testing';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { GetScoredRepositoriesResponse } from './types';
import { GetRepositoryQueryRules } from './get-repository-query.rules';

describe('GithubController', () => {
  let controller: GithubController;
  let githubService: GithubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GithubController],
      providers: [
        {
          provide: GithubService,
          useValue: {
            getScoredRepositories: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GithubController>(GithubController);
    githubService = module.get<GithubService>(GithubService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getScoredRepositories', () => {
    it('should return scored repositories', async () => {
      const query: GetRepositoryQueryRules = {
        language: 'javascript',
        date: '2022-01-01',
        perPage: 30,
        page: 1,
        order: 'desc',
      };

      const serviceResponse: GetScoredRepositoriesResponse = {
        items: [
          { name: 'repo1', score: 150 },
          { name: 'repo2', score: 120 },
        ],
        totalCount: 2,
        count: 2,
        page: 1,
        totalPages: 1,
      };

      jest
        .spyOn(githubService, 'getScoredRepositories')
        .mockResolvedValue(serviceResponse);

      const result = await controller.getScoredRepositories(query);

      expect(result).toEqual(serviceResponse);
      expect(githubService.getScoredRepositories).toHaveBeenCalledWith(query);
    });

    it('should throw validation error if query is invalid', async () => {
      const query: any = {
        language: 'javascript',
        date: 'invalid-date',
      };

      await expect(controller.getScoredRepositories(query)).rejects.toThrow(
        TypeError,
      );
    });

    it('should throw internal server error on service failure', async () => {
      const query: GetRepositoryQueryRules = {
        language: 'javascript',
        date: '2022-01-01',
        perPage: 30,
        page: 1,
        order: 'desc',
      };

      jest
        .spyOn(githubService, 'getScoredRepositories')
        .mockRejectedValue(new Error('Internal server error'));

      await expect(controller.getScoredRepositories(query)).rejects.toThrow(
        Error,
      );
    });
  });
});
