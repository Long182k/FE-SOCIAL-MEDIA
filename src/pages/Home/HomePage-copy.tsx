import { Layout } from "antd";
import "antd/dist/reset.css";
import { useState } from "react";
import CenterContent from "../../containers/App/CenterContent";
import SidebarLeft from "../../containers/Sidebar/SidebarLeft";
import SiderRight from "../../containers/Sidebar/SidebarRight";
import "./HomePage.css";

const HomePage2 = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = (
    checked: boolean | ((prevState: boolean) => boolean)
  ) => {
    setIsDarkMode(checked);
    document.body.style.backgroundColor = checked ? "#141414" : "#ffffff";
    document.body.style.color = checked ? "#ffffff" : "#000000";
  };

  return (
    <Layout className="homepage-layout">
      {/* Left Sider */}
      <SidebarLeft isDarkMode={isDarkMode} />

      {/* Main Content Layout */}

      <CenterContent
        isDarkMode={isDarkMode}
        handleThemeChange={handleThemeChange}
      />

      {/* Right Sider */}
      <SiderRight isDarkMode={isDarkMode} />
    </Layout>
  );
};

export default HomePage2;
