export type Session = {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
};

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: string;
};
