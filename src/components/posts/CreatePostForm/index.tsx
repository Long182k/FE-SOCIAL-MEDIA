import {
  CameraOutlined,
  CloseCircleOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Input,
  Space,
  Upload,
  message,
  Popover,
} from "antd";
import { RcFile } from "antd/es/upload";
import { KeyboardEvent, useState } from "react";
import { CreatePostDto } from "../../../@util/types/post.type";
import "./index.css";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData, Theme } from "emoji-picker-react";

interface CreatePostFormProps {
  onSubmit: (values: CreatePostDto, files?: RcFile[]) => void;
  isDarkMode: boolean;
  userAvatar?: string;
}

const CreatePostForm = ({
  onSubmit,
  isDarkMode,
  userAvatar,
}: CreatePostFormProps) => {
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && fileList.length === 0) return;

    setUploading(true);
    try {
      await onSubmit(
        {
          content: content.trim(),
        },
        fileList
      );
      setContent("");
      setFileList([]);
    } catch (error) {
      console.log("error", error);
      message.error("Failed to create post");
    } finally {
      setUploading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      message.error("You can only upload image or video files!");
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("File must be smaller than 10MB!");
      return false;
    }

    setFileList([...fileList, file]);
    return false; // Return false to prevent auto upload
  };

  const removeFile = (file: RcFile) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    setContent((prevContent) => prevContent + emoji);
    setShowEmojiPicker(false);
  };

  const emojiPickerContent = (
    <div style={{ backgroundColor: isDarkMode ? "#242526" : "#ffffff" }}>
      <EmojiPicker
        onEmojiClick={onEmojiClick}
        theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
      />
    </div>
  );

  return (
    <Card
      className={`create-post-card ${isDarkMode ? "dark" : "light"}`}
      style={{
        borderRadius: "8px",
        // padding: "16px",
        backgroundColor: isDarkMode ? "#242526" : "#ffffff",
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Space align="start" style={{ width: "100%" }}>
          <Avatar size={40} src={userAvatar} style={{ flexShrink: 0 }} />
          <Input.TextArea
            placeholder="What's on your mind?"
            autoSize={{ minRows: 3 }}
            variant="borderless"
            style={{
              resize: "none",
              backgroundColor: "transparent",
              padding: "8px 0",
              fontSize: "16px",
              color: isDarkMode ? "#e4e6eb" : "inherit",
            }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </Space>

        {/* Preview Area */}
        {fileList.length > 0 && (
          <div className="preview-area">
            {fileList.map((file, index) => (
              <div key={index} className="preview-item">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview ${index}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                    controls
                  />
                )}
                <Button
                  type="text"
                  icon={<CloseCircleOutlined />}
                  onClick={() => removeFile(file)}
                  className="remove-button"
                />
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            borderTop: `1px solid ${isDarkMode ? "#3e4042" : "#e4e6eb"}`,
            margin: "0 -16px",
            padding: "0 16px",
          }}
        >
          <Space
            className="post-actions"
            style={{
              width: "100%",
              justifyContent: "space-between",
              paddingTop: "12px",
            }}
          >
            <Space size={12}>
              <Upload
                beforeUpload={beforeUpload}
                showUploadList={false}
                accept="image/*,video/*"
              >
                <Button
                  type="text"
                  icon={<CameraOutlined />}
                  className={isDarkMode ? "dark" : ""}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  Photo/Video
                </Button>
              </Upload>
              <Popover
                content={emojiPickerContent}
                trigger="click"
                open={showEmojiPicker}
                onOpenChange={setShowEmojiPicker}
                placement="topRight"
              >
                <Button
                  type="text"
                  icon={<SmileOutlined />}
                  className={isDarkMode ? "dark" : ""}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  Feeling
                </Button>
              </Popover>
            </Space>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={uploading}
                style={{
                  backgroundColor: isDarkMode ? "#505151" : "#1b1b1b",
                  borderRadius: "8px",
                  border: "none",
                }}
              >
                Create post
              </Button>
            </div>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default CreatePostForm;
