import {
  AppstoreOutlined,
  BulbOutlined,
  FormOutlined,
  HeartOutlined,
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
  StarOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Input,
  Layout,
  List,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import { getBackgroundColor, getTextColor } from "../../@util/helpers";
import IconText from "../../components/IconText";

const { Header, Content } = Layout;
const { TextArea } = Input;
const { Text } = Typography;

const data = Array.from({ length: 5 }).map((_, i) => ({
  href: "https://ant.design",
  title: `User ${i}`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  postedTime: "1h",
  content: "We supply a series of design principles",
  image: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
}));

const storiesData = [
  { name: "Add Story", icon: <PlusOutlined />, isAddStory: true },
  { name: "Esther Howard", avatar: "https://via.placeholder.com/64" },
  { name: "Arlene McCoy", avatar: "https://via.placeholder.com/64" },
  { name: "Robert Fox", avatar: "https://via.placeholder.com/64" },
  { name: "Albert Flores", avatar: "https://via.placeholder.com/64" },
  { name: "Annette Black", avatar: "https://via.placeholder.com/64" },
];

interface CenterContentProps {
  isDarkMode: boolean;
  handleThemeChange: (
    checked: boolean | ((prevState: boolean) => boolean)
  ) => void;
}

function CenterContent({
  isDarkMode,
  handleThemeChange,
}: CenterContentProps): JSX.Element {
  return (
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
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
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

      <Content>
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
                    styleIcon={getTextColor(isDarkMode)}
                  />,
                  <IconText
                    icon={HeartOutlined}
                    text="156"
                    key="list-vertical-like-o"
                    styleIcon={getTextColor(isDarkMode)}
                  />,
                  <IconText
                    icon={MessageOutlined}
                    text="2"
                    key="list-vertical-message"
                    styleIcon={getTextColor(isDarkMode)}
                  />,
                ]}
              >
                {/* Header Section with Avatar, Title, and Posted Time */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    ...getTextColor(isDarkMode),
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
  );
}

export default CenterContent;
