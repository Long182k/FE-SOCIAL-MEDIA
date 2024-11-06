import { Col, Row, message } from "antd";
import { useState } from "react";
import LoginForm from "../../components/auth/LoginForm";
import SignUpForm from "../../components/auth/SignUpForm";
import assets from "../../assets";
import { SCREEN_MODE } from "../../@util/constant/constant";
import { useUser } from "../../contexts/UserContext"; // Import User Context

const LoginPage = () => {
  const [left, setLeft] = useState<number | string>(0);
  const [right, setRight] = useState<number | string>("unset");
  const [width, setWidth] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState(
    assets.images.loginBackground
  );
  const [currMode, setCurrMode] = useState(SCREEN_MODE.SIGN_IN);
  const { setUserId } = useUser(); // Use user context to set the user ID after login

  const onSwitchMode = (mode: SCREEN_MODE) => {
    setWidth(100);

    const timeout1 = setTimeout(() => {
      setCurrMode(mode);
      setBackgroundImage(
        mode === SCREEN_MODE.SIGN_IN
          ? assets.images.loginBackground
          : assets.images.signupBackground
      );
    }, 1100);

    const timeout2 = setTimeout(() => {
      setLeft("unset");
      setRight(0);
      setWidth(0);
    }, 1200);

    const timeout3 = setTimeout(() => {
      setRight("unset");
      setLeft(0);
    }, 2500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  };

  // Function to handle successful login
  const handleLoginSuccess = (userId: string, accessToken: string) => {
    setUserId(userId); // Set the user ID in the context
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user_id", userId); // Store userId in localStorage
    // message.success("Login successful!");
  };

  return (
    <Row
      style={{
        height: "100vh",
        overflow: "hidden",
        margin: 0,
      }}
    >
      <Col
        xs={24}
        md={8}
        span={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          position: "relative",
          height: "100vh",
        }}
      >
        {currMode === SCREEN_MODE.SIGN_IN ? (
          <LoginForm onSwitchMode={onSwitchMode} onLoginSuccess={handleLoginSuccess} />
        ) : (
          <SignUpForm onSwitchMode={onSwitchMode} />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: left,
            right: right,
            width: `${width}%`,
            height: "100%",
            backgroundColor: "#424242",
            transition: "all 1s ease-in-out",
          }}
        />
      </Col>

      <Col
        xs={24}
        md={16}
        span={12}
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: left,
            right: right,
            width: `${width}%`,
            height: "100%",
            backgroundColor: "#ffffff",
            transition: "all 1s ease-in-out",
          }}
        />
      </Col>
    </Row>
  );
};

export default LoginPage;
