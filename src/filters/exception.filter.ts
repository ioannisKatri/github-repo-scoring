import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ErrorResponse } from '../commons/types';
import { mapHttpStatusToText } from '../commons/mappers';

/**
 * A global exception filter that catches all exceptions thrown in the application
 * and formats them into a standardized error response.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Catches and handles exceptions thrown in the application.
   *
   * @param exception The exception that was thrown.
   * @param host The arguments host containing information about the current request.
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(
      `Status: ${status}`,
      exception instanceof Error ? exception.stack : `${exception}`,
    );

    let errorResponse: ErrorResponse = {
      status: mapHttpStatusToText(status),
      timestamp: new Date().toISOString(),
      message: 'An unexpected error occurred. Please try again later.',
    };

    if (
      exception instanceof HttpException &&
      exception.getResponse()['details']
    ) {
      errorResponse = {
        ...errorResponse,
        message: exception.getResponse()['message'],
        details: exception.getResponse()['details'],
      };
    }

    response.status(status).json(errorResponse);
  }
}
