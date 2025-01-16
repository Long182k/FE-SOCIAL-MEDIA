import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAppStore } from "../../../../store";

export const useAdminNavRoutes = () => {
  const { userInfo } = useAppStore();

  // Get role from userInfo to check if user is admin
  const isAdmin = userInfo?.role === "ADMIN";

  const userId = userInfo?.userId || userInfo?.id;

  return [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "user-management",
      icon: <UserOutlined />,
      label: <Link to="/user-management">User Management</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ];
};
