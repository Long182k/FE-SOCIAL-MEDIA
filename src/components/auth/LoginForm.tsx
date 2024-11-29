import { useMutation } from "@tanstack/react-query";
import { Button, Col, Form, Input, Row, Space, Typography } from "antd";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SCREEN_MODE } from "../../@util/constant/constant";
import {
  ErrorResponseData,
  LoginFormProp,
} from "../../@util/interface/auth.interface";
import { LoginParams } from "../../@util/types/auth.type";
import { useAppStore } from "../../store";

const { Title, Text } = Typography;

const LoginForm = ({ onSwitchMode }: LoginFormProp) => {
  const navigate = useNavigate();
  const { login } = useAppStore();

  const LoginFinish = async (values: LoginParams) => {
    const userData = {
      username: values.username,
      password: values.password,
    };

    loginMutation.mutateAsync(userData);
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      localStorage.setItem("access_token", res.accessToken);

      toast.success(
        "Login successfully"
        // intl.formatMessage({
        //   id: res?.data?.message,
        // })
      );

      navigate("/");
    },
    onError: (error: AxiosError<ErrorResponseData>) => {
      if (error.response?.status === 401) {
        const message = error.response?.data?.message;
        toast.error(message);
      } else {
        toast.error("Try Again");
      }
    },
  });

  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: "100%", color: "#424242" }}
    >
      <Col style={{ width: "100%", maxWidth: "500px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space direction="vertical" size={8}>
            <Title level={3} style={{ marginBottom: 0, color: "#424242" }}>
              Welcome back
            </Title>
            <Text type="secondary">Log in to stay connected !!!</Text>
          </Space>

          <Form layout="vertical" onFinish={LoginFinish} requiredMark={false}>
            <Form.Item
              label="User Name"
              name="username"
              rules={[
                { required: true, message: "Please enter your User Name!" },
              ]}
            >
              <Input placeholder="Enter your user name" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                size="large"
                block
                style={{ backgroundColor: "#424242", borderColor: "#424242" }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#757575";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#424242";
                }}
                htmlType="submit"
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>

          <Space size={8}>
            <Text>Don't have an account?</Text>
            <Text
              strong
              onClick={() => onSwitchMode(SCREEN_MODE.SIGN_UP)}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              Sign up now
            </Text>
          </Space>
        </Space>
      </Col>
    </Row>
  );
};

export default LoginForm;
