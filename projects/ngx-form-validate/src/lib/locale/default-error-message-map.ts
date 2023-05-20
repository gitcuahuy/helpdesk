import { ErrorMessageMap } from '../error-message-map-token';

export const DefaultErrorMessageMap: ErrorMessageMap = {
  required: 'appError.required',
  max: (err: any) => {
    return {
      message: `appError.max`,
      params: {
        required: err.max,
        actual: err.actual
      }
    };
  },
  min: (err: any) => {
    return {
      message: `appError.min`,
      params: {
        actual: err.actual,
        required: err.min
      }
    };
  },
  maxlength: (err: any) => {
    return {
      message: `appError.maxlength`,
      params: {
        actualLength: err.actualLength,
        required: err.requiredLength
      }
    };
  },
  minlength: (err: any) => {
    return {
      message: `appError.minlength`,
      params: {
        actualLength: err.actualLength,
        required: err.requiredLength
      }
    };
  },
  email: 'appError.email',
  pattern: (err: any) => {
    return {
      message: `appError.pattern`,
      params: {
        actual: err.actualValue,
        required: err.requiredPattern
      }
    };
  }
};
