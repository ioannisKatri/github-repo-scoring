import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  Matches,
  IsIn,
} from 'class-validator';

export class GetRepositoryQueryRules {
  @ApiProperty({
    description:
      'language must be a single language or multiple languages connected by a plus sign (e.g., java or java+javascript)',
    example: 'java',
  })
  @IsString()
  @Matches(/^[a-zA-Z]+(\+[a-zA-Z]+)*$/, {
    message:
      'language must be a single language or multiple languages connected by a plus sign (e.g., java or java+javascript)',
  })
  language: string;

  @ApiProperty({
    description: 'Earliest creation date of the repositories (YYYY-MM-DD)',
    example: '2020-01-01',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Number of repositories per page',
    example: 30,
    required: false,
  })
  @IsOptional()
  @Matches(/^\d+$/, { message: 'per_page must be an integer number' })
  @Matches(/^[1-9]\d*$/, { message: 'per_page must not be less than 1' })
  perPage: number = 30;

  @ApiProperty({
    description: 'Page number to fetch',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Matches(/^\d+$/, { message: 'page must be an integer number' })
  @Matches(/^[1-9]\d*$/, { message: 'page must not be less than 1' })
  page: number = 1;

  @ApiProperty({
    description: 'Sorting order of the repositories',
    example: 'desc',
    required: false,
  })
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'order must be either asc or desc' })
  order: string = 'desc';
}
