import "./index.css";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  UploadOutlined,
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
import { useLocation, useSearchParams } from "react-router-dom";
import { Event, eventApi, EventCategory } from "../../api/event";
import { useAppStore } from "../../store";

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

  const currentTab = searchParams.get("tab") || "trending";
  const currentCategory = searchParams.get("category") as EventCategory;
  const page = parseInt(searchParams.get("page") || "1");

  // Queries
  const trendingEvents = useQuery({
    queryKey: ["events", "trending"],
    queryFn: () => eventApi.getTrendingEvents(),
    enabled: currentTab === "trending",
  });

  const allEvents = useQuery({
    queryKey: ["events", "all", page],
    queryFn: () => eventApi.getAllEvents(page),
    enabled: currentTab === "discover",
  });

  const categoryEvents = useQuery({
    queryKey: ["events", "category", currentCategory, page],
    queryFn: () => eventApi.getEventsByCategory(currentCategory, page),
    enabled: !!currentCategory,
  });

  const discoveryEvents = useQuery({
    queryKey: ["events", "discover", page],
    select: (data) => data.data.events,
    queryFn: () => eventApi.getDiscoveryEvents(page),
    enabled: currentTab === "discover" && !currentCategory,
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
    },
  });

  const handleTabChange = (key: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("tab", key);
      return newParams;
    });
  };

  const handleCategoryChange = (value: EventCategory | undefined) => {
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
                  <Tag>{event.attendeesCount} members</Tag>
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
                <Button
                  type="primary"
                  onClick={() => joinEventMutation.mutate(event.id)}
                  disabled={isCreator || hasPendingRequest || isAttendee}
                  loading={joinEventMutation.isPending}
                  className={`join-button ${
                    hasPendingRequest ? "pending" : ""
                  }`}
                >
                  {isCreator
                    ? "You are the creator"
                    : isAttendee
                    ? "You are a member"
                    : hasPendingRequest
                    ? "Waiting for admin's approval"
                    : "Join Event"}
                </Button>
              </Space>
            }
          />
        </Card>
      </Col>
    );
  };

  const tabItems = [
    {
      key: "trending",
      label: "Trending",
      children: (
        <>
          <Row gutter={[16, 16]}>
            {trendingEvents.data?.data?.events.map(renderEventCard)}
          </Row>
        </>
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
            {(currentCategory
              ? categoryEvents.data?.data?.events
              : allEvents.data?.data?.events
            )?.map(renderEventCard)}
          </Row>
        </>
      ),
    },
  ];

  return (
    <Layout className={`explore-layout ${isDarkMode ? "dark" : "light"}`}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setCreateModalVisible(true)}
        className="create-event-button"
      >
        Create Event
      </Button>

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
              {Object.values(EventCategory).map((category) => (
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
