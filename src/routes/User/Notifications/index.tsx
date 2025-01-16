import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, Layout, List, message, Space, Typography } from "antd";
import { formatDistanceToNow } from "date-fns";
import {
  notificationApi,
  NotificationResponse,
} from "../../../api/notification";
import "./index.css";

interface NotificationProps {
  isDarkMode: boolean;
}

function Notifications({ isDarkMode }: NotificationProps): JSX.Element {
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await notificationApi.findAll();
      return response.data;
    },
  });

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      message.success("Notification deleted successfully");
    },
    onError: () => {
      message.error("Failed to delete notification");
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.updateIsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  return (
    <Layout className={`notifications-layout ${isDarkMode ? "dark" : "light"}`}>
      <Typography.Title
        level={1}
        className={`notifications-title ${isDarkMode ? "dark" : "light"}`}
      >
        All Notifications
      </Typography.Title>

      <List
        loading={isLoading}
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item: NotificationResponse) => (
          <List.Item
            key={item.id}
            actions={[
              <DeleteOutlined
                key="delete"
                onClick={() => handleDelete(item.id)}
                className={`notification-delete-icon ${
                  isDarkMode ? "dark" : "light"
                }`}
              />,
            ]}
            onClick={() => !item.isRead && handleMarkAsRead(item.id)}
            className={`notification-item ${isDarkMode ? "dark" : "light"} ${
              !item.isRead ? "unread" : ""
            }`}
          >
            <List.Item.Meta
              avatar={
                item.sender.avatarUrl ? (
                  <Avatar src={item.sender.avatarUrl} size={40} />
                ) : (
                  <Avatar size={40}>{item.sender.userName[0]}</Avatar>
                )
              }
              title={
                <Space>
                  <Typography.Text
                    className={`notification-content ${
                      isDarkMode ? "dark" : "light"
                    }`}
                  >
                    {item.content}
                  </Typography.Text>
                </Space>
              }
              description={
                <Typography.Text
                  className={`notification-time ${
                    isDarkMode ? "dark" : "light"
                  }`}
                >
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  })}
                </Typography.Text>
              }
            />
          </List.Item>
        )}
      />
    </Layout>
  );
}

export default Notifications;
