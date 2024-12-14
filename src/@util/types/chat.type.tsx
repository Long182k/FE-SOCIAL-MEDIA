export type SelectedChatRoom = {
  id: string;
  name: string;
  type: "DIRECT" | "GROUP";
  creatorId: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  userId: string | null;
  participants: Participant[];
};

export type Message = {
  id: string;
  content: string;
  chatRoomId: string;
  senderId: string;
  receiverId: string;
  userName: string;
  createdAt: string;
};

export interface Participant {
  id: string;
  userId: string;
  chatRoomId: string;
  joinedAt: string; // ISO 8601 date string
}
