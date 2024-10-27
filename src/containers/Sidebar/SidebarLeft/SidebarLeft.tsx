import { Layout, Menu } from "antd";
import { items } from "./menuItems";
import { siderLeftStyle } from "./siderLeftStyle";

const { Sider } = Layout;

function SidebarLeft() {
  return (
    <Sider style={siderLeftStyle}>
      <Menu mode="inline" defaultSelectedKeys={["1"]} items={items} />
    </Sider>
  );
}

export default SidebarLeft;
