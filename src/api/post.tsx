// apiClient.ts
import axios from "axios";
import { CreatePostParams } from "../@util/types/post.type";

const API_URL = import.meta.env.VITE_SERVER_URL;

const axiosClient = axios.create({ baseURL: API_URL });

// Automatically add access token to every request if available
axiosClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

export const createNewPost = (data: CreatePostParams) =>
  axiosClient.post(`/posts`, data);

export const getAllPosts = () => axiosClient.get(`/posts`);
