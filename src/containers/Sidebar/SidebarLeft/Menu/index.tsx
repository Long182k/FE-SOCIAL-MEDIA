import { Menu } from "antd";
import "./menuItems.css";
import { MenuItemsProps } from "./menuItems.interface";
import { navRoutes } from "./navRoutes";
import { useLocation } from "react-router-dom";

function MenuItems({ isDarkMode }: MenuItemsProps): JSX.Element {
  const location = useLocation();

  // Get the base path for selection
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith("/explore")) return "explore";
    if (path.startsWith("/groups")) return "groups";
    if (path.startsWith("/bookmarks")) return "bookmarks";
    if (path.startsWith("/messages")) return "messages";
    if (path.startsWith("/notifications")) return "notifications";
    if (path.startsWith("/settings")) return "settings";
    return "home";
  };

  return (
    <Menu
      className="menu-sider-left"
      mode="inline"
      selectedKeys={[getSelectedKey()]}
      style={{ borderRight: 0 }}
      theme={isDarkMode ? "dark" : "light"}
      items={navRoutes.map((item) => ({
        ...item,
        label: (
          <span className={isDarkMode ? "text-dark" : "text-light"}>
            {item.label}
          </span>
        ),
      }))}
    />
  );
}

export default MenuItems;
