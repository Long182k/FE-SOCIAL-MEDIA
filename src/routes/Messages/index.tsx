import { SearchOutlined, SendOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Divider,
  Input,
  Layout,
  List,
  Space,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL);

const { Sider, Content } = Layout;
const { Text } = Typography;

const messageszz = [
  {
    id: 1,
    user: "Florian",
    message: "whats up guys?",
    timestamp: "Today at 7:55 AM",
  },
  {
    id: 2,
    user: "Coding in Flow",
    message: "pls respond",
    timestamp: "Today at 7:58 AM",
  },
];

const chatGroups = [
  {
    id: 1,
    name: "Florian, Coding in Flow, Fridolin",
    lastMessage: "whats up guys?",
    avatar: "F",
    unread: true,
  },
  {
    id: 2,
    name: "Coding in Flow",
    lastMessage: "pls respond",
    avatar: "C",
    unread: false,
  },
];

interface MessageAppProps {
  isDarkMode: boolean;
}

function MessagesApp({ isDarkMode }: MessageAppProps): JSX.Element {
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");

  const handleSendNewMsg = () => {
    console.log("click");
    socket.emit("message", newMessages);
    setNewMessages("");
  };

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  return (
    <Layout style={{ height: "100vh", background: "#181818" }}>
      {/* Sidebar */}
      <Sider width={300} style={{ background: "#2b2b2b", padding: "20px" }}>
        <Typography.Title
          level={4}
          style={{ color: "#fff", marginBottom: "20px" }}
        >
          Messages
        </Typography.Title>

        {/* Search Bar */}
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{
            backgroundColor: "#1f1f1f",
            border: "none",
            color: "#fff",
            marginBottom: "20px",
          }}
        />

        {/* Chat Groups List */}
        <List
          dataSource={chatGroups}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              style={{
                backgroundColor: item.unread ? "#333" : "transparent",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: "#1890ff" }}>
                    {item.avatar}
                  </Avatar>
                }
                title={
                  <Space>
                    <Text style={{ color: "#fff" }}>{item.name}</Text>
                    {item.unread && (
                      <Badge dot style={{ backgroundColor: "#ff4d4f" }} />
                    )}
                  </Space>
                }
                description={
                  <Text style={{ color: "#999" }}>{item.lastMessage}</Text>
                }
              />
            </List.Item>
          )}
        />
      </Sider>

      {/* Chat Content */}
      <Content
        style={{ padding: "20px", background: "#181818", color: "#fff" }}
      >
        {/* Chat Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Avatar size={48} style={{ backgroundColor: "#1890ff" }}>
            F
          </Avatar>
          <div style={{ marginLeft: "15px" }}>
            <Text style={{ fontSize: "18px", color: "#fff" }}>
              Florian, Coding in Flow, Fridolin
            </Text>
            <Text style={{ color: "#999", display: "block" }}>
              3 members, 2 online
            </Text>
          </div>
        </div>
        <Divider style={{ backgroundColor: "#333" }} />

        {/* Messages */}
        <div style={{ height: "calc(100vh - 200px)", overflowY: "auto" }}>
          <Text type="secondary" style={{ color: "#999" }}>
            UNREAD MESSAGES
          </Text>

          {messages.map((msg, id) => (
            <Text key={id} style={{ color: "white" }}>
              {" "}
              {msg}
            </Text>
          ))}

          {/* <List
            dataSource={messageszz}
            renderItem={(item) => (
              <List.Item key={item.id} style={{ padding: "15px 0" }}>
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: "#1890ff" }}>
                      {item.user.charAt(0)}
                    </Avatar>
                  }
                  title={<Text style={{ color: "#fff" }}>{item.user}</Text>}
                  description={
                    <Space direction="vertical">
                      <Text
                        style={{
                          color: "#fff",
                          backgroundColor: "#333",
                          padding: "10px 15px",
                          borderRadius: "10px",
                        }}
                      >
                        {item.message}
                      </Text>
                      <Text style={{ color: "#999", fontSize: "12px" }}>
                        {item.timestamp}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          /> */}
        </div>

        {/* Message Input */}
        <Input
          placeholder="Type your message"
          suffix={
            <SendOutlined
              onClick={handleSendNewMsg}
              style={{ color: "#1890ff" }}
            />
          }
          style={{
            backgroundColor: "#1f1f1f",
            borderRadius: "20px",
            marginTop: "10px",
            padding: "10px 15px",
            color: "#fff",
          }}
          onChange={(e) => setNewMessages(e.target.value)}
          value={newMessages}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendNewMsg();
            }
          }}
        />
      </Content>
    </Layout>
  );
}

export default MessagesApp;
