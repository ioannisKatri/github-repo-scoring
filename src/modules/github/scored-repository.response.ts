import { ApiProperty } from '@nestjs/swagger';

export class ScoredRepositoryResponse {
  @ApiProperty({
    description: 'The name of the repository',
    example: 'example-repo',
  })
  name: string;

  @ApiProperty({
    description: 'The calculated score of the repository',
    example: 12345.678,
  })
  score: number;
}
