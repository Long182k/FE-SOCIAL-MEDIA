import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import {
  AuthStore,
  LoginResponse,
  RegisterResponse,
} from "../../@util/interface/auth.interface";
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
  Pick<AuthStore, "userInfo" | "isSocketConnected" | "onlineUsers">
> = {
  name: "auth_storage",
  partialize: (state) => ({
    userInfo: state.userInfo,
    isSocketConnected: state.isSocketConnected,
    onlineUsers: state.onlineUsers,
  }),
};

// Create AuthStore logic
const createAuthState: StateCreator<AuthStore> = (set, get) => ({
  accessToken: undefined,
  userInfo: {} as User,
  socket: null,
  onlineUsers: [],
  isSocketConnected: false,
  addAccessToken: (accessToken: string) => set({ accessToken }),
  getAccessToken: () => get().accessToken,
  removeAccessToken: () => set({ accessToken: undefined }),
  addUserInfo: (userInfo: User) => set({ userInfo }),
  getUserInfo: () => get().userInfo,
  removeUserInfo: () =>
    set({
      userInfo: undefined,
    }),
  signup: async (data: RegisterNewUserParams): Promise<RegisterResponse> => {
    try {
      const { data: response } = await axiosInitialClient.post(
        "/auth/register",
        data
      );
      set({ userInfo: response });
      localStorage.setItem("access_token", response.accessToken);
      toast.success("Account created successfully");
      get().connectSocket();
      return response;
    } catch (error) {
      console.log("error", error);
      throw error;
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

      get().connectSocket();

      return dataResponse;
    } catch (error) {
      console.error("Login error", error);
      throw error; // Rejects the Promise with the error
    }
  },

  logout: async () => {
    const { userInfo } = get();

    try {
      await axiosInitialClient.post(`/auth/logout/${userInfo.userId}`);

      set({
        userInfo: undefined,
        isSocketConnected: false,
      });

      localStorage.removeItem("access_token");

      toast.success("Logged out successfully");
      get().disconnectSocket();
      get().removeUserInfo();
    } catch (error) {
      console.log("error", error);
    }
  },
  connectSocket: () => {
    const { userInfo, isSocketConnected } = get();

    if (!userInfo || isSocketConnected) {
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
      set({ isSocketConnected: true });
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      set({ isSocketConnected: false });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      set({ isSocketConnected: false });
    });

    // localStorage.setItem('socket',socket)

    set({ socket: socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null, isSocketConnected: false });
    }
  },
});

export const createAuthStore = persist(createAuthState, authPersistOptions);
