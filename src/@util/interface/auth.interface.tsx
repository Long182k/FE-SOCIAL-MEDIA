import { SCREEN_MODE } from "../constant/constant";
import { LoginParams, RegisterNewUserParams, User } from "../types/auth.type";
import { SocketInstance } from "./chat.interface";

export interface LoginFormProp {
  onSwitchMode: (mode: SCREEN_MODE) => void;
}

export interface ErrorResponseData {
  message: string;
}

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
};

export interface AuthStore {
  accessToken: string | undefined;
  userInfo: User;
  socket: SocketInstance | null;
  onlineUsers: User[];
  addAccessToken: (accessToken: string) => void;
  getAccessToken: () => string | undefined;
  removeAccessToken: () => void;
  addUserInfo: (userInfo: User) => void;
  getUserInfo: () => User;
  removeUserInfo: () => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
  signup: (data: RegisterNewUserParams) => Promise<void>;
  login: (data: LoginParams) => Promise<LoginResponse>;
  logout: () => Promise<void>;
}
