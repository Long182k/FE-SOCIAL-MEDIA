import { Layout } from "antd";

interface ExploreProps {
  isDarkMode: boolean;
}

function Groups({ isDarkMode }: ExploreProps): JSX.Element {
  return (
    <Layout
      className="main-content-layout"
      style={{ background: isDarkMode ? "black" : "" }}
    >
      <h1>Groups</h1>
    </Layout>
  );
}

export default Groups;
