import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Createpost from "../components/Createpost";
import Allposts from "./Allposts";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const tabView = useSelector((state) => state.currentTab.value);
  const loginToken = useSelector((state) => state.loginState.value);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginToken) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      {tabView === "createpost" && <Createpost />}
      {tabView === "allposts" && <Allposts privatePosts={true} />}
      {tabView === "allpostspublic" && <Allposts privatePosts={false} />}
    </>
  );
};

export default Homepage;
