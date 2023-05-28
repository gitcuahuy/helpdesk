import {AuditableModel} from "@shared/model/base/AuditableModel";
import {BaseCredential} from "@shared/auth/model/base-cridential.model";
import {AuthedResponse} from "@shared/auth/model/authedResponse";

export interface IPermission {
  roleId?: string;
  resourceCode?: string;
  scope?: string
}
export interface IProperties {
  roleId?: string;
  property?: string;
}
export interface IRole {
  code?: string;
  description?: string;
  id?: string;
  isRoot?: boolean;
  name?: string;
  permissions?: IPermission[];
  roleLevel?: UserLevel;
  status?: string;
  properties?: IProperties[];
}
export enum RoleStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IUserPrimary {
  grantedPermissions: string[];
  isRoot?: boolean;
  accountType?: AccountType;
  userLevel?: UserLevel;
}

export interface IProperty extends AuditableModel{
  id?: string;
  value: string;
  label: string;
  primary?: boolean;
}
export interface IUser extends BaseCredential{
  gender?: Gender;
  roleIds?: string[];
  userLevel?: UserLevel;
  accountType?: AccountType;
  lastLoginAt?: string;
  lastAuthChangeAt?: string;
  userPrimary?: IUserPrimary;
  departmentName?: string;

  id?: string;
  avatarFileId?: string | null;
  avatarUrl?: string | null;
  background?: string | null;
  fullName?: string;
  username?: string;
  roles?: IRole[];
  emails?: IProperty[];
  emailVerified?: boolean;
  phoneNumbers?: IProperty[];
  title?: string;
  organizationId?: string;
  dayOfBirth?: Date | null;
  address?: string | null;
  description?: string | null;
  status?: string;
}
export interface IProfile {
  id?: string;
  fullName?: string;
  emails?: IProperty[];
  avatarFileId?: string;
  description?: string;
}
export const getPrimaryEmail = (user: IUser): IProperty | undefined => {
  if (!user.emails) {
    return undefined;
  }
  return user.emails.find(email => email.primary);
};
export enum Gender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  OTHER = 'OTHER',
}
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export enum UserLevel {
  CENTER = 'CENTER',
  BUILDING_MANAGER = 'BUILDING_MANAGER',
  TECHNICAL_LEADER = 'TECHNICAL_LEADER',
  SERVICE_LEADER = 'SERVICE_LEADER',
  EXPERT_LEADER = 'EXPERT_LEADER',
}
export enum AccountType {
  EMPLOYEE = 'EMPLOYEE',
  CUSTOMER = 'CUSTOMER',
}

export interface ILoginResponse extends AuthedResponse, IUser {

}
