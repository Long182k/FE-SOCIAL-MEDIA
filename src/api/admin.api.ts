import { axiosClient } from "./axiosConfig";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalGroups: number;
  totalEvents: number;
  postSentimentRatio: {
    total: number;
    positive: number;
    negative: number;
    moderate: number;
  };
  commentSentimentRatio: {
    total: number;
    positive: number;
    negative: number;
    moderate: number;
  };
  userGrowthData: {
    day: string;
    dayName: string;
    count: number;
  }[];
  mostPositiveUser: {
    userName: string;
    positivePosts: number;
    positiveComments: number;
    totalPositive: number;
  };
  mostNegativeUser: {
    userName: string;
    negativePosts: number;
    negativeComments: number;
    totalNegative: number;
  };
}

export interface UserManagementData {
  users: {
    id: string;
    userName: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    lastLoginAt: string | null;
    _count: {
      posts: number;
      followers: number;
      following: number;
    };
    postSentimentRatio: {
      GOOD: number;
      MODERATE: number;
      BAD: number;
    };
    commentSentimentRatio: {
      GOOD: number;
      MODERATE: number;
      BAD: number;
    };
  }[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GroupManagementData {
  groups: {
    id: string;
    name: string;
    description: string | null;
    groupAvatar: string | null;
    createdAt: string;
    creator: {
      userName: string;
    };
    _count: {
      members: number;
      posts: number;
    };
  }[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EventManagementData {
  events: {
    id: string;
    name: string;
    description: string;
    eventAvatar: string | null;
    eventDate: string;
    category: string;
    address: string | null;
    createdAt: string;
    creator: {
      userName: string;
    };
    _count: {
      attendees: number;
    };
  }[];
  total: number;
  page: number;
  pageSize: number;
}

const adminApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosClient.get(`/admin/dashboard-stats`);
    return response.data;
  },

  getUserManagementData: async (
    page: number,
    pageSize: number
  ): Promise<UserManagementData> => {
    const response = await axiosClient.get(`/admin/users`, {
      params: { page, pageSize },
    });
    return response.data;
  },

  toggleUserActivity: async (userId: string) => {
    const response = await axiosClient.patch(
      `/admin/users/${userId}/toggle-activity`
    );
    return response.data;
  },

  getGroupManagementData: async (
    page: number,
    pageSize: number
  ): Promise<GroupManagementData> => {
    const response = await axiosClient.get(`/admin/groups`, {
      params: { page, pageSize },
    });
    return response.data;
  },

  deleteGroup: async (groupId: string) => {
    const response = await axiosClient.delete(`/admin/groups/${groupId}`);
    return response.data;
  },

  getEventManagementData: async (
    page: number,
    pageSize: number
  ): Promise<EventManagementData> => {
    const response = await axiosClient.get(`/admin/events`, {
      params: { page, pageSize },
    });
    return response.data;
  },

  deleteEvent: async (eventId: string) => {
    const response = await axiosClient.delete(`/admin/events/${eventId}`);
    return response.data;
  },
};

export default adminApi;
