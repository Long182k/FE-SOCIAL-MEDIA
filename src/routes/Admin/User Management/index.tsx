import { Table, Space, Button, Tag, Modal, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import adminApi from "../../../api/admin.api";

interface UserManagementProps {
  isDarkMode: boolean;
}

const UserManagement = ({ isDarkMode }: UserManagementProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();

  // const { data, isLoading } = useQuery({
  //   queryKey: ["admin-users", page, pageSize],
  //   queryFn: () => adminApi.getUserManagementData(page, pageSize),
  // });

  // const updateStatusMutation = useMutation({
  //   mutationFn: (variables: { userId: string; status: string }) =>
  //     adminApi.updateUserStatus(variables.userId, variables.status),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["admin-users"]);
  //     message.success("User status updated successfully");
  //   },
  // });

  // const deleteMutation = useMutation({
  //   mutationFn: (userId: string) => adminApi.deleteUser(userId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["admin-users"]);
  //     message.success("User deleted successfully");
  //   },
  // });

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "ADMIN" ? "gold" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: any) => (
        <Space>
          <Button
          // onClick={() =>
          //   updateStatusMutation.mutate({
          //     userId: record.id,
          //     status: record.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
          //   })
          // }
          >
            {record.status === "ACTIVE" ? "Block" : "Unblock"}
          </Button>
          <Button
            danger
            onClick={() => {
              Modal.confirm({
                title: "Are you sure you want to delete this user?",
                content: "This action cannot be undone.",
                // onOk: () => deleteMutation.mutate(record.id),
              });
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Table
        columns={columns}
        dataSource={[]}
        loading={false}
        pagination={{
          total: 10,
          current: page,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
};

export default UserManagement;
