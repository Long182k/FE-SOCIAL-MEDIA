import {
  PaperClipOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Input,
  Layout,
  List,
  Modal,
  Select,
  Space,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { User } from "../../@util/types/auth.type";

import { convertToHumanTime } from "../../@util/helpers";
import { ChatRoom } from "../../@util/interface/chat.interface";
import { useAppStore } from "../../store";
import "./Chat.css"; // Custom CSS for chat bubble styles

const { Text } = Typography;

type MessageProps = {
  currentUserId: string;
};

const MessageApp = ({ currentUserId }: MessageProps) => {
  const { Title } = Typography;

  const {
    messages,
    socket,
    isMessagesLoading,
    selectedChatRoom,
    setSelectedChatRoom,
    fetchContacts,
    getMessages,
    getChatRoom,
    sendMessage,
    createDirectChat,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useAppStore();

  const [content, setContent] = useState("");
  const [contactsModalVisible, setContactsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"DIRECT" | "GROUP">("DIRECT");
  const [nameChatRoom, setNameChatRoom] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const handleSelectChatRoom = (room: ChatRoom) => {
    if (selectedChatRoom?.id !== room.id) {
      setSelectedChatRoom(room); // Only update if the room is different
      getMessages(room.id);
    }
  };

  useEffect(() => {
    if (selectedChatRoom && currentUserId) {
      const receiver = selectedChatRoom.participants.find(
        (participant) => participant.userId !== currentUserId
      );

      if (receiver) {
        setSelectedUser(receiver.userId);
      }
    }
  }, [selectedChatRoom, currentUserId]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [socket, subscribeToMessages, unsubscribeFromMessages]);

  const {
    data: chatRoomsQuery,
    isLoading: isLoadingChatRooms,
    // refetch: refetchChatRooms,
    // isRefetching: isRefetchingChatRooms,
  } = useQuery<ChatRoom[], Error>({
    queryKey: ["chatRooms", currentUserId],
    queryFn: () => getChatRoom(currentUserId),
    refetchOnWindowFocus: false,
  });

  const { data: contactsQuery, isLoading: isLoadingContacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      // if (selectedChatRoom && selectedChatRoom.id) {
      //   getMessages(selectedChatRoom.id);
      // }

      setContent("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    // onSettled: () => {
    //   unsubscribeFromMessages();
    // },
  });

  const createDirectChatMutation = useMutation({
    mutationFn: createDirectChat,
    onSuccess: (newChatRoom) => {
      handleSelectChatRoom(newChatRoom);
      setContactsModalVisible(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSendMessage = () => {
    if (!content.trim() || !selectedChatRoom) return;

    const newMsg = {
      chatRoomId: selectedChatRoom.id,
      senderId: currentUserId,
      receiverId: selectedUser,
      content,
    };
    sendMessageMutation.mutate(newMsg);
    setContent(""); // Clear the input after sending the message
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default Enter behavior (e.g., adding a new line)
      handleSendMessage(); // Trigger send message
    }
  };

  const handleCreateDirectChat = () => {
    if (!selectedUser) return;
    createDirectChatMutation.mutate({
      senderId: currentUserId,
      receiverId: selectedUser,
      type: modalType,
      name: nameChatRoom,
    });
  };

  const showModal = (type: "DIRECT" | "GROUP", name: string) => {
    setModalType(type);
    setNameChatRoom(name);
    setContactsModalVisible(true);
  };

  return (
    <Layout style={{ height: "20vh", background: "#1E1F22" }}>
      <Layout.Sider width={250} style={{ background: "#2B2D31" }}>
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title level={5} style={{ color: "#96989D", margin: 0 }}>
                DIRECT MESSAGES
              </Title>
              <Button
                type="text"
                icon={<PlusOutlined style={{ color: "#96989D" }} />}
                onClick={() => showModal("DIRECT", "hi")}
              />
            </div>
            {isLoadingChatRooms ? (
              <div style={{ color: "#fff" }}>Loading DIRECT messages...</div>
            ) : (
              <List
                dataSource={
                  (chatRoomsQuery as ChatRoom[])?.filter(
                    (room) => room.type === "DIRECT"
                  ) || []
                }
                renderItem={(room) => (
                  <List.Item
                    key={room.id}
                    onClick={() => {
                      handleSelectChatRoom(room);
                    }}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      color: "#96989D",
                      borderRadius: "4px",
                      background:
                        selectedChatRoom?.id === room.id
                          ? "#393C43"
                          : "transparent",
                    }}
                  >
                    {room.participants?.find(
                      (participant) => participant.userId !== currentUserId
                    )?.user?.userName || "Unknown User"}
                  </List.Item>
                )}
              />
            )}
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title level={5} style={{ color: "#96989D", margin: 0 }}>
                CHANNELS
              </Title>
              <Button
                type="text"
                icon={<PlusOutlined style={{ color: "#96989D" }} />}
                onClick={() => showModal("GROUP", "GROUP")}
              />
            </div>
            {isLoadingChatRooms ? (
              <div style={{ color: "#fff" }}>Loading channels...</div>
            ) : (
              <List
                dataSource={
                  (chatRoomsQuery as ChatRoom[])?.filter(
                    (room) => room.type === "GROUP"
                  ) || []
                }
                renderItem={(room) => (
                  <List.Item
                    key={room.id}
                    onClick={() => handleSelectChatRoom(room)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      color: "#96989D",
                      borderRadius: "4px",
                      background:
                        selectedChatRoom?.id === room.id
                          ? "#393C43"
                          : "transparent",
                    }}
                  >
                    # {room.name}
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>
      </Layout.Sider>
      <Layout.Content style={{ background: "#313338" }}>
        {selectedChatRoom && (
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
              {isMessagesLoading ? (
                <div style={{ color: "#fff" }}>Loading messages...</div>
              ) : (
                <div className="chat-container">
                  {messages?.map((message) => (
                    <div
                      key={message.id}
                      ref={messageEndRef}
                      className={`message ${
                        message.senderId === currentUserId ? "right" : "left"
                      }`}
                    >
                      {message.user && message.senderId !== currentUserId && (
                        <Avatar
                          src={message.user.avatarUrl}
                          className="avatar"
                        />
                      )}
                      <div className="bubble">
                        <Text className="author">{message.user?.userName}</Text>
                        <p className="content">{message.content}</p>
                        <Text className="timestamp">
                          {convertToHumanTime(message?.createdAt ?? "")}
                        </Text>
                      </div>
                      {message.user && message.senderId === currentUserId && (
                        <Avatar
                          src={message.user.avatarUrl}
                          className="avatar"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: "20px", borderTop: "1px solid #3F4147" }}>
              <Space.Compact style={{ display: "flex", alignItems: "center" }}>
                {/* Attachment Button */}
                <Button
                  type="text"
                  icon={<PaperClipOutlined style={{ color: "#B5BAC1" }} />}
                  style={{ marginRight: "8px" }}
                />

                {/* Input Field */}
                <Input
                  placeholder="Enter message"
                  style={{
                    flex: 1,
                    background: "#383A40",
                    border: "none",
                    color: "#fff",
                  }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown} // Detect Enter key press
                />

                {/* Send Button */}
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage} // Trigger send on button click
                  loading={sendMessageMutation.isPending} // Show loading state
                  style={{ marginLeft: "8px" }}
                />
              </Space.Compact>
            </div>
          </div>
        )}
      </Layout.Content>

      <Modal
        title={modalType === "DIRECT" ? "Select Contact" : "Create Channel"}
        open={contactsModalVisible}
        onCancel={() => setContactsModalVisible(false)}
        footer={[
          <Button
            key="back"
            onClick={(e) => {
              e.preventDefault();
              setContactsModalVisible(false);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={(e) => {
              e.preventDefault();
              handleCreateDirectChat();
            }}
          >
            {modalType === "DIRECT" ? "Start Conversation" : "Create Channel"}
          </Button>,
        ]}
      >
        {isLoadingContacts ? (
          <div style={{ color: "#fff" }}>Loading contacts...</div>
        ) : (
          <Select
            value={selectedUser} // Use the ID instead of the entire user object
            onChange={(value) => {
              const selected = contactsQuery?.find(
                (contact: User) => contact.id === value
              );

              if (selected) setSelectedUser(selected.id);
            }}
            style={{ width: "100%" }}
          >
            {contactsQuery?.map((contact: User) => (
              <Select.Option key={contact.id} value={contact.id}>
                {contact.userName}
              </Select.Option>
            ))}
          </Select>
        )}
      </Modal>
    </Layout>
  );
};

export default MessageApp;
