import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Space, Table, message, Avatar, List, Tabs } from "antd";
import { useState } from "react";
import adminApi from "../../../api/admin.api";
import "./index.css";
import { groupApi } from "../../../api/group";
import type { Group } from "../../../api/group";

interface GroupManagementProp {
  isDarkMode: boolean;
}

function GroupManagement({ isDarkMode }: GroupManagementProp) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [joinRequestsVisible, setJoinRequestsVisible] = useState(false);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);

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

  const groupDetailQuery = useQuery({
    queryKey: ["group-detail", selectedGroup?.id],
    queryFn: () => selectedGroup?.id ? groupApi.getGroupById(selectedGroup.id) : null,
    enabled: !!selectedGroup?.id,
  });

  const joinRequestsQuery = useQuery({
    queryKey: ["group-join-requests", selectedGroup?.id],
    queryFn: () => selectedGroup?.id ? groupApi.getJoinRequests(selectedGroup.id) : [],
    enabled: !!selectedGroup?.id && joinRequestsVisible,
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
        <Space>
          <Button
            onClick={() => {
              setSelectedGroup(record);
              setDetailModalVisible(true);
            }}
          >
            View Details
          </Button>
          <Button
            onClick={() => {
              setSelectedGroup(record);
              setJoinRequestsVisible(true);
            }}
          >
            Join Requests
          </Button>
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
        </Space>
      ),
    },
  ];

  const renderDetailModal = () => (
    <Modal
      title={`Group Details: ${selectedGroup?.name}`}
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
                  <strong>Description:</strong> {groupDetailQuery.data?.description || "N/A"}
                </List.Item>
                <List.Item>
                  <strong>Created At:</strong>{" "}
                  {new Date(groupDetailQuery.data?.createdAt || "").toLocaleDateString()}
                </List.Item>
                <List.Item>
                  <strong>Total Members:</strong> {groupDetailQuery.data?._count?.members || 0}
                </List.Item>
              </List>
            ),
          },
          {
            key: "members",
            label: "Members",
            children: (
              <List
                dataSource={groupDetailQuery.data?.members || []}
                renderItem={(member) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={member.user.avatarUrl} />}
                      title={member.user.userName}
                      description={`Role: ${member.role}`}
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

  const renderJoinRequestsModal = () => (
    <Modal
      title="Join Requests"
      open={joinRequestsVisible}
      onCancel={() => setJoinRequestsVisible(false)}
      footer={null}
      width={600}
    >
      <List
        loading={joinRequestsQuery.isLoading}
        dataSource={joinRequestsQuery.data || []}
        renderItem={(request) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={request.user.avatarUrl} />}
              title={request.user.userName}
              description={`Requested at: ${new Date(
                request.createdAt
              ).toLocaleDateString()}`}
            />
          </List.Item>
        )}
      />
    </Modal>
  );

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
      {renderDetailModal()}
      {renderJoinRequestsModal()}
    </div>
  );
}

export default GroupManagement;
