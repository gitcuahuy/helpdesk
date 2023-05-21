export interface AuditableModel {
  createdAt?: number;
  createdBy?: string;
  lastModifiedAt?: number;
  lastModifiedBy?: string;
  deleted?: boolean;
}
