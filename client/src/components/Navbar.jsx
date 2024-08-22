import React, { useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateLoginState } from "../slices/loginSlice";

const Navbar = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const loginState = useSelector((state) => state.loginState.value);

  return (
    <div className="h-[5rem] flex justify-between items-center w-full p-5 border-[1px] ">
      <img src="/images/icon.png" alt="image" />
      <div className="flex justify-center items-center gap-3">
        {!loginState ? (
          <>
            <Button
              className="rounded-xl shadow-lg cursor-pointer"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </Button>
            <Button
              className="bg-purple-500 text-white rounded-xl shadow-lg cursor-pointer"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </Button>{" "}
          </>
        ) : (
          <Button
            className="rounded-xl shadow-lg cursor-pointer"
            onClick={() => {
              localStorage.removeItem("zupayAuthToken");
              dispatch(updateLoginState());
              navigate("/login");
            }}
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
