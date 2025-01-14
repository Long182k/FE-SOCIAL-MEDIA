import {
  ShareAltOutlined,
  UserAddOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Layout,
  List,
  Space,
  Typography,
  Skeleton,
} from "antd";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { groupApi, GroupPost } from "../../../api/group";
import "./index.css";

const { Title, Text } = Typography;

interface GroupDetailProps {
  isDarkMode: boolean;
}

function GroupDetail({ isDarkMode }: GroupDetailProps) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const groupName = location.state?.groupName || searchParams.get("groupName");
  const groupId = searchParams.get("groupId");

  const { data: groupPosts } = useQuery({
    queryKey: ["groupPosts", groupId],
    queryFn: () => groupApi.getGroupPosts(groupId!),
    enabled: !!groupId,
  });

  const { data: group, isLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => groupApi.getGroupById(groupId!),
    enabled: !!groupId,
  });

  if (!groupId) {
    return <Navigate to="/groups" replace />;
  }

  if (isLoading) {
    return (
      <Layout
        style={{
          background: isDarkMode ? "#141414" : "#ffffff",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="group-detail-container">
          <div className="group-cover-container">
            <Skeleton.Image
              active
              style={{
                height: "350px",
                borderRadius: 0,
              }}
            />
          </div>

          <div
            className="group-info-section"
            style={{
              borderBottom: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
              padding: "24px",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <Skeleton.Button
                active
                size="large"
                style={{ marginBottom: "16px", width: 200 }}
              />
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Skeleton.Avatar active size="default" />
              <Skeleton.Avatar active size="default" />
              <Skeleton.Avatar active size="default" />
            </div>
          </div>

          <div style={{ padding: "24px" }}>
            <Skeleton.Button
              active
              style={{ marginBottom: "16px", width: 120 }}
            />
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      style={{
        background: isDarkMode ? "#141414" : "#ffffff",
      }}
    >
      <div className="group-detail-container">
        <div className="group-cover-container">
          <img
            className="group-cover-image"
            src={group?.groupAvatar || "https://via.placeholder.com/1200x350"}
            alt={groupName}
          />
        </div>

        <div
          className="group-info-section"
          style={{
            borderBottom: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
          }}
        >
          <div className="group-info-container">
            <Button
              className="back-button"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/groups?groupType=joined")}
              shape="circle"
              style={{
                background: isDarkMode ? "#1f1f1f" : "#f0f0f0",
                borderColor: isDarkMode ? "#303030" : "#d9d9d9",
                color: isDarkMode ? "#ffffff" : "#000000",
              }}
            />
            <div className="group-info-content">
              <Title
                level={2}
                className="group-title"
                style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
              >
                {groupName}
              </Title>
              <Space size={4} className="member-info">
                <Text
                  type="secondary"
                  style={{
                    color: isDarkMode ? "#ffffff" : undefined,
                  }}
                >
                  {group?._count?.members.toLocaleString()} members
                </Text>
                <Text type="secondary">•</Text>
                <div className="member-avatars">
                  {group?.members?.slice(0, 5).map((member: any) => (
                    <Avatar
                      key={member.user.id}
                      src={member.user.avatarUrl}
                      className="member-avatar"
                      style={{
                        border: `2px solid ${
                          isDarkMode ? "#141414" : "#ffffff"
                        }`,
                      }}
                    />
                  ))}
                </div>
              </Space>
            </div>
          </div>

          <Space>
            <Button
              icon={<UserAddOutlined />}
              style={{
                background: isDarkMode ? "#141414" : "#ffffff",
                borderColor: isDarkMode ? "#303030" : "#d9d9d9",
                color: isDarkMode ? "#ffffff" : "#000000",
              }}
            >
              Invite
            </Button>
            <Button
              icon={<ShareAltOutlined />}
              style={{
                background: isDarkMode ? "#141414" : "#ffffff",
                borderColor: isDarkMode ? "#303030" : "#d9d9d9",
                color: isDarkMode ? "#ffffff" : "#000000",
              }}
            >
              Share
            </Button>
            <Button
              type="primary"
              style={{
                background: "#000000",
                borderColor: "#000000",
              }}
            >
              Joined
            </Button>
          </Space>
        </div>

        <div className="posts-container">
          <List
            itemLayout="vertical"
            dataSource={groupPosts}
            renderItem={(post: GroupPost) => (
              <List.Item
                key={post.id}
                extra={post.attachments?.map((attachment) => (
                  <img
                    key={attachment.url}
                    width={272}
                    alt="post attachment"
                    src={attachment.url}
                  />
                ))}
              >
                <List.Item.Meta
                  avatar={<Avatar src={post.user.avatarUrl} />}
                  title={post.user.userName}
                  description={new Date(post.createdAt).toLocaleDateString()}
                />
                {post.content}
              </List.Item>
            )}
          />
        </div>
      </div>
    </Layout>
  );
}

export default GroupDetail;
