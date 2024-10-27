import {
  BookOutlined,
  HomeOutlined,
  MessageOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

export const items: MenuItem[] = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: <Link to="/">Home</Link>,
  },
  {
    key: "notification",
    icon: <NotificationOutlined />,
    label: <Link to="/notification">Notification</Link>,
  },
  {
    key: "messages",
    icon: <MessageOutlined />,
    label: <Link to="/messages">Messages</Link>,
  },
  {
    key: "bookmarks",
    icon: <BookOutlined />,
    label: <Link to="/bookmarks">Bookmarks</Link>,
  },
];
