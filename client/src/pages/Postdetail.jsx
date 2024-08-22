import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { base_url } from "../constants";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message,
  Modal,
  Upload,
} from "antd";
import Meta from "antd/es/card/Meta";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { updateLoginState } from "../slices/loginSlice";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineFileUpload } from "react-icons/md";
const { confirm } = Modal;
import { ExclamationCircleFilled } from "@ant-design/icons";
import { updateCurrentTab } from "../slices/tabSlice";

const Postdetail = () => {
  const { postId } = useParams();
  const [commentModal, setCommentModal] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tabView = useSelector((state) => state.currentTab.value);

  const [postData, setPostData] = useState();

  const [updateModal, setUpdateModal] = useState(false);

  const postFetcher = async () => {
    try {
      const response = await axios.get(
        base_url + `/api/post/get-posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("zupayAuthToken")}`,
          },
        }
      );

      if (response.data.success) {
        message.success("post retrieved successfully!!");
        setPostData(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };

  const createComment = async (values) => {
    try {
      await form.validateFields();
      const data = { ...values, id: postId };
      const response = await axios.post(base_url + "/api/post/comment", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("zupayAuthToken")}`,
        },
      });

      if (response.data.success) {
        setPostData(response.data.data);
        message.success("Comment added successfully");
      } else {
        message.error(response.data.message);
      }
      form.resetFields();
      setCommentModal(false);
      console.log(response.data);
    } catch (error) {
      message.error(error?.response?.data.message);
    }
  };

  const updatePostHandler = async (values) => {
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
      const response = await axios.put(
        base_url + `/api/post/${postId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("zupayAuthToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        setPostData(response.data.data);
      }
      console.log(response);
      setUpdateModal(false);
    } catch (error) {
      message.error(error?.response?.data.message);
    }
  };

  const deletePostHandler = async () => {
    try {
      const response = await axios.delete(
        base_url + `/api/post/delete/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("zupayAuthToken")}`,
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        dispatch(updateCurrentTab("allposts"));
        navigate("/");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Something went wrong!!");
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure delete this post?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deletePostHandler();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  useEffect(() => {
    if (!localStorage.getItem("zupayAuthToken")) {
      dispatch(updateLoginState());
      message.error("Something wetn wrong !! Please relogin !!");
      navigate("/login");
    }
    postFetcher();
  }, []);
  console.log(postData);
  return (
    <>
      {!postData ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-auto md:grid-cols-2 w-full p-2">
          <div className="flex justify-center items-start h-full">
            <Card
              hoverable
              className="p-2 flex flex-col h-fit w-[24rem] md:w-auto"
              cover={
                <img
                  alt="example"
                  src={postData.imageUrl}
                  className="rounded-xl shadow-lg border h-[300px] bg-cover bg-center w-full "
                />
              }
              key={postData._id}
            >
              <Meta
                title={postData.title}
                description={postData.description}
                className="font-semibold flex flex-col gap-5"
              />
              <strong
                className={`${
                  postData.private ? "text-blue-500" : "text-red-600"
                }`}
              >
                {postData.private
                  ? "Post visibility : Private"
                  : "Post visibility : Public"}
              </strong>
              <div className="flex w-full justify-between items-center pt-3">
                <p className="font-semibold text-end p-2 border rounded-lg w-fit">
                  Author : {postData?.userId?.username}
                </p>
                {tabView === "allposts" && (
                  <div className="flex justify-around items-center gap-7">
                    <div
                      className="border rounded-lg shadow-lg p-3 flex justify-center items-center text-[1.2rem] w-fit  cursor-pointer"
                      onClick={() => setUpdateModal(true)}
                    >
                      <FaRegEdit />
                    </div>
                    <div
                      className="border rounded-lg shadow-lg p-3 flex justify-center items-center text-[1.2rem] w-fit  cursor-pointer text-red-700"
                      onClick={showDeleteConfirm}
                    >
                      <MdDeleteOutline />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="flex flex-col justify-start items-center p-3 gap-5 self-end h-full">
            <div className="flex justify-between items-center w-full p-1">
              <strong className="text-[1.4rem]">Comments</strong>
              <Button
                onClick={() => setCommentModal(true)}
                className="bg-blue-500 text-white font-semibold"
              >
                Add Comment
              </Button>
            </div>
            <div className="grid 2xl:grid-cols-2  gap-5 p-3 w-full">
              {postData?.comments?.length !== 0 ? (
                postData.comments.map((comment) => {
                  return (
                    <div
                      key={comment._id}
                      className="border rounded-lg p-2 shadow-lg flex flex-col justify-start gap-2 items-end w-full h-fit"
                    >
                      <p className="font-semibold self-start border p-2 w-full rounded-lg h-[7rem] overflow-auto break-words">
                        {comment.text}
                      </p>
                      <strong>Author : {comment.author.username}</strong>
                    </div>
                  );
                })
              ) : (
                <div>No Comments</div>
              )}
            </div>
          </div>
        </div>
      )}

      {commentModal && (
        <Modal
          title="Create Comment"
          open={commentModal}
          onCancel={() => setCommentModal(false)}
          footer={null}
        >
          <Form form={form} onFinish={createComment}>
            <Form.Item
              label="Comment"
              name="comment"
              rules={[
                {
                  required: true,
                  message: "Please enter a Comment!",
                },
              ]}
            >
              <Input.TextArea
                style={{ resize: "none" }}
                rows={4}
                placeholder="Enter your comment here"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {updateModal && (
        <Modal
          open={updateModal}
          onCancel={() => setUpdateModal(false)}
          footer={null}
        >
          <Form
            form={form}
            name="Login"
            onFinish={updatePostHandler}
            initialValues={{
              title: postData?.title,
              description: postData?.description,
              private: postData?.private,
            }}
          >
            <Form.Item>
              <h1 className="font-bold text-[1.1rem] text-center">
                Update Details for post
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

export default Postdetail;
