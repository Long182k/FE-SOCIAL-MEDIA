import { Divider, Layout } from "antd";
import Contacts from "./Contacts";
import Logo from "./Logo";
import MenuItems from "./Menu";
import "./index.css";

const { Sider } = Layout;

interface SidebarLeftProps {
  isDarkMode: boolean;
}

function SidebarLeft({ isDarkMode }: SidebarLeftProps): JSX.Element {
  return (
    <Sider
      width={250}
      style={isDarkMode ? { background: "#1f1f1f" } : { background: "#ffffff" }}
    >
      <Logo isDarkMode={isDarkMode} />

      <MenuItems isDarkMode={isDarkMode} />
      <Divider />

      <Contacts isDarkMode={isDarkMode} />
    </Sider>
  );
}

export default SidebarLeft;
