import "./index.css";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tabs,
  Tag,
  Upload,
} from "antd";
import { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import { useState } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import {
  CreateEventCategory,
  Event,
  eventApi,
  EventCategory,
} from "../../api/event";
import { useAppStore } from "../../store";
import { toast } from "react-toastify";

interface ExploreProps {
  isDarkMode: boolean;
}

interface EventFormValues {
  name: string;
  description: string;
  eventDate: dayjs.Dayjs;
  category?: EventCategory;
  address?: string;
  eventAvatar?: UploadFile;
}

function Explore({ isDarkMode }: ExploreProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm<EventFormValues>();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  const currentTab = searchParams.get("tab") || "my-events";
  const currentCategory = searchParams.get("category") as EventCategory;
  const page = parseInt(searchParams.get("page") || "1");

  // Queries
  const myEvents = useQuery({
    queryKey: ["events", "my-events", page],
    queryFn: () => eventApi.getMyEvents(page),
    enabled: currentTab === "my-events",
  });

  const discoveryEvents = useQuery({
    queryKey: ["events", "discover", page],
    queryFn: () => eventApi.getDiscoveryEvents(page),
    enabled: currentTab === "discover",
  });

  const categoryEvents = useQuery({
    queryKey: ["events", "category", currentCategory, page],
    queryFn: () => eventApi.getEventsByCategory(currentCategory, page),
    enabled:
      !!currentCategory &&
      currentCategory !== "TRENDING" &&
      currentTab === "discover",
  });

  // Add trending events query
  const trendingEvents = useQuery({
    queryKey: ["events", "trending"],
    queryFn: () => eventApi.getTrendingEvents(),
    enabled: currentTab === "discover" && currentCategory === "TRENDING",
  });

  // Mutations
  const createEventMutation = useMutation({
    mutationFn: (data: FormData) => eventApi.createEvent(data),
    onSuccess: () => {
      message.success("Event created successfully");
      setCreateModalVisible(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const joinEventMutation = useMutation({
    mutationFn: (eventId: string) => eventApi.joinEvent(eventId),
    onSuccess: () => {
      message.success("Join request sent");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["eventRequests"] });
    },
  });

  const handleTabChange = (key: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("tab", key);
      return newParams;
    });
  };

  const handleCategoryChange = (value: string | undefined) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set("category", value);
      } else {
        newParams.delete("category");
      }
      newParams.set("tab", currentTab);
      return newParams;
    });
  };

  const handleCreateEvent = async (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("eventDate", values.eventDate.toISOString());
    if (values.category) {
      formData.append("category", values.category);
    }
    if (values.address) {
      formData.append("address", values.address);
    }

    const file = fileList[0]?.originFileObj;
    if (file) {
      formData.append("eventAvatar", file);
    }

    createEventMutation.mutate(formData);
  };

  const isFormValid = () => {
    const values = form.getFieldsValue();
    const requiredFields = ["name", "description", "eventDate"] as const;
    const hasRequiredFields = requiredFields.every(
      (field) => values[field] !== undefined && values[field] !== ""
    );

    return hasRequiredFields && !loading;
  };

  const renderEventCard = (event: Event) => {
    const isCreator = event.creator.id === userInfo?.userId;
    const hasPendingRequest = event.attendees?.some(
      (attendee) =>
        attendee.userId === userInfo?.userId &&
        attendee.role === "PENDING_ATTENDEE"
    );

    // const isCanceled = event.attendees?.some(
    //   (attendee) =>
    //     attendee.userId === userInfo?.userId &&
    //     attendee.status === "CANCEL"
    // );

    const isAttendee = event.attendees?.some(
      (attendee) =>
        attendee.userId === userInfo?.userId &&
        (attendee.role === "ADMIN" || attendee.role === "ATTENDEE") &&
        attendee.status === "ENROLL"
    );

    return (
      <Col xs={24} sm={12} lg={8} key={event.id}>
        <Card
          hoverable
          className={`event-card ${isDarkMode ? "dark" : "light"}`}
          onClick={() => {
            const params = new URLSearchParams();
            params.set("eventId", event.id);

            if (currentCategory) {
              params.set("category", currentCategory);
            }

            // Check if user is a member or admin of the event
            const isEventMember = event.attendees?.some(
              (attendee) =>
                attendee.userId === userInfo?.userId &&
                (attendee.role === "ADMIN" || attendee.role === "ATTENDEE") &&
                attendee.status === "ENROLL"
            );

            if (isEventMember) {
              navigate(`/event?${params.toString()}`);
            }

            if (!isEventMember && currentTab === "my-events") {
              toast.error(
                "You don't have permission to view this event because you're not a member or admin"
              );
            }
          }}
          cover={
            event.eventAvatar && (
              <img
                alt={event.name}
                src={event.eventAvatar}
                className="event-image"
              />
            )
          }
        >
          <Card.Meta
            title={event.name}
            description={
              <Space direction="vertical">
                <div className="event-info">
                  <Tag color="blue">{event.category}</Tag>
                  <Tag>
                    <Space>
                      <UserOutlined />
                      {event.attendeesCount}
                    </Space>
                  </Tag>
                </div>
                <Space>
                  <CalendarOutlined />
                  {dayjs(event.eventDate).format("MMM D, YYYY")}
                </Space>
                {event.address && (
                  <Space>
                    <EnvironmentOutlined />
                    {event.address}
                  </Space>
                )}
                <div className="event-creator">
                  <div className="admin-label">Admin</div>
                  <Avatar src={event.creator.avatarUrl} />
                  <span className="creator-name">{event.creator.userName}</span>
                </div>
                {!isCreator && !isAttendee && (
                  <Button
                    type="primary"
                    onClick={() => joinEventMutation.mutate(event.id)}
                    disabled={hasPendingRequest}
                    loading={joinEventMutation.isPending}
                    className={`join-button ${
                      hasPendingRequest ? "pending" : ""
                    }`}
                  >
                    {hasPendingRequest
                      ? "Waiting for admin's approval"
                      : "Join Event"}
                  </Button>
                )}
              </Space>
            }
          />
        </Card>
      </Col>
    );
  };

  const tabItems = [
    {
      key: "my-events",
      label: "My Events",
      children: (
        <Row gutter={[16, 16]}>
          {myEvents.data?.data?.events.map(renderEventCard)}
        </Row>
      ),
    },
    {
      key: "discover",
      label: "Discover",
      children: (
        <>
          <Select
            className={`category-select ${isDarkMode ? "dark" : "light"}`}
            style={{ width: 200, marginBottom: 16 }}
            placeholder="Filter by category"
            onChange={handleCategoryChange}
            value={currentCategory}
            allowClear
          >
            {Object.values(EventCategory).map((category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>

          <Row gutter={[16, 16]}>
            {(currentCategory === "TRENDING"
              ? trendingEvents.data?.data?.events
              : currentCategory
              ? categoryEvents.data?.data?.events
              : discoveryEvents.data?.data?.events
            )?.map(renderEventCard)}
          </Row>
        </>
      ),
    },
  ];

  return (
    <Layout className={`explore-layout ${isDarkMode ? "dark" : "light"}`}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
          style={{
            borderRadius: 8,
            background: "#000000",
            height: 32,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
          }}
        >
          Create Event
        </Button>
      </div>

      <Tabs
        activeKey={currentTab}
        onChange={handleTabChange}
        items={tabItems}
        className={`event-tabs ${isDarkMode ? "dark" : "light"}`}
      />

      <Modal
        title="Create Event"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        className={`event-form-modal ${isDarkMode ? "dark" : "light"}`}
      >
        <Form
          form={form}
          onFinish={handleCreateEvent}
          layout="vertical"
          onValuesChange={() => {
            // Force re-render to update submit button state
            form
              .validateFields()
              .then(() => {})
              .catch(() => {});
          }}
        >
          <Form.Item
            name="name"
            label="Event Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="eventDate"
            label="Event Date"
            rules={[{ required: true }]}
          >
            <DatePicker showTime />
          </Form.Item>

          <Form.Item name="category" label="Category">
            <Select>
              {Object.values(CreateEventCategory).map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>

          <Form.Item label="Event Image">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createEventMutation.isPending}
              disabled={!isFormValid() || createEventMutation.isPending}
              block
            >
              {createEventMutation.isPending
                ? "Creating Event..."
                : "Create Event"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default Explore;
