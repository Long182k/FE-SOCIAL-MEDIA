import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Input, Layout, Typography } from "antd";
import "antd/dist/reset.css";
import { Outlet } from "react-router-dom";
import { getTextColor } from "../../../@util/helpers";
import SidebarLeft from "../../../containers/Sidebar/SidebarLeft";
import SiderRight from "../../../containers/Sidebar/SidebarRight";
import { useAppStore } from "../../../store";
import { useNavigate } from "react-router-dom";

import "./index.css";

const { Header } = Layout;
const { Text } = Typography;

interface HomePageProps {
  isDarkMode: boolean;
}

const HomePage = ({ isDarkMode }: HomePageProps) => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  const handleNavigateToProfile = (userId: string) => {
    navigate(`/profile?userId=${userId}`);
  };

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
            justifyContent: "flex-end", // Add this to push content to right
          }}
        >
          <div
            className="header-right"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <Avatar
              src={userInfo.avatarUrl}
              size={40}
              alt={userInfo.userName}
              style={{ cursor: "pointer" }}
              onClick={() => handleNavigateToProfile(userInfo.id)}
            />
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
