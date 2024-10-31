import { Layout } from "antd";

interface ExploreProps {
  isDarkMode: boolean;
}

function Messages({ isDarkMode }: ExploreProps): JSX.Element {
  return (
    <Layout
      className="main-content-layout"
      style={{ background: isDarkMode ? "black" : "" }}
    >
      <h1>Messages</h1>
    </Layout>
  );
}

export default Messages;
