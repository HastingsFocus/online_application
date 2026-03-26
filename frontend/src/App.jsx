import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Apply from "./pages/Apply";
import MyApplication from "./pages/MyApplication";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ReviewApplication from "./pages/ReviewApplication";
import Success from "./pages/Success";


import AdminRoute from "./components/AdminRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Applications from "./pages/admin/Applications";
import ApplicationDetails from "./pages/admin/ApplicationsDetails";
import AcceptedStudents from "./pages/admin/AcceptedStudents";
import SetDeadline from "./pages/admin/SetDeadline";

function App() {
  return (
    <Routes>

      {/* Default Route */}
      <Route path="/" element={<Dashboard />} />

      {/* Student Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/apply" element={<Apply />} />
      <Route path="/my-application" element={<MyApplication />} />
      <Route path="/review" element={<ReviewApplication />} />
      <Route path="/success" element={<Success />} />

      {/* Admin Routes */}
      {/* Admin Routes */}
<Route path="/admin/login" element={<AdminLogin />} />

<Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

<Route
  path="/admin/applications"
  element={
    <AdminRoute>
      <Applications />
    </AdminRoute>
  }
/>

<Route
  path="/admin/applications/:id"
  element={
    <AdminRoute>
      <ApplicationDetails />
    </AdminRoute>
  }
/>

<Route
  path="/admin/accepted-students"
  element={
    <AdminRoute>
      <AcceptedStudents />
    </AdminRoute>
  }
/>
<Route
  path="/admin/set-deadline"
  element={
    <AdminRoute>
      <SetDeadline />
    </AdminRoute>
  }
/>
    </Routes>
  );
}

export default App;