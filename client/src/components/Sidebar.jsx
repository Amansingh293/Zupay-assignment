import React from "react";
import { IoCreateOutline } from "react-icons/io5";
import { HiOutlineBookOpen } from "react-icons/hi";
import { RiBookLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentTab } from "../slices/tabSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useDispatch();
  const tabView = useSelector((state) => state.currentTab.value);
  const navigate = useNavigate();

  return (
    <div className="flex md:flex-col justify-center md:justify-start gap-5 items-center w-full md:w-[9%] p-5">
      <div
        className="rounded-xl shadow-xl p-3 cursor-pointer flex flex-col justify-start items-center"
        onClick={() => {
          dispatch(updateCurrentTab("createpost"));
          navigate("/");
        }}
      >
        <IoCreateOutline className="text-[1.6rem] cursor-pointer" />
        <p className="text-[12px] text-center">Create Post</p>
      </div>
      <div
        className="rounded-xl shadow-xl p-3 cursor-pointer flex flex-col justify-start items-center"
        onClick={() => {
          dispatch(updateCurrentTab("allposts"));
          navigate("/");
        }}
      >
        <RiBookLine className="text-[1.6rem]" />
        <p className="text-[12px]">My Posts</p>
      </div>

      <div
        className="rounded-xl shadow-xl p-3 cursor-pointer flex flex-col justify-start items-center"
        onClick={() => {
          dispatch(updateCurrentTab("allpostspublic"));
          navigate("/");
        }}
      >
        <HiOutlineBookOpen className="text-[1.6rem]" />
        <p className="text-[12px]">All Posts</p>
      </div>
    </div>
  );
};

export default Sidebar;
