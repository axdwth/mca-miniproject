import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./components/pages/Home/Homepage";
import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Student/ApplicationForm"; // Importing Admin Register component
import AdminDashboard from "./components/pages/Admin/Admindashboard"; // Added new component
import  ManageFaculty  from './components/pages/Admin/Managefaculty'; // Added new component
import ViewApplications from './components/pages/Admin/Viewapplications';
import Updatecriteria from "./components/pages/Admin/updatecriteria"; // Added new component
import Applicationdetails from "./components/pages/Admin/Applicationdetails"; 
import Newreg from "./components/pages/Register/newapp";
import Payment from "./components/pages/payment/payment";
// Added new component
export default function ARoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
              {/*admin*/}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/admin/managefaculty" element={<ManageFaculty />} /> 
        <Route path="/admin/viewapplications" element={<ViewApplications/>} /> 
         <Route path="/admin/updatecriteria" element={< Updatecriteria/>} />
          <Route path="/admin/applicationdetails/:token" element={< Applicationdetails/>} /> 
          <Route path="/newregistration" element={< Newreg/>} />
          <Route path="/newreg/payfee/:studentId" element={< Payment/>} />
      {/* routes */}
    </Routes>
  );
}
