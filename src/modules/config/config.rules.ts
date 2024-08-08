import { IsDefined, IsNumber, IsString, IsUrl } from 'class-validator';

export class ConfigRules {
  @IsDefined()
  @IsString()
  GITHUB_TOKEN: string;

  @IsDefined()
  @IsUrl()
  GITHUB_BASE_URL: string;

  @IsDefined()
  @IsNumber()
  STARS_WEIGHT: number;

  @IsDefined()
  @IsNumber()
  FORKS_WEIGHT: number;

  @IsDefined()
  @IsNumber()
  RECENCY_WEIGHT: number;
}
