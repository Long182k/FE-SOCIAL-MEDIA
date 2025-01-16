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
};

export default adminApi;
