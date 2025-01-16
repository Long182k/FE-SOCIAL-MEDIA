import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Image,
  Layout,
  List,
  message,
  Modal,
  Space,
  Tabs,
  Typography,
} from "antd";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { toast } from "react-toastify";
import { formatTimeAgo } from "../../../@util/helpers";
import { bookmarkApi } from "../../../api/bookmark";
import { renderContent } from "../../../components/generalRender/renderContent";
import "./index.css";

interface BookmarksProps {
  isDarkMode: boolean;
}
function Bookmarks({ isDarkMode }: BookmarksProps): JSX.Element {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: bookmarks } = useQuery({
    queryKey: ["bookmarks"],
    select: (data) => data.data,
    queryFn: () => bookmarkApi.getBookmarks(),
  });

  // Add delete mutation
  const deleteBookmarkMutation = useMutation({
    mutationFn: bookmarkApi.deleteBookmark,
    onSuccess: () => {
      toast.success("Bookmark removed successfully");
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (error) => {
      messageApi.error("Failed to remove bookmark");
    },
  });

  // Handler for delete
  const handleDeleteBookmark = (bookmarkId: string) => {
    Modal.confirm({
      title: "Remove Bookmark",
      content: "Are you sure you want to remove this bookmark?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        deleteBookmarkMutation.mutate(bookmarkId);
      },
    });
  };

  const items = [
    {
      key: "all",
      label: undefined,
      children: (
        <List
          itemLayout="horizontal"
          dataSource={bookmarks?.data}
          renderItem={(item) => (
            <List.Item key={item.id} className="bookmark-list-item">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteBookmark(item.id)}
                loading={deleteBookmarkMutation.isPending}
                className="bookmark-delete-btn"
              />
              <List.Item.Meta
                avatar={
                  <div className="bookmark-avatar-wrapper">
                    <Avatar
                      src={item.post.user.avatarUrl}
                      size={40}
                      className="bookmark-avatar"
                    />
                  </div>
                }
                title={
                  <Space
                    direction="vertical"
                    size={2}
                    className="bookmark-user-info"
                  >
                    <Space align="center">
                      <Typography.Text strong className="bookmark-username">
                        {item.post.user.userName}
                      </Typography.Text>
                      <Typography.Text className="bookmark-timestamp">
                        · {formatTimeAgo(new Date(item.createdAt))}
                      </Typography.Text>
                    </Space>

                    <Typography.Text className="bookmark-content">
                      {renderContent(item.post.content, isDarkMode)}
                    </Typography.Text>

                    {item.post.attachments && (
                      <div className="bookmark-media-container">
                        {item.post.attachments.map((attachment) => {
                          const isVideo =
                            attachment.url.includes("/video/") ||
                            attachment.url.match(/\.(mp4|webm|ogg)$/i);

                          return isVideo ? (
                            <div
                              key={attachment.id}
                              className="bookmark-video-wrapper"
                            >
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
                            </div>
                          ) : (
                            <Image
                              key={attachment.id}
                              src={attachment.url}
                              className="bookmark-image"
                              preview={true}
                            />
                          );
                        })}
                      </div>
                    )}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      ),
    },
  ];

  return (
    <Layout
      className={`main-content-layout`}
      data-theme={isDarkMode ? "dark" : "light"}
    >
      {contextHolder}
      <Tabs items={items} className="bookmarks-tabs" />
    </Layout>
  );
}

export default Bookmarks;
