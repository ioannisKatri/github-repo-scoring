import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GithubService } from './github.service';
import { GetRepositoryQueryRules } from './get-repository-query.rules';
import { CustomValidationPipe } from '../../commons/custom-validation.pipe';
import { ScoredRepositoryResponse } from './scored-repository.response';
import { GetScoredRepositoriesResponse } from './types';
import {
  GenericErrorResponseDto,
  ValidationErrorResponseDto,
} from '../../commons/responses/error.response';
import { ApiStandardResponse } from '../../commons/swagger-helpers';

@ApiTags('repositories')
@Controller({ version: '1', path: 'repositories' })
export class GithubController {
  constructor(private githubService: GithubService) {}

  @Get('score')
  @ApiOperation({ summary: 'Get scored repositories' })
  @ApiStandardResponse(ScoredRepositoryResponse)
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GenericErrorResponseDto,
  })
  async getScoredRepositories(
    @Query(new CustomValidationPipe()) query: GetRepositoryQueryRules,
  ): Promise<GetScoredRepositoriesResponse> {
    const { items, totalCount, count, page, totalPages } =
      await this.githubService.getScoredRepositories(query);
    return {
      items,
      totalCount,
      count,
      page,
      totalPages,
    };
  }
}
