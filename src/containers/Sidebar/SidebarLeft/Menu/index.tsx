import { Menu } from "antd";
import "./menuItems.css";
import { MenuItemsProps } from "./menuItems.interface";
import { navRoutes } from "./navRoutes";

function MenuItems({ isDarkMode }: MenuItemsProps): JSX.Element {
  return (
    <Menu
      className="menu-sider-left"
      mode="inline"
      defaultSelectedKeys={["home"]}
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
