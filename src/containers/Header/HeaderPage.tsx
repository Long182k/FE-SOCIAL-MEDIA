import { UserOutlined } from "@ant-design/icons";
import { Avatar, Col, Input, Layout, Row } from "antd";
import assets from "../../assets";

const { Header } = Layout;

function HeaderPage() {
  return (
    <Header
      style={{
        color: "black",
        width: "100%",
        height: 80,
        position: "fixed",
        top: 0,
        backgroundColor: "white",
        paddingInline: "24px",
      }}
    >
      <Row justify="space-between" align="middle" style={{ height: "100%" }}>
        <Col style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img
            style={{ height: "120px" }}
            src={assets.images.friendziiLogo}
            alt="Friendzii Logo"
          />
          <Input.Search placeholder="Search..." style={{ width: 300 }} />
        </Col>

        <Col>
          <Avatar size={40} icon={<UserOutlined />} />
        </Col>
      </Row>
    </Header>
  );
}

export default HeaderPage;
