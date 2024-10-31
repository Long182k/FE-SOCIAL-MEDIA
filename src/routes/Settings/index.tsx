import { Layout } from "antd";

interface ExploreProps {
  isDarkMode: boolean;
}

function Settings({ isDarkMode }: ExploreProps): JSX.Element {
  return (
    <Layout
      className="main-content-layout"
      style={{ background: isDarkMode ? "black" : "" }}
    >
      <h1>Settings</h1>
    </Layout>
  );
}

export default Settings;
