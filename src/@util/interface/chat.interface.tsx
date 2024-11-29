import { Socket } from "socket.io-client";
import { User } from "../types/auth.type";

export interface Participant {
  id: string;
  userId: string;
  chatRoomId: string;
  joinedAt: string; // ISO 8601 date string
}

export interface CreateDirectChatResponse {
  id: string;
  name: string;
  type: "DIRECT" | "GROUP";
  creatorId: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  userId: string | null;
  participants: Participant[];
}

export interface SendMessageResponse {
  id: string;
  content: string;
  type: "MESSAGE" | "IMAGE" | "VIDEO"; // Expand based on supported message types
  senderId: string;
  receiverId: string;
  chatRoomId: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface ChatParticipant {
  id: string;
  userId: string;
  chatRoomId: string;
  joinedAt: string; // ISO 8601 date string
  user?: {
    id: string;
    userName: string;
  };
}

export interface ChatMessageResponse {
  id: string;
  content: string;
  type: "MESSAGE" | "IMAGE" | "VIDEO"; // Expand based on supported message types
  senderId: string;
  receiverId: string;
  chatRoomId: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface ChatRoom {
  id: string;
  name: string;
  type: "DIRECT" | "GROUP";
  creatorId: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  userId: string | null;
  participants: ChatParticipant[];
  messages?: ChatMessageResponse[];
  user?: User | null; // The user who created the chat room
}

export interface ChatRoomResponse {
  data: ChatRoom[];
}

export interface GetMessageResponse {
  id: string;
  content: string;
  type: "MESSAGE" | "IMAGE" | "VIDEO"; // Expand based on supported message types
  senderId: string;
  receiverId: string;
  chatRoomId: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  user: {
    id: string;
    userName: string;
    email: string;
    role: "USER" | "ADMIN";
    displayName: string | null;
    hashedPassword: string;
    hashedRefreshToken: string;
    avatarUrl: string | null;
    bio: string | null;
    isActive: boolean;
    createdAt: string; // ISO 8601 date string
  };
}

export interface ChatStore {
  messages: GetMessageResponse[]; // Array of messages
  users: User[]; // Array of users
  selectedUser: null | User; // Currently selected user
  selectedChatRoom: null | ChatRoom; // Currently selected user
  isUsersLoading: boolean; // Loading state for fetching users
  isMessagesLoading: boolean; // Loading state for fetching messages

  fetchContacts: () => Promise<User[]>;
  getMessages: (chatRoomId: string) => Promise<GetMessageResponse[]>;
  getChatRoom: (currentUserId: string) => Promise<ChatRoom[]>;

  sendMessage: (messageData: {
    chatRoomId: string;
    senderId: string;
    receiverId: string;
    content: string;
  }) => Promise<SendMessageResponse>;

  createDirectChat: (directChatData: {
    senderId: string;
    receiverId: string;
  }) => Promise<CreateDirectChatResponse>;

  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: User | null) => void;
  setSelectedChatRoom: (selectedChatRoom: ChatRoom | null) => void;
}

export interface ClientToServerEvents {
  sendMessage: (message: string) => void;
}

export interface ServerToClientEvents {
  getOnlineUsers: (userIds: string[]) => void;
  newMessage: (message: GetMessageResponse) => void;
}

export type SocketInstance = Socket<ServerToClientEvents, ClientToServerEvents>;
