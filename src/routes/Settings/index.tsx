import { LogoutOutlined, SunOutlined } from "@ant-design/icons";
import { Button, Card, Layout, Space, Switch, theme, Typography } from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;

type SettingsPageProps = {
  isDarkMode: boolean;
  handleThemeChange: (
    checked: boolean | ((prevState: boolean) => boolean)
  ) => void;
};

const SettingsPage = ({ isDarkMode, handleThemeChange }: SettingsPageProps) => {
  const { token } = theme.useToken();

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logging out...");
  };

  const cardStyle = {
    marginBottom: 16,
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    border: isDarkMode ? "none" : "1px solid #f0f0f0",
  };

  const contentStyle = {
    maxWidth: 800,
    margin: "24px auto",
    padding: "0 16px",
    backgroundColor: isDarkMode ? token.colorBgLayout : "#f5f5f5",
  };

  return (
    <Layout>
      <Content style={contentStyle}>
        <Card style={cardStyle}>
          <Space direction="vertical" size="small">
            <Title level={5} style={{ margin: 0 }}>
              Appearance
            </Title>
            <Text type="secondary">
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
            <Title level={5} style={{ margin: 0 }}>
              Account
            </Title>
            <Text type="secondary">
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
