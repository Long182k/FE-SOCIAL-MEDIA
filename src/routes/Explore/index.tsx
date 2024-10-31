import { Layout } from "antd";

interface ExploreProps {
  isDarkMode: boolean;
}

function Explore({ isDarkMode }: ExploreProps): JSX.Element {
  return (
    <Layout
      className="main-content-layout"
      style={{ background: isDarkMode ? "black" : "" }}
    >
      <h1>Explore</h1>
    </Layout>
  );
}

export default Explore;
