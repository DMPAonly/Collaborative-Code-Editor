import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./Components/auth/SignupPage.jsx";
import VerifyEmailPage from "./Components/auth/VerifyEmailPage.jsx";
import LoginPage from "./Components/auth/LoginPage.jsx";
import ForgotPasswordPage from "./Components/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./Components/auth/ResetPasswordPage.jsx";
import CodeEditor from "./Components/CodeEditor.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Workspace from "./Components/shared/Workspace.jsx";
import FileViewer from "./Components/shared/FileViewer.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected routes — require authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace"
        element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/file/:id"
        element={
          <ProtectedRoute>
            <FileViewer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/code-editor"
        element={
          <ProtectedRoute>
            <CodeEditor />
          </ProtectedRoute>
        }
      />

      {/* Default redirect — unauthenticated users go to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
