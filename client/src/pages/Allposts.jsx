import axios from "axios";
import React, { useEffect, useState } from "react";
import { base_url } from "../constants";
import { Card, message } from "antd";
import Meta from "antd/es/card/Meta";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { updateLoginState } from "../slices/loginSlice";
import useDebounce from "../hooks/useDebounce";
import { IoSearch } from "react-icons/io5";

const Allposts = ({ privatePosts }) => {
  const [postData, setPostData] = useState();
  const [searchPostData, setSearchPostData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const tabView = useSelector((state) => state.currentTab.value);

  const searchHandler = async () => {
    try {
      const response = await axios.get(
        base_url +
          `/api/post/search-post?searchValue=${searchText}&user=${
            tabView === "allposts" ? 1 : 0
          }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("zupayAuthToken")}`,
          },
        }
      );
      if (response.data.success) {
        setSearchPostData(response.data.data);
        message.success(response.data.message);
      } else {
        setSearchPostData([]);
        message.error(response.data.message);
      }
      console.log(response.data);
    } catch (error) {
      setSearchPostData([]);
      message.error("Search Not Found");
    }
  };

  const debounceFunction = useDebounce(searchHandler, 1000);

  const allPosts = async () => {
    try {
      const response = await axios.get(base_url + "/api/post/get-all-posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("zupayAuthToken")}`,
        },
      });
      console.log(response.data.data);
      if (response.data.success) {
        setPostData(response.data.data);
        message.success("Posts retrieved successfully");
      } else {
        message.error("Something went wrong!!");
      }
    } catch (error) {
      message.error(error?.response?.data.message);
    }
  };

  const allPostsPublic = async () => {
    try {
      const response = await axios.get(
        base_url + "/api/post/get-all-public-posts",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("zupayAuthToken")}`,
          },
        }
      );
      console.log(response.data.data);
      if (response.data.success) {
        setPostData(response.data.data);
        message.success("Posts retrieved successfully");
      } else {
        message.error("Something went wrong!!");
      }
    } catch (error) {
      message.error(error?.response?.data.message);
    }
  };

  const excerpt = (description, length = 400) => {
    return description?.length > length
      ? description.slice(0, length) + "..."
      : description;
  };

  useEffect(() => {
    if (!localStorage.getItem("zupayAuthToken")) {
      dispatch(updateLoginState());
      message.error("Something went wrong !! Please relogin !!");
      navigate("/login");
    }

    if (privatePosts) {
      allPosts();
    } else {
      allPostsPublic();
    }
  }, []);

  useEffect(() => {
    if (searchText === "") {
      setSearchPostData([]);
      if (tabView === "allposts") {
        allPosts();
      } else {
        allPostsPublic();
      }
    } else {
      debounceFunction();
    }
  }, [searchText]);

  return (
    <>
      {!postData ? (
        <Loader />
      ) : (
        <div className="flex flex-col w-full justify-center items-start gap-5 border-l-[1px] p-5">
          <div className="w-full flex flex-col md:flex-row justify-between items-center p-3 md:p-5 relative">
            <h1 className="font-bold text-[1.4rem] md:text-[2rem]">
              {privatePosts ? "Posts posted by you :" : "All Posts : "}
            </h1>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border w-[20rem] rounded-lg shadow-lg p-2 sm:mr-5"
            />
            <IoSearch
              className="absolute z-10 right-0 md:right-2 bottom-6 md:bottom-8 text-[1.6rem] cursor-pointer"
              onClick={() => searchHandler()}
            />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {(searchPostData.length === 0 ? postData : searchPostData)?.map(
              (post) => {
                return (
                  <div
                    className="flex justify-center items-start h-full "
                    key={post._id}
                  >
                    <Card
                      hoverable
                      className="w-[21rem] sm:w-[22rem] md:w-full md:p-2 h-full"
                      cover={
                        <img
                          alt="example"
                          src={post.imageUrl}
                          className="rounded-xl shadow-lg border h-[300px] bg-cover bg-center"
                        />
                      }
                      onClick={() => navigate(`/postdetail/${post._id}`)}
                    >
                      <Meta
                        title={post.title}
                        description={
                          post.description
                            ? excerpt(post.description, 300)
                            : "No Description!!"
                        }
                        className="font-semibold"
                      />
                      <p className="font-semibold text-end p-2 border rounded-lg w-fit mt-3">
                        By {post?.userId?.username}
                      </p>
                    </Card>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Allposts;
