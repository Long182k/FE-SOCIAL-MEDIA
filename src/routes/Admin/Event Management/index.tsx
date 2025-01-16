import {
  Table,
  Space,
  Button,
  Tag,
  Modal,
  message,
  Avatar,
  List,
  Tabs,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import adminApi from "../../../api/admin.api";
import "./index.css";
import { eventApi } from "../../../api/event";
import type { EventDetail } from "../../../api/event";

interface EventManagementProp {
  isDarkMode: boolean;
}

function EventManagement({ isDarkMode }: EventManagementProp) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-events", page, pageSize],
    queryFn: () => adminApi.getEventManagementData(page, pageSize),
  });
  console.log("🚀  data:", data);

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => adminApi.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      message.success("Event deleted successfully");
    },
  });

  const eventDetailQuery = useQuery({
    queryKey: ["event-detail", selectedEvent?.id],
    queryFn: () =>
      selectedEvent?.id ? eventApi.getEventById(selectedEvent.id) : null,
    enabled: !!selectedEvent?.id,
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => (
        <Tag color="blue">{category.replace("_", " ")}</Tag>
      ),
    },
    {
      title: "Creator",
      dataIndex: ["creator", "userName"],
      key: "creator",
    },
    {
      title: "Event Details",
      key: "details",
      render: (_, record: any) => (
        <Space direction="vertical" size="small">
          <span>Date: {new Date(record.eventDate).toLocaleDateString()}</span>
          <span>Attendees: {record.attendeesCount}</span>
          <span>
            Address: {record.address ? record.address : "No location specified"}
          </span>
        </Space>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: any) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedEvent(record);
              setDetailModalVisible(true);
            }}
          >
            View Details
          </Button>
          <Button
            danger
            onClick={() => {
              Modal.confirm({
                title: "Are you sure you want to delete this event?",
                content: "This action cannot be undone.",
                okText: "Yes",
                cancelText: "No",
                onOk: () => deleteEventMutation.mutate(record.id),
              });
            }}
            loading={deleteEventMutation.isPending}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const renderDetailModal = () => (
    <Modal
      title={`Event Details: ${selectedEvent?.name}`}
      open={detailModalVisible}
      onCancel={() => setDetailModalVisible(false)}
      footer={null}
      width={800}
    >
      <Tabs
        items={[
          {
            key: "info",
            label: "Basic Info",
            children: (
              <List>
                <List.Item>
                  <strong>Description:</strong>{" "}
                  {eventDetailQuery.data?.description}
                </List.Item>
                <List.Item>
                  <strong>Category:</strong> {eventDetailQuery.data?.category}
                </List.Item>
                <List.Item>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    eventDetailQuery.data?.eventDate || ""
                  ).toLocaleDateString()}
                </List.Item>
                <List.Item>
                  <strong>Address:</strong>{" "}
                  {eventDetailQuery.data?.address || "N/A"}
                </List.Item>
                <List.Item>
                  <strong>Total Attendees:</strong>{" "}
                  {eventDetailQuery.data?.attendeesCount || 0}
                </List.Item>
              </List>
            ),
          },
          {
            key: "attendees",
            label: "Attendees",
            children: (
              <List
                dataSource={eventDetailQuery.data?.attendees || []}
                renderItem={(attendee) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={attendee.avatarUrl} />}
                      title={attendee.userName}
                      description={`Role: ${attendee.role}, Status: ${attendee.status}`}
                    />
                  </List.Item>
                )}
              />
            ),
          },
        ]}
      />
    </Modal>
  );

  return (
    <div style={{ padding: "24px" }}>
      <Table
        columns={columns}
        dataSource={data?.events}
        loading={isLoading}
        pagination={{
          total: data?.total,
          current: page,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        rowKey="id"
        scroll={{ x: 1200 }}
        className={isDarkMode ? "dark-table" : ""}
        style={{
          background: isDarkMode ? "#1f1f1f" : "#ffffff",
        }}
      />
      {renderDetailModal()}
    </div>
  );
}

export default EventManagement;
