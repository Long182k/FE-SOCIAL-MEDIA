import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  LikeOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Image,
  Input,
  Space,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { useState } from "react";
import { toast } from "react-toastify";
import { formatTimeAgo, isVideoUrl } from "../../../@util/helpers";
import { CreateCommentDto, Post } from "../../../@util/types/post.type";
import { bookmarkApi } from "../../../api/bookmark";
import { postApi } from "../../../api/post";
import { useAppStore } from "../../../store";
import { renderContent } from "../../generalRender/renderContent";
import CommentItem from "./CommentItem";
import "./PostItem.css";
import { useNavigate } from "react-router-dom";
import type { UploadFile } from "antd/es/upload/interface";

interface PostItemProps {
  post: Post;
  currentUserId: string;
  isDarkMode: boolean;
  isLoadingPosts: boolean;
  refetchPosts: () => void;
  onEdit: (post: Post) => void;
  onDelete?: (postId: string) => Promise<void>;
}

const getSentimentMessage = (sentiment: string) => {
  switch (sentiment) {
    case "GOOD":
      return "This post has a positive sentiment based on its content";
    case "MODERATE":
      return "This post has a neutral sentiment based on its content";
    case "BAD":
      return "This post has a negative sentiment based on its content";
    default:
      return "Sentiment analysis not available";
  }
};

const PostItem = ({
  post,
  currentUserId,
  isDarkMode,
  isLoadingPosts,
  onEdit,
  refetchPosts,
}: PostItemProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { userInfo } = useAppStore();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const isOwner = post.userId === currentUserId;

  const likePostMutation = useMutation({
    mutationFn: postApi.likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Failed to like post");
    },
  });

  const bookmarkPostMutation = useMutation({
    mutationFn: bookmarkApi.bookmarkPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post bookmarked!");
    },
    onError: () => {
      toast.error("Failed to bookmark post");
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: postApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCommentDto }) => {
      const formData = new FormData();
      formData.append("content", data.content);
      
      if (data.files) {
        data.files.forEach((file) => {
          formData.append("files", file);
        });
      }
      
      return postApi.commentPost(id, formData);
    },
    onSuccess: () => {
      refetchPosts();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setCommentText("");
      setFileList([]);
      toast.success("Comment posted successfully!");
    },
    onError: () => {
      toast.error("Failed to post comment");
    },
  });

  // Handlers

  const handleCreateCmt = (
    id: string,
    content: string,
    files?: File[]
  ): void => {
    createCommentMutation.mutate({
      id,
      data: { content, files },
    });
  };

  const handleLikePost = (postId: string): void => {
    likePostMutation.mutate(postId);
    setIsLiked(!isLiked);
  };

  const handleBookmarkPost = (postId: string): void => {
    bookmarkPostMutation.mutate(postId);
    setIsBookmarked(!isBookmarked);
  };

  const handleDeletePost = (postId: string): void => {
    deletePostMutation.mutate(postId);
  };

  const handleNavigateToProfile = (userId: string) => {
    navigate(`/profile?userId=${userId}`);
  };

  const handleFileChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  return (
    <Card
      className={`post-item ${isDarkMode ? "dark" : "light"}`}
      style={{
        backgroundColor: isDarkMode ? "#242526" : "#ffffff",
        border: isDarkMode ? "1px solid #3e4042" : "1px solid #e4e6eb",
        marginBottom: "16px",
        marginLeft: "16px",
        marginRight: "16px",
        borderRadius: "8px",
      }}
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        {/* Post Header */}
        <Space
          className="post-header"
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          <Space>
            <Avatar
              src={post.user.avatarUrl}
              size={40}
              style={{ cursor: "pointer" }}
              onClick={() => handleNavigateToProfile(post.userId)}
            />
            <div>
              <Typography.Text
                strong
                style={{ color: isDarkMode ? "#e4e6eb" : "inherit" }}
              >
                {post.user.userName}
              </Typography.Text>
              <div className="post-header-right">
                <Typography.Text
                  type="secondary"
                  style={{
                    color: isDarkMode ? "#b0b3b8" : "rgb(0,0,0,0.45)",
                    marginLeft: "8px",
                  }}
                >
                  {formatTimeAgo(new Date(post.createdAt))}
                </Typography.Text>
                <Tooltip title={getSentimentMessage(post.sentiment)}>
                  <div
                    className={`sentiment-indicator sentiment-${post.sentiment.toLowerCase()}`}
                    aria-label={`Sentiment: ${post.sentiment}`}
                  />
                </Tooltip>
              </div>
            </div>
          </Space>

          {/* Action buttons */}

          <Space className={`post-actions ${isDarkMode ? "dark" : ""}`}>
            {isOwner && (
              <>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => onEdit?.(post)}
                  className="edit-btn"
                />
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeletePost?.(post.id)}
                  className="delete-btn"
                />
              </>
            )}
          </Space>
        </Space>

        {/* Post Content */}
        <Typography.Paragraph
          style={{
            margin: 0,
            color: isDarkMode ? "#e4e6eb" : "inherit",
          }}
        >
          {renderContent(post.content, isDarkMode)}
        </Typography.Paragraph>

        {post.attachments &&
          post.attachments.map((attachment) => (
            <div key={attachment.id}>
              {isVideoUrl(attachment.url) ? (
                <Plyr
                  source={{
                    type: "video",
                    sources: [
                      {
                        src: attachment.url,
                        type: "video/mp4",
                      },
                    ],
                  }}
                  options={{
                    controls: [
                      "play",
                      "progress",
                      "current-time",
                      "mute",
                      "volume",
                      "fullscreen",
                    ],
                    ratio: "16:9",
                  }}
                />
              ) : (
                <Image
                  src={attachment.url}
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                />
              )}
            </div>
          ))}

        {/* Action Buttons */}
        <div
          className="post-actions"
          style={{
            borderTop: `1px solid ${isDarkMode ? "#3e4042" : "#e4e6eb"}`,
            marginTop: "8px",
            paddingTop: "8px",
          }}
        >
          <Space
            size={8}
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <Button
              type="text"
              icon={
                <LikeOutlined
                  style={{
                    color: isLiked
                      ? "#1677ff"
                      : isDarkMode
                      ? "#b0b3b8"
                      : undefined,
                    fontSize: "20px",
                    transition: "all 0.3s ease",
                  }}
                />
              }
              className={`action-button ${isDarkMode ? "dark" : ""}`}
              onClick={() => handleLikePost?.(post.id)}
              loading={isLoadingPosts}
            >
              <span style={{ color: isDarkMode ? "#b0b3b8" : "inherit" }}>
                {post._count.likes}
              </span>
            </Button>
            <Button
              type="text"
              icon={
                <CommentOutlined
                  style={{
                    color: isDarkMode ? "#b0b3b8" : undefined,
                    fontSize: "20px",
                    transition: "all 0.3s ease",
                  }}
                />
              }
              className={`action-button ${isDarkMode ? "dark" : ""}`}
              onClick={() => setCommentModalVisible(!commentModalVisible)}
            >
              <span style={{ color: isDarkMode ? "#b0b3b8" : "inherit" }}>
                {post._count.comments}
              </span>
            </Button>
            <Button
              type="text"
              icon={
                <SaveOutlined
                  style={{
                    color: isBookmarked
                      ? "#1677ff"
                      : isDarkMode
                      ? "#b0b3b8"
                      : undefined,
                    fontSize: "20px",
                    transition: "all 0.3s ease",
                  }}
                />
              }
              className={`action-button ${isDarkMode ? "dark" : ""}`}
              onClick={() => handleBookmarkPost?.(post.id)}
              loading={isLoadingPosts}
            >
              <span style={{ color: isDarkMode ? "#b0b3b8" : "inherit" }}>
                {post._count.bookmarks}
              </span>
            </Button>
          </Space>
        </div>

        {/* Comments Section */}
        {commentModalVisible && (
          <div
            style={{
              borderTop: `1px solid ${isDarkMode ? "#3e4042" : "#e4e6eb"}`,
              paddingTop: 16,
            }}
          >
            {/* Quick Comment Input */}
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space style={{ width: "100%", marginBottom: 8 }}>
                <Avatar src={userInfo.avatarUrl} alt={userInfo.userName} />
                <div style={{ position: "relative", width: "100%" }}>
                  <Input.TextArea
                    placeholder={createCommentMutation.isPending ? "Posting comment..." : "Write a comment..."}
                    autoSize={{ minRows: 1, maxRows: 2 }}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onPressEnter={(e) => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        if (commentText.trim()) {
                          const files = fileList
                            .map((file) => file.originFileObj)
                            .filter((file): file is File => file !== undefined);
                          handleCreateCmt(post.id, commentText, files);
                          setFileList([]); // Reset file list after submission
                        }
                      }
                    }}
                    style={{
                      backgroundColor: isDarkMode ? "#3a3b3c" : "#f0f2f5",
                      borderRadius: "20px",
                      padding: "8px 12px",
                      paddingRight: "40px", // Make room for the upload icon
                      border: "none",
                      color: isDarkMode ? "#e4e6eb" : "inherit",
                      width: "100%",
                    }}
                    disabled={createCommentMutation.isPending}
                  />
                  <Upload
                    fileList={fileList}
                    onChange={handleFileChange}
                    multiple
                    maxCount={5}
                    showUploadList={{
                      showPreviewIcon: true,
                      showRemoveIcon: true,
                    }}
                    beforeUpload={() => false}
                    accept="image/*,video/*"
                  >
                    <UploadOutlined
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "20px",
                        color: isDarkMode ? "#b0b3b8" : undefined,
                        cursor: "pointer",
                      }}
                    />
                  </Upload>
                </div>
              </Space>
            </Space>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 && (
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "0 16px",
                }}
                className="custom-scrollbar"
              >
                {post.comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Space>
    </Card>
  );
};

export default PostItem;
