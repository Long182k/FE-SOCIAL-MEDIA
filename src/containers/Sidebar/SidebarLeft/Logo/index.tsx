import { Typography } from "antd";
import { LogoProps } from "./logo.interface";

const { Title } = Typography;

function Logo({ isDarkMode }: LogoProps): JSX.Element {
  return (
    <div className="logo">
      <Title
        level={1}
        style={{
          margin: "16px",
          color: isDarkMode ? "#ffffff" : "#ff6b6b",
          fontFamily: "'Great Vibes', cursive",
        }}
      >
        Friendzii
      </Title>
    </div>
  );
}

export default Logo;
