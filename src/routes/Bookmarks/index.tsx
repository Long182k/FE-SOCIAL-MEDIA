import { Layout } from "antd";

interface ExploreProps {
  isDarkMode: boolean;
}

function Bookmarks({ isDarkMode }: ExploreProps): JSX.Element {
  return (
    <Layout
      className="main-content-layout"
      style={{ background: isDarkMode ? "black" : "" }}
    >
      <h1>Bookmarks</h1>
    </Layout>
  );
}

export default Bookmarks;
