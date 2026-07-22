import React from "react";
import Signup from "../Pages/Signup";
import Login from "../Pages/Login";
import VerifyEmail from "../Pages/VerifyEmail";
import CodeEditor from "../Components/CodeEditor";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/code-editor" element={<CodeEditor />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
