import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { AuthStore, LoginResponse } from "../../@util/interface/auth.interface";
import {
  LoginParams,
  RegisterNewUserParams,
  User,
} from "../../@util/types/auth.type";
import { axiosInitialClient } from "../../api/axiosConfig";

const SOCKET_URL = import.meta.env.VITE_SERVER_URL;

// Configure persist options for AuthStore
const authPersistOptions: PersistOptions<
  AuthStore,
  Pick<AuthStore, "userInfo">
> = {
  name: "auth_storage",
  partialize: (state) => ({
    userInfo: state.userInfo,
    onlineUsers: state.onlineUsers,
  }),
};

// Create AuthStore logic
const createAuthState: StateCreator<AuthStore> = (set, get) => ({
  accessToken: undefined,
  userInfo: {} as User,
  socket: null,
  onlineUsers: [],
  addAccessToken: (accessToken: string) => set({ accessToken }),
  getAccessToken: () => get().accessToken,
  removeAccessToken: () => set({ accessToken: undefined }),
  addUserInfo: (userInfo: User) => set({ userInfo }),
  getUserInfo: () => get().userInfo,
  removeUserInfo: () =>
    set({
      userInfo: undefined,
    }),
  signup: async (data: RegisterNewUserParams) => {
    try {
      const res = await axiosInitialClient.post("/auth/register", data);
      set({ userInfo: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      console.log("error", error);
    }
  },

  login: async (data: LoginParams): Promise<LoginResponse> => {
    try {
      const { data: dataResponse } = await axiosInitialClient.post(
        "/auth/login",
        data
      );
      localStorage.setItem("access_token", dataResponse.accessToken);

      set({ userInfo: dataResponse });
      console.log("dataResponse.accessToken", dataResponse);
      get().connectSocket();
      return dataResponse; // Ensures a valid LoginResponse is returned
    } catch (error) {
      console.error("Login error", error);
      throw error; // Rejects the Promise with the error
    }
  },

  logout: async () => {
    try {
      await axiosInitialClient.post("/auth/logout");
      set({ userInfo: undefined });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.log("error", error);
      // toast.error(error.response.data.message);
    }
  },
  connectSocket: () => {
    const { userInfo } = get();
    if (!userInfo || get().socket?.connected) {
      console.log("Socket already connected or no user info available.");
      return;
    }

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      query: {
        userId: userInfo.userId,
      },
    });

    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected successfully:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get()?.socket?.disconnect();
  },
});

// Export AuthStore with persistence
export const createAuthStore = persist(createAuthState, authPersistOptions);
