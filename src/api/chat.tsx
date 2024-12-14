import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URL;

const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

export const getChatRoom = (userId) => axiosClient.get(`/chat/room/${userId}`);

export const fetchContacts = () => axiosClient.get("/users");

export const getMessages = (chatRoomId) =>
  axiosClient.get(`/chat/message/${chatRoomId}`);

export const sendMessage = (data) => {
  return axiosClient.post("/chat/message/send", data);
};

export const createDirectChat = (data) => axiosClient.post("/chat/room", data);
