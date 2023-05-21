import { environment } from "src/environments/environment";

export const STRING_POOL = {
  TRUE: 'true',
  FALSE: 'false',
  SLASH: '/',
};
export const SERVICE = {
  IAM: environment.gateway + '/iam/api',
  COMMUNICATION: environment.gateway + '/communicate/api',
  SYSTEM: environment.gateway + '/system/api',
};
export const RESOURCES = {
  ACCOUNT: SERVICE.IAM + '/account',
  USER: SERVICE.IAM + '/users',
  ROLE: SERVICE.IAM + '/roles',
  CHAT: SERVICE.COMMUNICATION + '/chat'
};
export enum ROUTER_ACTION {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  DETAIL = 'detail'
}
