import axios from "axios";
import { CreatePostParams } from "../@util/types/post.type";

const API_URL = import.meta.env.VITE_SERVER_URL;

const axiosClient = axios.create({ baseURL: API_URL });

// Setup later ( limit domain to pass the CORS)
// const config: AxiosRequestConfig = { withCredentials: true };

// Automatically add access token to every request if available
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const createNewPost = (data: CreatePostParams) =>
  axiosClient.post(`/posts`, data);

export const getAllPosts = () => axiosClient.get(`/posts`);
