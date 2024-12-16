import {
  ApiResponse,
  CreateCommentDto,
  CreatePostDto,
  Post,
  PostInteractionResponse,
  PostResponse,
  UpdatePostDto,
} from "../@util/types/post.type";
import { axiosClient } from "./axiosConfig";

export const postApi = {
  createPost: (data: CreatePostDto | FormData) =>
    axiosClient.post<ApiResponse<Post>>("/posts", data, {
      headers: {
        "Content-Type":
          data instanceof FormData ? "multipart/form-data" : "application/json",
      },
    }),

  getPosts: () =>
    axiosClient.get<PostResponse>("/posts"),

  getPost: (id: string) => axiosClient.get<ApiResponse<Post>>(`/posts/${id}`),

  updatePost: (id: string, data: UpdatePostDto) =>
    axiosClient.patch<ApiResponse<Post>>(`/posts/${id}`, data),

  deletePost: (id: string) => axiosClient.delete(`/posts/${id}`),

  likePost: (id: string) =>
    axiosClient.post<PostInteractionResponse>(`/posts/${id}/like`),

  commentPost: (id: string, data: CreateCommentDto) => {
    return axiosClient.post<ApiResponse<Comment>>(`/posts/${id}/comment`, data);
  },
};
