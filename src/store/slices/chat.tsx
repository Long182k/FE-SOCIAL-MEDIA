import { StateCreator } from "zustand";
import { useAppStore } from "..";
import { ChatRoom, ChatStore } from "../../@util/interface/chat.interface";
import { axiosClient } from "../../api/axiosConfig";

export const createChatState: StateCreator<ChatStore> = (set, get) => ({
  messages: [],
  selectedChatRoom: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  fetchContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosClient.get("/users");
      return res.data;
    } catch (error) {
      console.log("error", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getChatRoom: async (currentUserId: string): Promise<ChatRoom[]> => {
    try {
      const res = await axiosClient.get(`/chat/room/${currentUserId}`);

      return res.data;
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      return [];
    }
  },

  getMessages: async (chatRoomId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosClient.get(`/chat/message/${chatRoomId}`);

      set({ messages: res.data });

      const socket = useAppStore.getState().socket;
      console.log("🚀  socket getMessages:", socket);

      if (!socket) {
        console.log("no socket getMessages");
        return;
      }

      socket.on("newMessage", (newMessage) => {
        console.log("🚀  newMessage getMessages:", newMessage);

        set({
          messages: [...get().messages, newMessage],
        });
      });

      return res.data;
    } catch (error) {
      console.log("error", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { messages } = get();
    const socket = useAppStore.getState().socket;

    try {
      const res = await axiosClient.post("/chat/message/send", messageData);
      console.log("🚀  res sendMessage:", res.data);

      if (res) {
        socket?.emit("sendMessage", res.data);
      }
      console.log("res.data", res.data);

      set({ messages: [...messages, res.data] });

      return res.data;
    } catch (error) {
      console.log("error", error);
    }
  },

  createDirectChat: async (directChatData) => {
    const { messages } = get();
    try {
      const res = await axiosClient.post("/chat/room", directChatData);

      set({ messages: [...messages, res.data] });

      return res.data;
    } catch (error) {
      console.log("error", error);
    }
  },

  subscribeToMessages: () => {
    const socket = useAppStore.getState().socket;
    console.log("🚀  socket subscribeToMessages:", socket);

    if (!socket) {
      console.log("no socket subscribeToMessages");
      return;
    }

    socket.on("newMessage", (newMessage) => {
      console.log("🚀  newMessage subscribeToMessages:", newMessage);

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAppStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  setSelectedChatRoom: (selectedChatRoom: ChatRoom | null) =>
    set({ selectedChatRoom }),
});
