import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class StandardResponseDto<T> {
  @ApiProperty({
    description: 'Status of the response',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2024-08-07T16:44:00.244Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Response data',
    isArray: true,
    type: 'array',
    items: { type: 'object' }, // Will be dynamically set in the helper function
  })
  data: T;
}
