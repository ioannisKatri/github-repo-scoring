import { HttpStatus } from '@nestjs/common';

export function mapHttpStatusToText(status: HttpStatus): string {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return 'Bad Request';
    case HttpStatus.NOT_FOUND:
      return 'Not Found';
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return 'Internal Server Error';
    case HttpStatus.OK:
      return 'OK';
    case HttpStatus.CREATED:
      return 'Created';
    case HttpStatus.ACCEPTED:
      return 'Accepted';
    case HttpStatus.BAD_GATEWAY:
      return 'Bad Gateway';
    case HttpStatus.SERVICE_UNAVAILABLE:
      return 'Service Unavailable';
    default:
      return 'Unknown Error';
  }
}
