import { Layout } from "antd";

interface ExploreProps {
  isDarkMode: boolean;
}

function Marketplace({ isDarkMode }: ExploreProps): JSX.Element {
  return (
    <Layout
      className="main-content-layout"
      style={{ background: isDarkMode ? "black" : "" }}
    >
      <h1>Marketplace</h1>
    </Layout>
  );
}

export default Marketplace;
