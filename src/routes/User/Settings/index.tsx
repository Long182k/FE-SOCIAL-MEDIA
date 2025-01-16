import { LogoutOutlined, SunOutlined, LockOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Layout,
  Space,
  Switch,
  theme,
  Typography,
  Form,
  Input,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../store";
import { changePassword } from "../../../api/auth";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import "./index.css";

const { Content } = Layout;
const { Title, Text } = Typography;

type SettingsPageProps = {
  isDarkMode: boolean;
  handleThemeChange: (
    checked: boolean | ((prevState: boolean) => boolean)
  ) => void;
};

const SettingsPage = ({ isDarkMode, handleThemeChange }: SettingsPageProps) => {
  const navigate = useNavigate();

  const { token } = theme.useToken();
  const { logout } = useAppStore();

  const [form] = Form.useForm();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      message.success("Password changed successfully");
      form.resetFields();
    },
    onError: () => {
      message.error(
        "Failed to change password. Please check your old password."
      );
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangePassword = async (values: {
    oldPassword: string;
    newPassword: string;
  }) => {
    changePasswordMutation.mutate(values);
  };

  const cardStyle = {
    marginBottom: 16,
    marginTop: 12,
    backgroundColor: isDarkMode ? "#1A1A1A" : "white",
    borderRadius: token.borderRadiusLG,
    border: isDarkMode ? "none" : "1px solid #f0f0f0",
    color: isDarkMode ? "white" : "black",
  };

  const contentStyle = {
    padding: "4px 16px",
    backgroundColor: isDarkMode ? "black" : "#f5f5f5",
    color: isDarkMode ? "white" : "black",
  };

  const passwordCardStyle = {
    ...cardStyle,
    cursor: "pointer",
    backgroundColor: isDarkMode ? "#1A1A1A" : "white",
    "&:hover": {
      backgroundColor: isDarkMode ? "#2A2A2A" : "#fafafa",
    },
  };

  const formStyle = {
    marginTop: 16,
    backgroundColor: isDarkMode ? "#1A1A1A" : "white",
    padding: 16,
    borderRadius: 8,
  };

  const inputStyle = {
    backgroundColor: isDarkMode ? "#2A2A2A" : "white",
    borderColor: isDarkMode ? "#434343" : undefined,
    color: isDarkMode ? "white" : undefined,
    "& input::placeholder": {
      color: isDarkMode ? "#666" : undefined,
    },
    "& input": {
      color: isDarkMode ? "white" : undefined,
    },
  };

  return (
    <Layout>
      <Content style={contentStyle}>
        <Card style={cardStyle}>
          <Space direction="vertical" size="small">
            <Title
              level={5}
              style={{
                margin: 0,
                color: isDarkMode ? "#ffffff" : undefined,
              }}
            >
              Appearance
            </Title>
            <Text
              type="secondary"
              style={{
                color: isDarkMode ? "rgba(255, 255, 255, 0.65)" : undefined,
              }}
            >
              Customize the appearance of the app. Automatically switch between
              day and night themes.
            </Text>
            <Switch
              checked={isDarkMode}
              onChange={handleThemeChange}
              checkedChildren={<SunOutlined />}
              unCheckedChildren={<SunOutlined />}
              style={{ marginTop: 8 }}
            />
          </Space>
        </Card>

        <Card
          style={passwordCardStyle}
          onClick={() => !showPasswordForm && setShowPasswordForm(true)}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Title
              level={5}
              style={{
                margin: 0,
                color: isDarkMode ? "#ffffff" : undefined,
              }}
            >
              Change Password
            </Title>
            <Text
              type="secondary"
              style={{
                color: isDarkMode ? "rgba(255, 255, 255, 0.65)" : undefined,
              }}
            >
              Update your password to keep your account secure.
            </Text>

            {showPasswordForm && (
              <Form
                form={form}
                onFinish={handleChangePassword}
                layout="vertical"
                style={formStyle}
                onClick={(e) => e.stopPropagation()}
              >
                <Form.Item
                  name="oldPassword"
                  label={
                    <Text style={{ color: isDarkMode ? "#ffffff" : undefined }}>
                      Current Password
                    </Text>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please input your current password!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined
                        style={{ color: isDarkMode ? "#666" : undefined }}
                      />
                    }
                    placeholder="Enter current password"
                    className={isDarkMode ? "dark-mode-input" : ""}
                  />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label={
                    <Text style={{ color: isDarkMode ? "#ffffff" : undefined }}>
                      New Password
                    </Text>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please input your new password!",
                    },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined
                        style={{ color: isDarkMode ? "#666" : undefined }}
                      />
                    }
                    placeholder="Enter new password"
                    className={isDarkMode ? "dark-mode-input" : ""}
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label={
                    <Text style={{ color: isDarkMode ? "#ffffff" : undefined }}>
                      Confirm New Password
                    </Text>
                  }
                  dependencies={["newPassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your new password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The two passwords do not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined
                        style={{ color: isDarkMode ? "#666" : undefined }}
                      />
                    }
                    placeholder="Confirm new password"
                    className={isDarkMode ? "dark-mode-input" : ""}
                  />
                </Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={changePasswordMutation.isPending}
                  >
                    Change Password
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPasswordForm(false);
                      form.resetFields();
                    }}
                    style={{
                      backgroundColor: isDarkMode ? "#2A2A2A" : undefined,
                      borderColor: isDarkMode ? "#434343" : undefined,
                      color: isDarkMode ? "white" : undefined,
                    }}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form>
            )}
          </Space>
        </Card>

        <Card style={cardStyle}>
          <Space direction="vertical" size="small">
            <Title
              level={5}
              style={{
                margin: 0,
                color: isDarkMode ? "#ffffff" : undefined,
              }}
            >
              Account
            </Title>
            <Text
              type="secondary"
              style={{
                color: isDarkMode ? "rgba(255, 255, 255, 0.65)" : undefined,
              }}
            >
              Manage your account settings and preferences.
            </Text>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ marginTop: 8 }}
            >
              Logout
            </Button>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default SettingsPage;
