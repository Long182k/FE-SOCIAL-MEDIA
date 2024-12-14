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
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    }),

  getPosts: (params: { page?: number; limit?: number; search?: string }) =>
    axiosClient.get<PostResponse>("/posts", { params }),

  getPost: (id: string) => axiosClient.get<ApiResponse<Post>>(`/posts/${id}`),

  updatePost: (id: string, data: UpdatePostDto) =>
    axiosClient.patch<ApiResponse<Post>>(`/posts/${id}`, data),

  deletePost: (id: string) => axiosClient.delete(`/posts/${id}`),

  likePost: (id: string) =>
    axiosClient.post<PostInteractionResponse>(`/posts/${id}/like`),

  commentPost: (id: string, data: CreateCommentDto) => {
    return axiosClient.post<ApiResponse<Comment>>(
      `/posts/${id}/comment`,
      data
    );
  },

  bookmarkPost: (id: string) =>
    axiosClient.post<PostInteractionResponse>(`/posts/${id}/bookmark`),

  getBookmarks: (params: { page?: number; limit?: number }) =>
    axiosClient.get<PostResponse>("/posts/bookmarks", { params }),
};
