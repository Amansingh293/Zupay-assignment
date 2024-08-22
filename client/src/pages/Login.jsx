import React from "react";
import axios from "axios";
import { base_url } from "../constants";
import { Form, Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateLoginState } from "../slices/loginSlice";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginFunction = async (values) => {
    try {
      await form.validateFields();
      const response = await axios.post(base_url + "/api/auth/login", values);

      if (response.data.success) {
        message.success("Logged In");
        localStorage.setItem("zupayAuthToken", response.data.data);
        dispatch(updateLoginState());
        navigate("/");
      } else {
        message.error("Something went wrong !! Login again !!");
      }
    } catch (error) {
      message.error("Something went wrong !! Login again !!");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100%] w-full p-6 md:p-0">
      <Form
        form={form}
        name="Login"
        onFinish={loginFunction}
        className="border rounded-xl shadow-xl p-7"
      >
        <Form.Item>
          <h1 className="font-bold text-[1.1rem] text-center">
            Enter Credential to Login
          </h1>
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
