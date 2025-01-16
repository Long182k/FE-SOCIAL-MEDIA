import { LogoutOutlined, SunOutlined } from "@ant-design/icons";
import { Button, Card, Layout, Space, Switch, theme, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../store";

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

  const handleLogout = () => {
    logout();
    navigate("/login");
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
