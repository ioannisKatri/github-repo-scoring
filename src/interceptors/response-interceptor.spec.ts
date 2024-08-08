import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { ResponseInterceptor } from './response.interceptor';
import { RequestStatus, SuccessResponse } from '../commons/types';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should format the response correctly', (done) => {
    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      getArgsHost: jest.fn(),
    } as unknown as ExecutionContext;

    const callHandler: CallHandler = {
      handle: jest.fn(() => of({ message: 'test' })),
    };

    const result$ = interceptor.intercept(context, callHandler);

    result$.subscribe((result: SuccessResponse<any>) => {
      expect(result).toHaveProperty('status', RequestStatus.SUCCESS);
      expect(result).toHaveProperty('timestamp');
      expect(result.data).toEqual({ message: 'test' });
      done();
    });
  });
});
