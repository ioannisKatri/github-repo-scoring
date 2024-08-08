export type BaseResponse = {
  status: string;
  timestamp: string;
};

export type SuccessResponse<T> = BaseResponse & {
  data: T;
};

export type ErrorDetail = {
  field: string;
  value: string;
  location: string;
  issue: string;
  description: string;
};

export type ErrorResponse = BaseResponse & {
  message?: string;
  details?: ErrorDetail[];
};

export enum RequestStatus {
  VALIDATION_FAILED = 'validation_failed',
  ERROR = 'error',
  SUCCESS = 'success',
}
