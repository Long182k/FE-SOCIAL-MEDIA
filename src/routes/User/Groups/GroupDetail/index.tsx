import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  CheckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Empty,
  Layout,
  List,
  Modal,
  Skeleton,
  Space,
  Typography,
  message,
} from "antd";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { groupApi, GroupPost } from "../../../../api/group";
import "./index.css";
import { useState } from "react";
import { useAppStore } from "../../../../store";

const { Title, Text } = Typography;

interface GroupDetailProps {
  isDarkMode: boolean;
}

function GroupDetail({ isDarkMode }: GroupDetailProps) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useAppStore();

  const [isCopied, setIsCopied] = useState(false);
  const [isJoinRequestsModalOpen, setIsJoinRequestsModalOpen] = useState(false);
  const queryClient = useQueryClient();

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

  const { data: joinRequests = [] } = useQuery({
    queryKey: ["joinRequests", groupId],
    queryFn: () => groupApi.getJoinRequests(groupId!),
    enabled: !!groupId && isJoinRequestsModalOpen,
  });

  const approveMutation = useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      groupApi.approveJoinRequest(groupId!, userId),
    onSuccess: () => {
      setIsJoinRequestsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["joinRequests", groupId] });
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });

      queryClient.invalidateQueries({ queryKey: ["groups", "joined"] });
      queryClient.invalidateQueries({ queryKey: ["groups", "exploring"] });
      message.success("Request approved successfully");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ userId }: { userId?: string }) =>
      groupApi.rejectJoinRequest(groupId!, userId),
    onSuccess: () => {
      navigate("/groups");
      setIsJoinRequestsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["joinRequests", groupId] });
    },
  });

  const handleApprove = (userId: string) => {
    approveMutation.mutate({ userId });
  };

  const handleReject = (userId?: string) => {
    rejectMutation.mutate({ userId });
  };

  const isAdmin = userInfo?.userId === group?.creatorId;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      message.success("Group link copied to clipboard!");

      // Reset the button after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      message.error("Failed to copy link");
    }
  };

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

  const joinRequestsModal = (
    <Modal
      title="Join Requests"
      open={isJoinRequestsModalOpen}
      onCancel={() => setIsJoinRequestsModalOpen(false)}
      footer={null}
      style={{ top: 20 }}
    >
      <List
        itemLayout="horizontal"
        dataSource={joinRequests}
        locale={{
          emptyText: (
            <Empty
              description={
                <span style={{ color: isDarkMode ? "#ffffff" : undefined }}>
                  No pending requests
                </span>
              }
            />
          ),
        }}
        renderItem={(request) => (
          <List.Item
            key={request.id}
            actions={[
              <Button
                key="approve"
                type="primary"
                onClick={() => handleApprove(request.userId)}
                loading={approveMutation.isPending}
              >
                Approve
              </Button>,
              <Button
                key="reject"
                danger
                onClick={() => {
                  message.success("Reject request successfully");
                  handleReject(request.userId);
                }}
                loading={rejectMutation.isPending}
              >
                Reject
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={request.user.avatarUrl} />}
              title={request.user.userName}
              // description={`Requested on ${new Date(
              //   request.createdAt
              // ).toLocaleDateString()}`}
            />
          </List.Item>
        )}
      />
    </Modal>
  );

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
              icon={isCopied ? <CheckOutlined /> : <ShareAltOutlined />}
              onClick={handleShare}
              style={{
                background: isDarkMode ? "#141414" : "#ffffff",
                borderColor: isDarkMode ? "#303030" : "#d9d9d9",
                color: isDarkMode ? "#ffffff" : "#000000",
              }}
            >
              {isCopied ? "Copied" : "Share"}
            </Button>
            {isAdmin && (
              <Button
                icon={<UserOutlined />}
                onClick={() => setIsJoinRequestsModalOpen(true)}
                style={{
                  background: isDarkMode ? "#141414" : "#ffffff",
                  borderColor: isDarkMode ? "#303030" : "#d9d9d9",
                  color: isDarkMode ? "#ffffff" : "#000000",
                }}
              >
                View Join Requests
              </Button>
            )}
            {!isAdmin && (
              <Button
                type="primary"
                style={{
                  background: "#000000",
                  borderColor: "#000000",
                }}
                onClick={() => {
                  message.success("Leave group successfully");
                  handleReject();
                }}
              >
                Leave
              </Button>
            )}
          </Space>
        </div>

        <div className="posts-container">
          <List
            itemLayout="vertical"
            dataSource={groupPosts}
            locale={{
              emptyText: (
                <Empty
                  description={
                    <span style={{ color: isDarkMode ? "#ffffff" : undefined }}>
                      No posts yet
                    </span>
                  }
                />
              ),
            }}
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
      {joinRequestsModal}
    </Layout>
  );
}

export default GroupDetail;
