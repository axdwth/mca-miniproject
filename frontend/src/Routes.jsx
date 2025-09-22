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
import ProtectedRoute from "./components/ProtectedRoute"; 
import Accepted from "./components/pages/Admin/accepted";
import Queue from "./components/pages/Admin/queue";
import Rejected from "./components/pages/Admin/rejected";
import Settings from "./components/pages/Admin/settings";
import UpdateCriteria from "./components/pages/Admin/updatecriteria";
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
            <UpdateCriteria/>
          </ProtectedRoute>
        }
      />
<Route
        path="/admin/accepted"
        element={
          <ProtectedRoute role="admin">
            <Accepted/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/queue"
        element={
          <ProtectedRoute role="admin">
            <Queue/>
          </ProtectedRoute>
        }
      />
   <Route
        path="/admin/settings"
        element={
          <ProtectedRoute role="admin">
            <Settings/>
          </ProtectedRoute>
        }
      />
<Route
        path="/admin/rejected"
        element={
          <ProtectedRoute role="admin">
            <Rejected/>
          </ProtectedRoute>
        }
      />
<Route
        path="/admin/updatecriteria"
        element={
          <ProtectedRoute role="admin">
            <UpdateCriteria/>
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
