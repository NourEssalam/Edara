import { UserRole } from '@repo/shared-types';

export type AuthJWTPayload = {
  sub: number;
  role: UserRole;
};

export type RefreshToeknPayload = {
  sub: number;
  role: UserRole;
  browserSessionID: number;
};
