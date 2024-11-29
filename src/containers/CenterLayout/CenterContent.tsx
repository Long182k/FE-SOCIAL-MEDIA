import {
  AppstoreOutlined,
  FormOutlined,
  HeartOutlined,
  MessageOutlined,
  PlusOutlined,
  StarOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Avatar, Button, Card, Input, Layout, List, Typography } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  convertToHumanTime,
  getBackgroundColor,
  getTextColor,
} from "../../@util/helpers";
import { ErrorResponseData } from "../../@util/interface/auth.interface";
import { createNewPost, getAllPosts } from "../../api/post";
import IconText from "../../components/IconText";

const { Content } = Layout;
const { Text } = Typography;
const { TextArea } = Input;

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
const CenterContent = ({ isDarkMode }: CenterContentProps) => {
  const [postContent, setPostContent] = useState("");

  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  const createNewPostMutation = useMutation({
    mutationFn: createNewPost,
    onSuccess: () => {
      toast.success("Post created successfully!");
      setPostContent("");
      postsQuery.refetch();
    },
    onError: (error: AxiosError<ErrorResponseData>) => {
      const message =
        error.response?.status === 401
          ? error.response?.data?.message
          : "Try Again";
      toast.error(message);
    },
  });

  const handleCreatePost = () => {
    if (postContent.trim()) {
      createNewPostMutation.mutateAsync({
        content: postContent,
        userId: "10432170-eaa6-4f03-bc53-3517679b332f",
      });
    } else {
      toast.warning("Please enter some content before posting!");
    }
  };

  return (
    <Layout>
      <Content style={{ background: isDarkMode ? "black" : "" }}>
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
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
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
            <Button
              icon={<FormOutlined />}
              type="primary"
              onClick={handleCreatePost}
            >
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
            dataSource={postsQuery.data?.data || []}
            renderItem={(item) => (
              <List.Item
                key={item.id}
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    ...getTextColor(isDarkMode),
                  }}
                >
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=1`}
                    size={48}
                    style={{ marginRight: "12px" }}
                  />
                  <div>
                    <Typography.Text strong style={getTextColor(isDarkMode)}>
                      {item.user.userName}
                    </Typography.Text>
                    <div
                      style={{
                        color: isDarkMode ? "#ffffff99" : "#00000073",
                      }}
                    >
                      {convertToHumanTime(item.user.createdAt)}
                    </div>
                  </div>
                </div>

                <Typography.Paragraph
                  style={{ margin: "8px 0", ...getTextColor(isDarkMode) }}
                >
                  {item.content}
                </Typography.Paragraph>

                <div style={{ margin: "8px 0" }}>
                  <img
                    src={
                      "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    }
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
};

export default CenterContent;
