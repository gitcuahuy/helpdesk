export interface IBaseResponse<T> {
  success?: boolean;
  code?: number | string;
  data?: T;
  message?: string;
  page?: IPageable;
  timestamp?: string | number | any;
}
export interface IPageable {
  pageIndex?: number;
  pageSize?: number;
  total?: number;
  hasPageable?: boolean;
}

export class Pageable implements IPageable {
  constructor(
    public pageIndex?: number,
    public pageSize?: number,
    public total?: number,
    public hasPageable?: boolean,
  ) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.total = total;
    this.hasPageable = hasPageable;
  }
}
