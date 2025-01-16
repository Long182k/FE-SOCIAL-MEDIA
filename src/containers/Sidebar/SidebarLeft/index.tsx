import { Divider, Layout } from "antd";
import Contacts from "./Contacts";
import Logo from "./Logo";
import MenuItems from "./Menu";
import "./index.css";
import AdminMenuItems from "./Menu/AdminMenus";
import { useAppStore } from "../../../store";

const { Sider } = Layout;

interface SidebarLeftProps {
  isDarkMode: boolean;
}

function SidebarLeft({ isDarkMode }: SidebarLeftProps): JSX.Element {
  const { userInfo } = useAppStore();
  const isAdmin = userInfo?.role === "ADMIN";
  console.log("🚀  isAdmin:", isAdmin);

  return (
    <Sider
      width={250}
      style={isDarkMode ? { background: "#1f1f1f" } : { background: "#ffffff" }}
    >
      <Logo isDarkMode={isDarkMode} />

      {isAdmin ? (
        <AdminMenuItems isDarkMode={isDarkMode} />
      ) : (
        <MenuItems isDarkMode={isDarkMode} />
      )}

      <Divider />
      {!isAdmin && <Contacts isDarkMode={isDarkMode} />}
    </Sider>
  );
}

export default SidebarLeft;
