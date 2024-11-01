import { BulbOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Input, Layout, Switch, Tooltip, Typography } from "antd";
import "antd/dist/reset.css";
import { Outlet } from "react-router-dom";
import { getTextColor } from "../../@util/helpers";
import SidebarLeft from "../../containers/Sidebar/SidebarLeft";
import SiderRight from "../../containers/Sidebar/SidebarRight";
import "./index.css";

const { Header } = Layout;
const { Text } = Typography;

interface HomePageProps {
  isDarkMode: boolean;
  handleThemeChange: (
    checked: boolean | ((prevState: boolean) => boolean)
  ) => void;
}

const HomePage = ({ isDarkMode, handleThemeChange }: HomePageProps) => {
  return (
    <Layout className="homepage-layout">
      <SidebarLeft isDarkMode={isDarkMode} />

      <Layout className="main-content-layout">
        <Header
          className="responsive-header"
          style={{
            background: isDarkMode ? "#141414" : "#fff",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="Search something here..."
            prefix={<SearchOutlined style={getTextColor(isDarkMode)} />}
            style={{
              width: 300,
              marginLeft: "8px",
              color: isDarkMode ? "#fff" : "#000",
              borderRadius: "10px",
              background: isDarkMode ? "rgb(100 100 100)" : "#ffffff",
              borderColor: isDarkMode ? "#333" : "#ddd",
              alignSelf: "center",
              marginTop: "8px",
            }}
          />
          <div
            className="header-right"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Text style={getTextColor(isDarkMode)}>Lillibridge</Text>
            <Avatar icon={<UserOutlined />} />
            <Tooltip
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              <Switch
                checkedChildren={<BulbOutlined />}
                unCheckedChildren={<BulbOutlined />}
                checked={isDarkMode}
                onChange={handleThemeChange}
              />
            </Tooltip>
          </div>
        </Header>

        <Outlet />
      </Layout>

      <SiderRight isDarkMode={isDarkMode} />
    </Layout>
  );
};

export default HomePage;
