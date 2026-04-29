export enum UserRole {
  WORKER = 'worker',
  EMPLOYER = 'employer',
}

export type User = {
  id: string;
  username: string;
  email: string;
  display_name: string;
  bio?: string;
  role: UserRole | string;
};

export type DecodedToken = {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};
