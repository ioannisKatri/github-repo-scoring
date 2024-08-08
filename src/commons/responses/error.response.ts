import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDetailDto {
  @ApiProperty({
    description: 'Field that caused the error',
    example: 'date',
  })
  field: string;

  @ApiProperty({
    description: 'Invalid value',
    example: '2021-02-30',
  })
  value: string;

  @ApiProperty({
    description: 'Location of the field',
    example: 'query',
  })
  location: string;

  @ApiProperty({
    description: 'Issue type',
    example: 'isDateString',
  })
  issue: string;

  @ApiProperty({
    description: 'Description of the error',
    example: 'date must be a valid ISO 8601 date string',
  })
  description: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({
    description: 'Status of the response',
    example: 'validation_failed',
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2024-01-01T12:00:00Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    description: 'Details of the error',
    type: [ValidationErrorDetailDto],
  })
  details: ValidationErrorDetailDto[];
}

export class GenericErrorResponseDto {
  @ApiProperty({
    description: 'Status of the response',
    example: 'error',
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2024-01-01T12:00:00Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Error message',
    example: 'An unexpected error occurred. Please try again later.',
  })
  message: string;
}
