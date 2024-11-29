import { useState, useEffect } from "react";
import { chatService } from "../api/chat";

interface Chat {
  name: string;
  type: string;
  participants: string[];
}

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export const useChat = (currentUserId: string) => {
  const [chats, setChats] = useState<Chat[]>([]); // Initialize as an empty array
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    loadUserChats();
    chatService.on("message", handleNewMessage);
    chatService.on("chatCreated", handleNewChat);

    return () => {
      chatService.disconnect();
    };
  }, [currentUserId]);

  const loadUserChats = async () => {
    try {
      const userChats = await chatService.getUserChats(currentUserId);
      setChats(Array.isArray(userChats) ? userChats : []); // Ensure userChats is an array
    } catch (error) {
      console.error("Failed to load user chats:", error);
      setChats([]); // Set to an empty array on error
    }
  };

  const loadChatMessages = async (chatId: string) => {
    const chatMessages = await chatService.getChatMessages(chatId);
    setMessages(Array.isArray(chatMessages) ? chatMessages : []);
  };

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleNewChat = (chat: Chat) => {
    setChats((prev) => [...prev, chat]);
  };

  const sendMessage = (chatId: string, content: string) => {
    const message: Message = {
      id: new Date().toISOString(),
      chatId,
      senderId: currentUserId,
      content,
      timestamp: new Date(),
    };
    chatService.sendMessage(chatId, message);
  };

  const createNewChat = (chatData: Chat) => {
    const chat: Chat = {
      name: chatData.name || "New Chat",
      type: chatData.type || "DIRECT",
      participants: [currentUserId, ...(chatData.participants || [])],
    };
    chatService.createChat(chat);
  };

  const exitChat = (chatId: string) => {
    chatService.exitChat(chatId, currentUserId);
  };

  return {
    chats,
    currentChat,
    messages,
    setCurrentChat,
    sendMessage,
    createNewChat,
    exitChat,
    loadChatMessages,
  };
};
