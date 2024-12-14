import { Comment } from "@ant-design/compatible";
import { Avatar, Typography } from "antd";
import { formatDistance } from "date-fns";
import { User } from "../../../@util/types/auth.type";

export interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
    postId: string;
    user: User;
  };
  isDarkMode: boolean;
}

const CommentItem = ({ comment, isDarkMode }: CommentItemProps) => {

  return (
    <Comment
      author={
        <Typography.Text style={{ color: isDarkMode ? "#e4e6eb" : "inherit" }}>
          {comment.user.userName}
        </Typography.Text>
      }
      avatar={<Avatar src={comment.user.avatarUrl} alt={comment.user.userName} />}
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
        <Typography.Text
          type="secondary"
          style={{ color: isDarkMode ? "#b0b3b8" : "inherit" }}
        >
          {formatDistance(new Date(comment.createdAt), new Date(), {
            addSuffix: true,
          })}
        </Typography.Text>
      }
    />
  );
};

export default CommentItem;
