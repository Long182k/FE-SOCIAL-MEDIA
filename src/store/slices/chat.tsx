import { StateCreator } from "zustand";
import { useAppStore } from "..";
import { ChatRoom, ChatStore } from "../../@util/interface/chat.interface";
import { User } from "../../@util/types/auth.type";
import { axiosClient } from "../../api/axiosConfig";

export const createChatState: StateCreator<ChatStore> = (set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  selectedChatRoom: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  fetchContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosClient.get("/users");
      set({ users: res.data });

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
      console.log("res.data", res.data);
      return res.data; // Assume res.data is an array of ChatRoom
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      return []; // Return an empty array on error
    }
  },

  getMessages: async (chatRoomId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosClient.get(`/chat/message/${chatRoomId}`);

      set({ messages: res.data });

      return res.data;
    } catch (error) {
      console.log("error", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { messages } = get();
    try {
      const res = await axiosClient.post("/chat/message/send", messageData);
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
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAppStore.getState().socket;

    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser.id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    console.log("unsubscribeFromMessages");
    const socket = useAppStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),
  setSelectedChatRoom: (selectedChatRoom: ChatRoom | null) =>
    set({ selectedChatRoom }),
});
