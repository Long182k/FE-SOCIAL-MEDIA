import { axiosClient } from "./axiosConfig";

export interface Group {
  id: string;
  name: string;
  description?: string;
  groupAvatar?: string;
  creatorId: string;
  createdAt: string;
  creator: {
    id: string;
    userName: string;
    avatarUrl?: string;
  };
  members: {
    userId: string;
    role: "ADMIN" | "PENDING" | "MEMBER";
    user: {
      id: string;
      userName: string;
      avatarUrl?: string;
    };
  }[];
  _count?: {
    members: number;
  };
}

export interface CreateGroupDto {
  name: string;
  description?: string;
}

export interface GroupPost {
  id: string;
  content: string;
  attachments?: {
    type: "image" | "video";
    url: string;
  }[];
  user: {
    id: string;
    userName: string;
    avatarUrl?: string;
  };
  createdAt: string;
  _count?: {
    comments: number;
    likes: number;
  };
}

export interface JoinRequest {
  id: string;
  userId: string;
  groupId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user: {
    id: string;
    userName: string;
    avatarUrl: string;
  };
}

export const groupApi = {
  getGroups: async (onlyUserGroups?: boolean) => {
    const response = await axiosClient.get(
      `/groups${onlyUserGroups ? "?onlyUserGroups=true" : ""}`
    );
    return response.data;
  },

  getGroupById: async (groupId: string) => {
    const response = await axiosClient.get(`/groups/${groupId}`);
    return response.data;
  },

  createGroup: async (formData: FormData): Promise<Group> => {
    const response = await axiosClient.post(`/groups`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  requestJoinGroup: async (groupId: string) => {
    const response = await axiosClient.post(`/groups/${groupId}/join`);
    return response.data;
  },

  getJoinRequests: async (groupId: string): Promise<JoinRequest[]> => {
    const response = await axiosClient.get(`/groups/${groupId}/join-requests`);
    return response.data;
  },

  approveJoinRequest: async (
    groupId: string,
    userId: string
  ): Promise<void> => {
    await axiosClient.post(`/groups/${groupId}/approve/${userId}`);
  },

  rejectJoinRequest: async (
    groupId: string,
    userId: string | undefined
  ): Promise<void> => {
    await axiosClient.post(`/groups/${groupId}/reject/${userId}`);
  },

  // Group Posts
  getGroupPosts: async (groupId: string) => {
    const response = await axiosClient.get(`/groups/${groupId}/posts`);
    return response.data;
  },

  createGroupPost: async (
    groupId: string,
    data: {
      content: string;
      attachments?: { type: "image" | "video"; url: string }[];
    }
  ) => {
    const response = await axiosClient.post(`/groups/${groupId}/posts`, data);
    return response.data;
  },

  updateGroupPost: async (
    groupId: string,
    postId: string,
    data: {
      content: string;
      attachments?: { type: "image" | "video"; url: string }[];
    }
  ) => {
    const response = await axiosClient.put(
      `/groups/${groupId}/posts/${postId}`,
      data
    );
    return response.data;
  },

  deleteGroupPost: async (groupId: string, postId: string) => {
    const response = await axiosClient.delete(
      `/groups/${groupId}/posts/${postId}`
    );
    return response.data;
  },
};
