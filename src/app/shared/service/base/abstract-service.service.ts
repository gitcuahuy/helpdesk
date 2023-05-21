import {Host, Injectable, Optional} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {EntityResponseType, HTTP_HEADERS} from "../../constants/http.constants";
import {STRING_POOL} from "../../constants/string-pool.constants";
import {Observable} from "rxjs";
import {IBaseResponse} from "../../model/base/base.response";
import CommonUtils from "../../utils/coomon.utils";

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private readonly BASE_API_URL: string;
  protected gateway = environment.gateway

  constructor(protected http: HttpClient,
  ) {
    this.BASE_API_URL = this.gateway.endsWith(STRING_POOL.SLASH) ? this.gateway : `${this.gateway}${STRING_POOL.SLASH}`;
  }

  protected readonly httpOptions: {
    observe: string;
    headers?:
      | HttpHeaders
      | {
      [header: string]: string | string[];
    };
    params?:
      | HttpParams
      | {
      [param: string]: string | string[];
    };
  } = {
    observe: 'response',
    headers: {} as HttpHeaders,
    params: {} as HttpParams,
  };

  // eslint-disable-next-line @typescript-eslint/member-ordering
  protected readonly httpOptionsFile: {
    responseType: string;
    headers?:
      | HttpHeaders
      | {
      [header: string]: string | string[];
    };
    params?:
      | HttpParams
      | {
      [param: string]: string | string[];
    };
    observe: string;
  } = {
    responseType: 'blob',
    observe: 'response',
    headers: {} as HttpHeaders,
    params: {} as HttpParams,
  };

  /**
   * GET request
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @template T template
   * @param url end point of the api
   * @param [options] options of the request like headers, body, etc.
   * @returns Observable<EntityResponseType<T> | any>
   */
  public get<T>(
    url: string,
    options?: any
  ): Observable<EntityResponseType<T> | any> {
    return this.http.get<IBaseResponse<T>>(
      `${url}`,
      this.httpOptionCustomize(options)
    );
  }

  /**
   * GET file request
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @template T template
   * @param url end point of the api
   * @param [options] options of the request like headers, body, etc.
   * @returns Observable<Blob | any>
   */
  public getFile(
    url: string,
    options?: any
  ): Observable<Blob | any> {
    return this.http.get(
      `${url}`,
      this.httpOptionCustomize(options, true)
    );
  }

  /**
   * POST request
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @template T template
   * @param url end point of the api
   * @param body body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable<EntityResponseType<T> | any>
   */
  public post<T>(
    url: string,
    body: any,
    options?: any
  ): Observable<EntityResponseType<T> | any> {
    return this.http.post<IBaseResponse<T>>(
      `${url}`,
      CommonUtils.optimalObjectParams(body),
      this.httpOptionCustomize(options)
    );
  }

  /**
   * POST file request
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @param url end point of the api
   * @param body body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable<Blob | any>
   */
  public postFile(
    url: string,
    body: any,
    options?: any
  ): Observable<Blob | any> {
    return this.http.post(
      `${url}`,
      CommonUtils.optimalObjectParams(body),
      this.httpOptionCustomize(options, true)
    );
  }

  /**
   * PUT request
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @template T template
   * @param url end point of the api
   * @param body body of the request.
   * @param options options of the request like headers, body, etc.
   * @returns Observable<EntityResponseType<T> | any>
   */
  public put<T>(
    url: string,
    body: any,
    options?: any
  ): Observable<EntityResponseType<T> | any> {
    return this.http.put<IBaseResponse<T>>(
      `${url}`,
      CommonUtils.optimalObjectParams(body),
      this.httpOptionCustomize(options)
    );
  }

  /**
   * DELETE request
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @template T template
   * @param url end point of the api
   * @param options options of the request like headers, body, etc.
   * @returns Observable<EntityResponseType<T> | any>
   */
  public delete<T>(
    url: string,
    options?: any
  ): Observable<EntityResponseType<T> | any> {
    return this.http.delete<IBaseResponse<T>>(
      `${url}`,
      this.httpOptionCustomize(options)
    );
  }

  /**
   * httpOptionCustomize
   *
   * @author hieu.daominh
   * @date 2021-12-12
   * @param options httpOptions
   * @param httpFile
   * @note với các service cần set headers trong httpOptions thì tạo object json dạng {}, không dùng new HttpHeaders để tạo,
   * ví dụ tạo: headers: { xxx: xxx }
   * @returns any
   */
  private httpOptionCustomize(options?: any, httpFile = false): any {
    const httpOptions = httpFile
      ? {...this.httpOptionsFile}
      : {...this.httpOptions};
    if (options?.observe) {
      httpOptions.observe = options.observe;
    }

    let headerCustom = {...httpOptions.headers};
    if (options?.loading !== false) {
      headerCustom = {
        ...headerCustom,
        [HTTP_HEADERS.X_LOADING]: STRING_POOL.TRUE
      };
    }
    if (options?.ignoreError === true) {
      headerCustom = {
        ...headerCustom,
        [HTTP_HEADERS.X_IGNORE_ERROR]: STRING_POOL.TRUE
      };
    }

    httpOptions.headers = new HttpHeaders({...headerCustom});
    if (options?.params) {
      httpOptions.params = CommonUtils.optimalObjectParams(options?.params);
    }
    return httpOptions;
  }
}
