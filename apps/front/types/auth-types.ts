import { UserRole } from "@repo/shared-types";

export type Session = {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
  };
  accessToken: string;
  refreshToken: string;
  browserSessionID: number;
};

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
};
