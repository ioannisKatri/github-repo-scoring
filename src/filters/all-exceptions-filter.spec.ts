import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AllExceptionsFilter } from './exception.filter';
import { ErrorResponse } from '../commons/types';
import { mapHttpStatusToText } from '../commons/mappers';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should format an HttpException without details', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockArgumentsHost: ArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    } as unknown as ArgumentsHost;

    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

    filter.catch(exception, mockArgumentsHost);

    const expectedResponse: ErrorResponse = {
      status: mapHttpStatusToText(HttpStatus.NOT_FOUND),
      timestamp: expect.any(String),
      message: 'An unexpected error occurred. Please try again later.',
    };

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('should format an HttpException with details', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockArgumentsHost: ArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    } as unknown as ArgumentsHost;

    const exception = new HttpException(
      {
        message: 'Validation failed',
        details: [
          {
            field: 'username',
            issue: 'required',
            description: 'Username is required',
            value: 'assertion',
            location: 'query ',
          },
        ],
      },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockArgumentsHost);

    const expectedResponse: ErrorResponse = {
      status: mapHttpStatusToText(HttpStatus.BAD_REQUEST),
      timestamp: expect.any(String),
      message: 'Validation failed',
      details: [
        {
          field: 'username',
          issue: 'required',
          description: 'Username is required',
          value: 'assertion',
          location: 'query ',
        },
      ],
    };

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('should format a generic exception', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockArgumentsHost: ArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(mockResponse),
    } as unknown as ArgumentsHost;

    const exception = new Error('Something went wrong');

    filter.catch(exception, mockArgumentsHost);

    const expectedResponse: ErrorResponse = {
      status: mapHttpStatusToText(HttpStatus.INTERNAL_SERVER_ERROR),
      timestamp: expect.any(String),
      message: 'An unexpected error occurred. Please try again later.',
    };

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
  });
});
