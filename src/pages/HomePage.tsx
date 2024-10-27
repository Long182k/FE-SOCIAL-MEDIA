import { Layout } from "antd";
import React from "react";
import HeaderPage from "../containers/Header/HeaderPage";
import SidebarLeft from "../containers/Sidebar/SidebarLeft/SidebarLeft";

const { Content } = Layout;

const HomePage: React.FC = () => {
  return (
    <Layout>
      <HeaderPage />

      <Layout>
        <SidebarLeft />
        <Content>
          <div
            style={{
              padding: 24,
              textAlign: "center",
            }}
          >
            main content
          </div>
        </Content>
      </Layout>

      {/* <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer> */}
    </Layout>
  );
};

export default HomePage;
