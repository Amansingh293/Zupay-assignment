import { Button, Form, Input, message } from "antd";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { base_url } from "../constants";

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const RegisterFuntion = async (values) => {
    try {
      await form.validateFields();
      const response = await axios.post(
        base_url + "/api/auth/register",
        values
      );

      if (response.data.success) {
        message.success("Registered successfully!!");
        navigate("/login");
      } else {
        message.error("Something went wrong !! Login again !!");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100%] w-full">
      <Form
        form={form}
        name="Register"
        onFinish={RegisterFuntion}
        className="border rounded-xl shadow-xl p-7"
      >
        <Form.Item>
          <h1 className="font-bold text-[1.1rem] text-center">
            Enter Details to register!!
          </h1>
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input />
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

export default Register;
