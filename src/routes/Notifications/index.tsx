import { Layout, List, Avatar, Typography, Space } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

interface NotificationProps {
  isDarkMode: boolean;
}

interface Notification {
  id: string;
  username: string;
  action: string;
  timestamp: string;
  avatar?: string;
}

function Notifications({ isDarkMode }: NotificationProps): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simulated notifications data - replace with actual API call
  useEffect(() => {
    const dummyNotifications = [
      {
        id: "1",
        username: "@wesbos",
        action: "liked your reply",
        timestamp: "1 min ago",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      },
      // Add more dummy notifications as needed
    ];
    setNotifications(dummyNotifications);
  }, []);

  return (
    <Layout
      className="main-content-layout"
      style={{
        background: isDarkMode ? "#141414" : "#ffffff",
        padding: "0 24px",
      }}
    >
      <Typography.Title
        level={1}
        style={{
          color: isDarkMode ? "#ffffff" : "#000000",
          padding: "16px 0",
          margin: 0,
          fontSize: "24px",
        }}
      >
        All Notifications
      </Typography.Title>

      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <EllipsisOutlined
                key="ellipsis"
                style={{
                  fontSize: "20px",
                  color: isDarkMode ? "#ffffff80" : "#00000080",
                }}
              />,
            ]}
            style={{
              padding: "12px 0",
              borderBottom: `1px solid ${
                isDarkMode ? "#ffffff1a" : "#0000000a"
              }`,
            }}
          >
            <List.Item.Meta
              avatar={
                item.avatar ? (
                  <Avatar src={item.avatar} size={40} />
                ) : (
                  <Avatar size={40}>{item.username[0]}</Avatar>
                )
              }
              title={
                <Space>
                  <Typography.Text
                    strong
                    style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
                  >
                    {item.username}
                  </Typography.Text>
                  <Typography.Text
                    style={{ color: isDarkMode ? "#ffffff99" : "#00000099" }}
                  >
                    {item.action}
                  </Typography.Text>
                </Space>
              }
              description={
                <Typography.Text
                  style={{
                    color: isDarkMode ? "#ffffff60" : "#00000060",
                    fontSize: "12px",
                  }}
                >
                  {item.timestamp}
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
