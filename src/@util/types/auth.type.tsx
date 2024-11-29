export type RegisterNewUserParams = {
  email: string;
  userName: string;
  password: string;
};

export type LoginParams = {
  username: string;
  password: string;
};

type ROLE = "USER" | "ADMIN";

export type User = {
  id: string;
  userName: string;
  email: string;
  role: ROLE;
  displayName: string | null;
  hashedPassword: string;
  hashedRefreshToken: string;
  avatarUrl: string | null;
  bio: string | null;
  isActive: boolean;
  createdAt: string;
  accessToken?: string;
  refreshToken?: string;
};
