import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Input, Layout, Typography } from "antd";
import "antd/dist/reset.css";
import { Outlet } from "react-router-dom";
import { getTextColor } from "../../@util/helpers";
import SidebarLeft from "../../containers/Sidebar/SidebarLeft";
import SiderRight from "../../containers/Sidebar/SidebarRight";
import { useAppStore } from "../../store";
import "./index.css";

const { Header } = Layout;
const { Text } = Typography;

interface HomePageProps {
  isDarkMode: boolean;
}

const HomePage = ({ isDarkMode }: HomePageProps) => {
  const { userInfo } = useAppStore();

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
            padding: "0 16px",
            position: "sticky",
            top: 0,
            zIndex: 1,
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
            <Avatar src={userInfo.avatarUrl} size={40} />
            <Text strong style={getTextColor(isDarkMode)}>
              {userInfo.userName}
            </Text>
          </div>
        </Header>

        <div
          className="scrollable-content"
          style={{ backgroundColor: isDarkMode ? "" : "rgb(245, 245, 245)" }}
        >
          <Outlet />
        </div>
      </Layout>

      <SiderRight isDarkMode={isDarkMode} />
    </Layout>
  );
};

export default HomePage;
