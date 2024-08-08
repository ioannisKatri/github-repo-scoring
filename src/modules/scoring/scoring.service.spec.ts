import { Test, TestingModule } from '@nestjs/testing';
import { ScoringService } from './scoring.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('ScoringService', () => {
  let service: ScoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        ScoringService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              const config = {
                'scoring.starsWeight': 1,
                'scoring.forksWeight': 1,
                'scoring.recencyWeight': 1,
              };
              return config[key];
            },
          },
        },
      ],
    }).compile();

    service = module.get<ScoringService>(ScoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate the correct score', () => {
    const repository = {
      name: 'test-repo',
      stargazers_count: 100,
      forks_count: 50,
      updated_at: new Date().toISOString(),
    };

    const score = service.calculateScore(repository);
    expect(score).toBeGreaterThan(0);
  });
});
