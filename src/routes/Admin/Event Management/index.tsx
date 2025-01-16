import { Table, Space, Button, Tag, Modal, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import adminApi from "../../../api/admin.api";
import "./index.css";

interface EventManagementProp {
  isDarkMode: boolean;
}

function EventManagement({ isDarkMode }: EventManagementProp) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-events", page, pageSize],
    queryFn: () => adminApi.getEventManagementData(page, pageSize),
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => adminApi.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      message.success("Event deleted successfully");
    },
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
          <span>Attendees: {record._count.attendees}</span>
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
      ),
    },
  ];

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
    </div>
  );
}

export default EventManagement;
