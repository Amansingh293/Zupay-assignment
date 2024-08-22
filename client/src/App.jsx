import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import { useSelector } from "react-redux";
import Postdetail from "./pages/Postdetail";

function App() {
  const loginState = useSelector((state) => state.loginState.value);
  return (
    <>
      <BrowserRouter>
        <div className="flex flex-col h-full w-full">
          <Navbar />
          <div className="flex h-full w-full flex-col md:flex-row">
            {loginState && <Sidebar />}
            <main className="md:flex-1">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/postdetail/:postId" element={<Postdetail />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
