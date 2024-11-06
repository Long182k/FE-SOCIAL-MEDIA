import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const Breadcrumbs = () => (
  <Breadcrumb style={{ marginBottom: "1rem" }}>
    <Breadcrumb.Item href="/">
      <HomeOutlined />
      <span>Home</span>
    </Breadcrumb.Item>
    <Breadcrumb.Item>Marketplace</Breadcrumb.Item>
  </Breadcrumb>
);

export default Breadcrumbs;
