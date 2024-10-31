import {
  AntDesignOutlined,
  AppstoreOutlined,
  BellOutlined,
  BookOutlined,
  BulbOutlined,
  FormOutlined,
  HeartOutlined,
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  ShopOutlined,
  StarOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Input,
  Layout,
  List,
  Menu,
  Space,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import "antd/dist/reset.css";
import React, { useState } from "react";
import "./HomePage.css";

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

const contacts = [
  { name: "Julia Clarke", location: "New York, USA" },
  { name: "Mark Stefine", location: "Sydney, Australia" },
  { name: "Sara Cliene", location: "Tokyo, Japan" },
];

const data = Array.from({ length: 5 }).map((_, i) => ({
  href: "https://ant.design",
  title: `User ${i}`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  postedTime: "1h",
  content: "We supply a series of design principles",
  image: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
}));

const events = [
  { title: "Design Talks", date: "12 Oct, 13:00 IST", attendees: 112 },
  { title: "UX/UI Conference", date: "15 Nov, 10:00 IST", attendees: 98 },
];

const storiesData = [
  { name: "Add Story", icon: <PlusOutlined />, isAddStory: true },
  { name: "Esther Howard", avatar: "https://via.placeholder.com/64" },
  { name: "Arlene McCoy", avatar: "https://via.placeholder.com/64" },
  { name: "Robert Fox", avatar: "https://via.placeholder.com/64" },
  { name: "Albert Flores", avatar: "https://via.placeholder.com/64" },
  { name: "Annette Black", avatar: "https://via.placeholder.com/64" },
];

const IconText = ({ icon, text, styleIcon }) => (
  <span
    style={{ display: "flex", alignItems: "center", gap: "4px", ...styleIcon }}
  >
    {React.createElement(icon)}
    <span>{text}</span>
  </span>
);

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getTextColor = (isDark: boolean) => ({
    color: isDark ? "#ffffff" : "#000000",
  });

  const getBackgroundColor = (isDark: boolean) => ({
    background: isDark ? "#1f1f1f" : "#ffffff",
  });

  const handleThemeChange = (
    checked: boolean | ((prevState: boolean) => boolean)
  ) => {
    setIsDarkMode(checked);
    document.body.style.backgroundColor = checked ? "#141414" : "#ffffff";
    document.body.style.color = checked ? "#ffffff" : "#000000";
  };

  return (
    <Layout className="homepage-layout">
      {/* Left Sider */}
      <Sider
        width={250}
        style={
          isDarkMode ? { background: "#1f1f1f" } : { background: "#ffffff" }
        }
      >
        <div className="logo">
          <Title
            level={1}
            style={{
              margin: "16px",
              color: isDarkMode ? "#ffffff" : "#ff6b6b",
              fontFamily: "'Great Vibes', cursive",
            }}
          >
            Friendzii
          </Title>
        </div>
        <Menu
          className="menu-sider-left"
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ borderRight: 0 }}
          theme={isDarkMode ? "dark" : "light"}
        >
          <Menu.Item key="1" icon={<UserOutlined />}>
            <span style={getTextColor(isDarkMode)}>Feed</span>
          </Menu.Item>
          <Menu.Item key="2" icon={<SearchOutlined />}>
            <span style={getTextColor(isDarkMode)}>Explore</span>
          </Menu.Item>
          <Menu.Item key="3" icon={<ShopOutlined />}>
            <span style={getTextColor(isDarkMode)}>Marketplace</span>
          </Menu.Item>
          <Menu.Item key="4" icon={<UsergroupAddOutlined />}>
            <span style={getTextColor(isDarkMode)}>Groups</span>
          </Menu.Item>
          <Menu.Item key="5" icon={<BookOutlined />}>
            <span style={getTextColor(isDarkMode)}>Bookmarks</span>
          </Menu.Item>
          <Menu.Item key="6" icon={<MessageOutlined />}>
            <span style={getTextColor(isDarkMode)}>Messages</span>
          </Menu.Item>
          <Menu.Item key="7" icon={<BellOutlined />}>
            <span style={getTextColor(isDarkMode)}>Notifications</span>
          </Menu.Item>
          <Menu.Item key="8" icon={<SettingOutlined />}>
            <span style={getTextColor(isDarkMode)}>Settings</span>
          </Menu.Item>
        </Menu>
        <Divider />
        <div className="contacts">
          <Title level={5} style={getTextColor(isDarkMode)}>
            My Contacts
          </Title>
          <List
            dataSource={contacts}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src="https://example.com/avatar.jpg" />}
                  title={
                    <Text strong style={getTextColor(isDarkMode)}>
                      {item.name}
                    </Text>
                  }
                  description={
                    <Text
                      style={{ color: isDarkMode ? "#ffffff99" : "#00000073" }}
                    >
                      {item.location}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Sider>

      {/* Main Content Layout */}
      <Layout
        className="main-content-layout"
        style={{ background: isDarkMode ? "black" : "" }}
      >
        <Header
          className="responsive-header"
          style={{
            background: isDarkMode ? "#141414" : "#fff",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="Search something here..."
            prefix={<SearchOutlined style={getTextColor(isDarkMode)} />}
            style={{
              width: 300,
              marginLeft: "8px",
              color: isDarkMode ? "#fff" : "#000",
              borderRadius: "10px",
              background: isDarkMode ? "rgb(100 100 100)" : "#ffffff",
              borderColor: isDarkMode ? "#333" : "#ddd",
              alignSelf: "center",
              marginTop: "8px",
            }}
          />
          <div
            className="header-right"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Text style={getTextColor(isDarkMode)}>Lillibridge</Text>
            <Avatar icon={<UserOutlined />} />
            <Tooltip
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              <Switch
                checkedChildren={<BulbOutlined />}
                unCheckedChildren={<BulbOutlined />}
                checked={isDarkMode}
                onChange={handleThemeChange}
              />
            </Tooltip>
          </div>
        </Header>

        <Content
        // className="main-content"
        // style={{ background: isDarkMode ? "black" : "" }}
        >
          {/* Stories Component */}
          <div className={`stories-container ${isDarkMode ? "dark-mode" : ""}`}>
            <List
              grid={{ gutter: 16, column: 6 }}
              dataSource={storiesData}
              renderItem={(item) => (
                <List.Item className="story-item">
                  {item.isAddStory ? (
                    <div className="story-avatar-container">
                      <Avatar
                        size={64}
                        icon={<PlusOutlined />}
                        className="add-story-avatar"
                        style={{
                          backgroundColor: isDarkMode ? "#4e4e4e" : "#e0e0e0",
                          color: isDarkMode ? "#fff" : "#000",
                        }}
                      />
                      <Text className="story-name">{item.name}</Text>
                    </div>
                  ) : (
                    <div className="story-avatar-container">
                      <Avatar
                        size={64}
                        src={item.avatar}
                        className="story-avatar"
                        style={{
                          border: isDarkMode
                            ? "2px solid #4e4e4e"
                            : "2px solid #e0e0e0",
                        }}
                      />
                      <Text className="story-name">{item.name}</Text>
                    </div>
                  )}
                </List.Item>
              )}
            />
          </div>

          {/* Create a Post Component */}
          <Card
            className="create-post-card"
            style={{
              border: "1px solid grey",
              ...getBackgroundColor(isDarkMode),
            }}
          >
            <div style={{ display: "flex" }}>
              <Avatar icon={<UserOutlined />} />

              <TextArea
                style={{
                  marginLeft: "20px",
                  borderRadius: "10px",
                  background: isDarkMode ? "rgb(100 100 100)" : "#ffffff",
                  borderColor: isDarkMode ? "#333" : "#ddd",
                  ...getTextColor(isDarkMode),
                }}
                placeholder="What's on your mind?"
                rows={2}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Button
                className="post-features-buttons"
                icon={<VideoCameraOutlined />}
                style={{
                  ...getTextColor(isDarkMode),
                  backgroundColor: isDarkMode ? "#1f1f1f" : "",
                }}
              >
                Live video
              </Button>
              <Button
                className="post-features-buttons"
                icon={<AppstoreOutlined />}
                style={{
                  ...getTextColor(isDarkMode),
                  backgroundColor: isDarkMode ? "#1f1f1f" : "",
                }}
              >
                Photos
              </Button>
              <Button
                className="post-features-buttons"
                icon={<HeartOutlined />}
                style={{
                  ...getTextColor(isDarkMode),
                  backgroundColor: isDarkMode ? "#1f1f1f" : "",
                }}
              >
                Feeling
              </Button>
              <Button icon={<FormOutlined />} type="primary">
                Create a post
              </Button>
            </div>
          </Card>

          {/* Post List */}
          <Card
            style={{
              marginTop: "16px",
              background: isDarkMode ? "black" : "#f6f6f9",
              ...getTextColor(isDarkMode),
            }}
          >
            <List
              style={{ ...getTextColor(isDarkMode) }}
              itemLayout="vertical"
              size="large"
              dataSource={data}
              renderItem={(item) => (
                <List.Item
                  key={item.title}
                  style={{
                    padding: "16px",
                    marginBottom: "16px",
                    borderRadius: "16px",
                    backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
                  }}
                  actions={[
                    <IconText
                      icon={StarOutlined}
                      text="156"
                      key="list-vertical-star-o"
                      styleIcon={getTextColor(isDarkMode)} // Apply dynamic text color
                    />,
                    <IconText
                      icon={HeartOutlined}
                      text="156"
                      key="list-vertical-like-o"
                      styleIcon={getTextColor(isDarkMode)} // Apply dynamic text color
                    />,
                    <IconText
                      icon={MessageOutlined}
                      text="2"
                      key="list-vertical-message"
                      styleIcon={getTextColor(isDarkMode)} // Apply dynamic text color
                    />,
                  ]}
                >
                  {/* Header Section with Avatar, Title, and Posted Time */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                      ...getTextColor(isDarkMode), // Apply dynamic text color
                    }}
                  >
                    <Avatar
                      src={item.avatar}
                      size={48}
                      style={{ marginRight: "12px" }}
                    />
                    <div>
                      <Typography.Text strong style={getTextColor(isDarkMode)}>
                        {item.title}
                      </Typography.Text>
                      <div
                        style={{
                          color: isDarkMode ? "#ffffff99" : "#00000073",
                        }}
                      >
                        {item.postedTime}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <Typography.Paragraph
                    style={{ margin: "8px 0", ...getTextColor(isDarkMode) }}
                  >
                    {item.content}
                  </Typography.Paragraph>

                  {/* Image Section */}
                  <div style={{ margin: "8px 0" }}>
                    <img
                      src={item.image}
                      alt="content"
                      width="100%"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Content>
      </Layout>

      {/* Right Sider */}
      <Sider
        width={300}
        breakpoint="lg"
        collapsedWidth="0"
        theme={isDarkMode ? "dark" : "light"}
        style={{
          ...getBackgroundColor(isDarkMode),
        }}
      >
        <Card
          title={<span style={getTextColor(isDarkMode)}>You might like</span>}
          extra={
            <a href="#" style={{ color: isDarkMode ? "#1677ff" : "#1677ff" }}>
              See all
            </a>
          }
          style={getBackgroundColor(isDarkMode)}
        >
          <List.Item>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                size={64}
                src="https://api.dicebear.com/7.x/miniavs/svg?seed=3"
              />
              <div style={{ marginLeft: 16 }}>
                <Text strong style={getTextColor(isDarkMode)}>
                  Mohammad Rafli
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Avatar.Group maxCount={2}>
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
                    <Avatar
                      style={{ backgroundColor: "#87d068" }}
                      icon={<UserOutlined />}
                    />
                    <Avatar
                      style={{ backgroundColor: "#1677ff" }}
                      icon={<AntDesignOutlined />}
                    />
                  </Avatar.Group>
                  <Text
                    strong
                    style={{
                      marginLeft: 8,
                      color: isDarkMode ? "#ffffff99" : "#00000073",
                    }}
                  >
                    15 Mutuals
                  </Text>
                </div>
                <Space style={{ marginTop: 16 }}>
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#ff4d4f",
                      borderColor: "#ff4d4f",
                    }}
                  >
                    Follow
                  </Button>
                  <Button
                    type="default"
                    style={{
                      ...getTextColor(isDarkMode),
                      backgroundColor: isDarkMode ? "#1f1f1f" : "",
                    }}
                  >
                    Ignore
                  </Button>
                </Space>
              </div>
            </div>
          </List.Item>
        </Card>

        <Card
          title={<span style={getTextColor(isDarkMode)}>Upcoming Events</span>}
          style={{ marginTop: "16px", ...getBackgroundColor(isDarkMode) }}
        >
          {events.map((event) => (
            <Card.Grid
              key={event.title}
              style={{
                width: "100%",
                margin: "16px 16px 0px 16px",
                backgroundImage:
                  "linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)",
                borderRadius: "12px",
              }}
            >
              <Title level={5} style={{ color: "#000000" }}>
                {event.title}
              </Title>
              <Text style={{ color: "#000000" }}>{event.date}</Text>
              <div style={{ color: "#000000" }}>+{event.attendees} Joined</div>
            </Card.Grid>
          ))}
        </Card>

        <Card
          title={<span style={getTextColor(isDarkMode)}>Recent Chats</span>}
          style={{ marginTop: "16px", ...getBackgroundColor(isDarkMode) }}
        >
          <List
            dataSource={contacts}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src="https://example.com/avatar.jpg" />}
                  title={
                    <Text strong style={getTextColor(isDarkMode)}>
                      {item.name}
                    </Text>
                  }
                  description={
                    <Text
                      style={{
                        color: isDarkMode ? "#ffffff99" : "#00000073",
                      }}
                    >
                      {item.location}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Sider>
    </Layout>
  );
};

export default HomePage;
