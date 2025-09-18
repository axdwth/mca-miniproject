import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./components/pages/Home/Homepage";
import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Student/ApplicationForm";
import AdminDashboard from "./components/pages/Admin/Admindashboard";
import ManageFaculty from "./components/pages/Admin/Managefaculty";
import ViewApplications from "./components/pages/Admin/Viewapplications";
import Updatecriteria from "./components/pages/Admin/updatecriteria";
import Applicationdetails from "./components/pages/Admin/Applicationdetails";
import NewApplications from "./components/pages/Admin/newapplications";
import Adminprofile from "./components/pages/Admin/profile";
import Newreg from "./components/pages/Register/newapp";
import Payment from "./components/pages/payment/payment";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅

export default function ARoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Redirect /Admin/* to /admin/* for case-insensitive protection q
      <Route path="/Admin/*" element={<Navigate to="/admin/" replace />} />
       🔒 Admin-only routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/managefaculty"
        element={
          <ProtectedRoute role="admin">
            <ManageFaculty />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/viewapplications"
        element={
          <ProtectedRoute role="admin">
            <ViewApplications />
          </ProtectedRoute>
        }
      />
       <Route
        path="/admin/profile"
        element={
          <ProtectedRoute role="admin">
            <Adminprofile/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/newapplications/:token"
        element={
          <ProtectedRoute role="admin">
            <NewApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/updatecriteria"
        element={
          <ProtectedRoute role="admin">
            <Updatecriteria />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/Qviewnewapplicationdetails/:token"
        element={
          <ProtectedRoute role="admin">
            <Applicationdetails />
          </ProtectedRoute>
        }
      />

      {/* 🔒 Student-only routes */}
      <Route
        path="/newregistration"
        element={
          <ProtectedRoute role="student">
            <Newreg />
          </ProtectedRoute>
        }
      />
      <Route
        path="/newreg/payfee/:studentEmail"
        element={
          <ProtectedRoute role="student">
            <Payment />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
