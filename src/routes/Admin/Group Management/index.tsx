import { Table, Space, Button, Tag, Modal, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import adminApi from "../../../api/admin.api";
import "./index.css";

interface GroupManagementProp {
  isDarkMode: boolean;
}

function GroupManagement({ isDarkMode }: GroupManagementProp) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-groups", page, pageSize],
    queryFn: () => adminApi.getGroupManagementData(page, pageSize),
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (groupId: string) => adminApi.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-groups"] });
      message.success("Group deleted successfully");
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string | null) => text || "N/A",
    },
    {
      title: "Creator",
      dataIndex: ["creator", "userName"],
      key: "creator",
    },
    {
      title: "Statistics",
      key: "statistics",
      render: (_, record: any) => (
        <Space direction="vertical" size="small">
          <span>Members: {record._count.members}</span>
          <span>Posts: {record._count.posts}</span>
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
              title: "Are you sure you want to delete this group?",
              content: "This action cannot be undone.",
              okText: "Yes",
              cancelText: "No",
              onOk: () => deleteGroupMutation.mutate(record.id),
            });
          }}
          loading={deleteGroupMutation.isPending}
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
        dataSource={data?.groups}
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

export default GroupManagement;
