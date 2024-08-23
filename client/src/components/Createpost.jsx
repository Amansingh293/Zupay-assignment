import { Button, Checkbox, Form, Input, message, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentTab } from "../slices/tabSlice";
import axios from "axios";
import { base_url } from "../constants";
import { updateLoginState } from "../slices/loginSlice";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const Createpost = () => {
  const tabView = useSelector((state) => state.currentTab.value);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createPostHandler = async (values) => {
    setLoading(true);
    try {
      console.log(values);
      await form.validateFields();
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);

      formData.append("privateValue", values.private || false);
      if (values.file && values.file.length > 0) {
        formData.append("image", values.file[0].originFileObj);
      }
      const response = await axios.post(
        base_url + "/api/post/create-posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("zupayAuthToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        message.success("Post created successfully!!");
        dispatch(updateCurrentTab("allposts"));
      }
      console.log(response);
    } catch (error) {
      message.error(error?.response?.data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("zupayAuthToken")) {
      dispatch(updateLoginState());
      message.error("Something wetn wrong !! Please relogin !!");

      navigate("/login");
    }
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Modal
          open={tabView === "createpost"}
          onCancel={() => dispatch(updateCurrentTab("allposts"))}
          footer={null}
        >
          <Form form={form} name="Login" onFinish={createPostHandler}>
            <Form.Item>
              <h1 className="font-bold text-[1.1rem] text-center">
                Enter Details for post
              </h1>
            </Form.Item>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please enter Title!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="File"
              name="file"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
            >
              <Upload
                name="file"
                beforeUpload={() => false}
                accept=".jpg,.jpeg,.png,.pdf"
              >
                <Button icon={<MdOutlineFileUpload />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please enter a description!",
                },
              ]}
            >
              <Input.TextArea
                style={{ resize: "none" }}
                rows={4}
                placeholder="Enter your description here"
              />
            </Form.Item>
            <Form.Item name="private" valuePropName="checked">
              <Checkbox>Private post</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default Createpost;
