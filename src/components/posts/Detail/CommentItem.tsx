import { Comment } from "@ant-design/compatible";
import { Avatar, Typography, Tooltip } from "antd";
import { formatDistance } from "date-fns";
import { User } from "../../../@util/types/auth.type";
import { useNavigate } from "react-router-dom";

export interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
    postId: string;
    sentiment: string;
    user: User;
  };
  isDarkMode: boolean;
}

const getSentimentMessage = (sentiment: string) => {
  switch (sentiment) {
    case "GOOD":
      return "This comment has a positive sentiment based on its content";
    case "MODERATE":
      return "This comment has a neutral sentiment based on its content";
    case "BAD":
      return "This comment has a negative sentiment based on its content";
    default:
      return "Sentiment analysis not available";
  }
};

const CommentItem = ({ comment, isDarkMode }: CommentItemProps) => {
  const navigate = useNavigate();

  const handleNavigateToProfile = (userId: string) => {
    navigate(`/profile?userId=${userId}`);
  };

  return (
    <Comment
      author={
        <Typography.Text style={{ color: isDarkMode ? "#e4e6eb" : "inherit" }}>
          {comment.user.userName}
        </Typography.Text>
      }
      avatar={
        <Avatar
          src={comment.user.avatarUrl}
          alt={comment.user.userName}
          style={{ cursor: "pointer" }}
          onClick={() => handleNavigateToProfile(comment.userId)}
        />
      }
      content={
        <Typography.Paragraph
          style={{
            color: isDarkMode ? "#e4e6eb" : "inherit",
            margin: 0,
          }}
        >
          {comment.content}
        </Typography.Paragraph>
      }
      datetime={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Typography.Text
            type="secondary"
            style={{ color: isDarkMode ? "#b0b3b8" : "inherit" }}
          >
            {formatDistance(new Date(comment.createdAt), new Date(), {
              addSuffix: true,
            })}
          </Typography.Text>
          <Tooltip title={getSentimentMessage(comment.sentiment)}>
            <div
              className={`sentiment-indicator sentiment-${comment.sentiment.toLowerCase()}`}
              aria-label={`Sentiment: ${comment.sentiment}`}
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                cursor: "help",
                backgroundColor:
                  comment.sentiment === "GOOD"
                    ? "#52c41a"
                    : comment.sentiment === "BAD"
                    ? "#ff4d4f"
                    : "#faad14",
              }}
            />
          </Tooltip>
        </div>
      }
    />
  );
};

export default CommentItem;
