import { Layout } from "antd";

interface ExploreProps {
  isDarkMode: boolean;
}

function Notifications({ isDarkMode }: ExploreProps): JSX.Element {
  return (
    <Layout
      className="main-content-layout"
      style={{ background: isDarkMode ? "black" : "" }}
    >
      <h1>Notifications</h1>
    </Layout>
  );
}

export default Notifications;