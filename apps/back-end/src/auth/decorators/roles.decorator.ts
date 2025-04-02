import { SetMetadata } from '@nestjs/common';
import { UserRole as Role } from '@repo/shared-types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: [Role, ...Role[]]) =>
  SetMetadata(ROLES_KEY, roles);
