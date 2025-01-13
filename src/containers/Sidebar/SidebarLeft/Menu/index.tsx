import { Menu } from "antd";
import "./menuItems.css";
import { MenuItemsProps } from "./menuItems.interface";
import { navRoutes } from "./navRoutes";
import { useLocation } from "react-router-dom";

function MenuItems({ isDarkMode }: MenuItemsProps): JSX.Element {
  const location = useLocation();
  // Get the current path without the leading slash
  const currentPath = location.pathname.substring(1) || "home";

  return (
    <Menu
      className="menu-sider-left"
      mode="inline"
      selectedKeys={[currentPath]}
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
