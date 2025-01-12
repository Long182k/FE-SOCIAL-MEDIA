import {
  HomeOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
  BookOutlined,
  MessageOutlined,
  BellOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

export const navRoutes = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: <Link to="/">Home</Link>,
  },
  {
    key: "explore",
    icon: <SearchOutlined />,
    label: <Link to="/explore">Explore</Link>,
  },
  {
    key: "groups",
    icon: <UsergroupAddOutlined />,
    label: <Link to="/groups">Groups</Link>,
  },
  {
    key: "bookmarks",
    icon: <BookOutlined />,
    label: <Link to="/bookmarks">Bookmarks</Link>,
  },
  {
    key: "messages",
    icon: <MessageOutlined />,
    label: <Link to="/messages">Messages</Link>,
  },
  {
    key: "notifications",
    icon: <BellOutlined />,
    label: <Link to="/notifications">Notifications</Link>,
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: <Link to="/settings">Settings</Link>,
  },
];
