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
  const initialChatRoom: ChatRoom = {
    id: "",
    name: "",
    type: "DIRECT",
    userId: currentUserId,
    creatorId: currentUserId,
    createdAt: "",
    updatedAt: "",
    participants: [
      {
        id: "",
        userId: "",
        chatRoomId: "",
        joinedAt: "",
      },
    ],
    messages: [
      {
        id: "",
        content: "",
        type: "MESSAGE",
        senderId: "",
        receiverId: "",
        chatRoomId: "",
        createdAt: "",
        updatedAt: "",
      },
    ],
    user: null,
  };

  const { Title } = Typography;

  const {
    messages,
    isMessagesLoading,
    selectedUser,
    selectedChatRoom,
    setSelectedUser,
    setSelectedChatRoom,
    fetchContacts,
    getMessages,
    getChatRoom,
    sendMessage,
    createDirectChat,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useAppStore();

  // const [selectedChatRoom, setSelectedChatRoom] =
  //   useState<ChatRoom>(initialChatRoom);
  const [content, setContent] = useState("");
  const [contactsModalVisible, setContactsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"direct" | "channel">("direct");

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const handleSelectChatRoom = (room: ChatRoom) => {
    if (selectedChatRoom?.id !== room.id) {
      setSelectedChatRoom(room); // Only update if the room is different
    }
  };

  // useEffect(() => {
  //   if (selectedChatRoom && selectedChatRoom.id !== "") {
  //     getMessages(selectedChatRoom.id);

  //     subscribeToMessages();

  //     return () => unsubscribeFromMessages();
  //   }
  // }, [
  //   selectedChatRoom?.id,
  //   getMessages,
  //   subscribeToMessages,
  //   unsubscribeFromMessages,
  // ]);


  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
    select: (data) => data,
    refetchOnWindowFocus: false,
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      if (selectedChatRoom && selectedChatRoom.id) {
        getMessages(selectedChatRoom.id);

        subscribeToMessages();
      }
      // refetchMessages();

      setContent("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      unsubscribeFromMessages();
    },
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
    sendMessageMutation.mutate({
      chatRoomId: selectedChatRoom.id,
      senderId: currentUserId,
      receiverId: selectedUser?.id ?? "1",
      content,
    });
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
      receiverId: selectedUser.id,
    });
  };

  const showModal = (type: "direct" | "channel") => {
    setModalType(type);
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
                onClick={() => showModal("direct")}
              />
            </div>
            {isLoadingChatRooms ? (
              <div style={{ color: "#fff" }}>Loading direct messages...</div>
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
                onClick={() => showModal("channel")}
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
                      {message.senderId !== currentUserId && (
                        <Avatar
                          src={message.user.avatarUrl}
                          className="avatar"
                        />
                      )}
                      <div className="bubble">
                        <Text className="author">{message.user.userName}</Text>
                        <p className="content">{message.content}</p>
                        <Text className="timestamp">
                          {convertToHumanTime(message.createdAt)}
                        </Text>
                      </div>
                      {message.senderId === currentUserId && (
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
        title={modalType === "direct" ? "Select Contact" : "Create Channel"}
        open={contactsModalVisible}
        onCancel={() => setContactsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setContactsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleCreateDirectChat}>
            {modalType === "direct" ? "Start Conversation" : "Create Channel"}
          </Button>,
        ]}
      >
        {isLoadingContacts ? (
          <div>Loading contacts...</div>
        ) : (
          <Select
            value={selectedUser}
            onChange={setSelectedUser}
            style={{ width: "100%" }}
          >
            {contactsQuery?.map((contact: User) => (
              <Select.Option key={contact.id} value={contact.userName}>
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
