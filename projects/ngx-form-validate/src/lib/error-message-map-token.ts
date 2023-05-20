import { InjectionToken } from '@angular/core';


export const ERROR_MESSAGE_TOKEN = new InjectionToken<ErrorMessageMap>('ErrorMessageMap');

export interface ErrorMessageMap {
  [key: string]: string | ((err: any) => ErrorMessageMapResult);
}
export interface ErrorMessageMapResult {
  message: string;
  params?: any;
}
