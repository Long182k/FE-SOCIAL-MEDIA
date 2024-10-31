import { Layout } from "antd";
import "antd/dist/reset.css";
import { Outlet } from "react-router-dom";
import SidebarLeft from "../../containers/Sidebar/SidebarLeft";
import SiderRight from "../../containers/Sidebar/SidebarRight";
import "./index.css";

interface HomePageProps {
  isDarkMode: boolean;
}

const HomePage = ({ isDarkMode }: HomePageProps) => {
  return (
    <Layout className="homepage-layout">
      <SidebarLeft isDarkMode={isDarkMode} />

      <Outlet />

      <SiderRight isDarkMode={isDarkMode} />
    </Layout>
  );
};

export default HomePage;
