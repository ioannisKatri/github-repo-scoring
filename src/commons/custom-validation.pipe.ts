import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ErrorResponse, ErrorDetail, RequestStatus } from './types';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  /**
   * Transforms and validates the incoming value.
   * If validation fails, it throws a BadRequestException with formatted error details.
   *
   * @param value The value to be transformed and validated.
   * @param metatype Metadata about the value's type.
   * @returns The transformed value if valid, otherwise throws an exception.
   */
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new BadRequestException(formattedErrors);
    }
    return value;
  }

  /**
   * Determines if the value's metatype should be validated.
   * This method excludes primitive types (String, Boolean, Number, Array, Object) from validation.
   * Only complex types that likely have validation rules are subject to validation.
   *
   * @param metatype The metatype to check. Metatype is essentially the class type that defines the structure of the incoming value.
   * @returns True if the metatype should be validated, false otherwise.
   */
  private toValidate(metatype: new (...args: unknown[]) => any): boolean {
    const types: (new (...args: unknown[]) => unknown)[] = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }

  /**
   * Formats the validation errors into a detailed error response.
   *
   * @param errors The validation errors to be formatted.
   * @returns An ErrorResponse containing the formatted validation errors.
   */
  private formatErrors(errors: any[]): ErrorResponse {
    const details: ErrorDetail[] = errors.flatMap((error) =>
      Object.keys(error.constraints).map((key) => ({
        field: error.property,
        value: error.value,
        location: 'query',
        issue: key,
        description: error.constraints[key],
      })),
    );

    return {
      status: RequestStatus.VALIDATION_FAILED,
      timestamp: new Date().toISOString(),
      message: 'Validation failed',
      details,
    };
  }
}
