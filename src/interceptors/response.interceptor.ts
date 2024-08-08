import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ErrorResponse,
  RequestStatus,
  SuccessResponse,
} from '../commons/types';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T> | ErrorResponse>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T> | ErrorResponse> {
    return next.handle().pipe(
      map((data) => {
        return {
          status: RequestStatus.SUCCESS,
          timestamp: new Date().toISOString(),
          data,
        };
      }),
    );
  }
}
