import { useMutation } from "@tanstack/react-query";
import { Button, Col, Form, Input, Row, Space, Typography } from "antd";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SCREEN_MODE } from "../../@util/constant/constant";
import {
  ErrorResponseData,
  RegisterFormProp,
} from "../../@util/interface/auth.interface";
import { RegisterNewUserParams } from "../../@util/types/auth.type";
import { useAppStore } from "../../store";

const { Title, Text } = Typography;

const SignUpForm = ({ onSwitchMode }: RegisterFormProp) => {
  const navigate = useNavigate();
  const { signup } = useAppStore();

  const SignUpFinish = async (values: RegisterNewUserParams) => {
    const userData = {
      email: values.email,
      userName: values.userName,
      password: values.password,
    };

    createUserMutation.mutateAsync(userData);
  };

  const createUserMutation = useMutation({
    mutationFn: signup,
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
      style={{ height: "100%", color: "#424242" }} // Equivalent to colors.grey[800]
    >
      <Col style={{ width: "100%", maxWidth: "500px" }}>
        <Space direction="vertical" size={40} style={{ width: "100%" }}>
          <Space direction="vertical" size={8}>
            <Title level={3} style={{ marginBottom: 0, color: "#424242" }}>
              Create an account
            </Title>
            <Text type="secondary">Join us today and start your journey!</Text>
          </Space>

          <Form
            layout="vertical"
            onFinish={SignUpFinish}
            requiredMark={false}
            style={{ width: "100%" }}
          >
            <Form.Item
              label="Name"
              name="userName"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                style={{ backgroundColor: "#424242", borderColor: "#424242" }}
                block
                onMouseOver={(e) =>
                  ((
                    e.currentTarget as HTMLButtonElement
                  ).style.backgroundColor = "#757575")
                }
                onMouseOut={(e) =>
                  ((
                    e.currentTarget as HTMLButtonElement
                  ).style.backgroundColor = "#424242")
                }
              >
                Sign up
              </Button>
            </Form.Item>
          </Form>

          <Space size={8}>
            <Text>Already have an account?</Text>
            <Text
              strong
              onClick={() => onSwitchMode(SCREEN_MODE.SIGN_IN)}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              Sign in
            </Text>
          </Space>
        </Space>
      </Col>
    </Row>
  );
};

export default SignUpForm;
