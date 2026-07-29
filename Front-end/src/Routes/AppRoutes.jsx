import React from "react";
import Signup from "../Pages/Signup";
import Login from "../Pages/Login";
import VerifyEmail from "../Pages/VerifyEmail";
import CodeEditor from "../Components/CodeEditor";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgotPassword from "../Pages/ForgotPassword";
import CheckEmail from "../Pages/CheckEmail";
import ResetPassword from "../Pages/ResetPassword";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/code-editor" element={<CodeEditor />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
