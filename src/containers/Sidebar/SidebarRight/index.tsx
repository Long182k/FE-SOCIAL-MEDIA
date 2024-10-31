import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Layout, List, Space, Typography } from "antd";
import "./index.css";
import { SiderRightProps } from "./interface";
import { getBackgroundColor, getTextColor } from "../../../@util/helpers";
const { Title, Text } = Typography;
const { Sider } = Layout;

const events = [
  { title: "Design Talks", date: "12 Oct, 13:00 IST", attendees: 112 },
  { title: "UX/UI Conference", date: "15 Nov, 10:00 IST", attendees: 98 },
];

const contacts = [
  { name: "Julia Clarke", location: "New York, USA" },
  { name: "Mark Stefine", location: "Sydney, Australia" },
  { name: "Sara Cliene", location: "Tokyo, Japan" },
];

function SiderRight({ isDarkMode }: SiderRightProps): JSX.Element {
  return (
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
                <Avatar.Group max={{ count: 2 }}>
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
  );
}

export default SiderRight;
