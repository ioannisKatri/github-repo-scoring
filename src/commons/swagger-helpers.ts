import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { StandardResponseDto } from './responses/success.response';

export function ApiStandardResponse<TModel extends Type<unknown>>(
  model: TModel,
) {
  return applyDecorators(
    ApiExtraModels(StandardResponseDto, model),
    ApiResponse({
      status: 200,
      description: 'Success',
      schema: {
        allOf: [
          { $ref: getSchemaPath(StandardResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
}
