import { UserRole } from '@repo/shared-types';

export type AuthJWTPayload = {
  sub: number;
  role: UserRole;
};
