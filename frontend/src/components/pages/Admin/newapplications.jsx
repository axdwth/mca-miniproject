import { useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ViewApplications from './Viewapplications'; 
export default function Newapplicationdetailsapplicationdetails() {
  const { token } = useParams(); // get email from URL  
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const resp = await axios.get(`http://localhost:5000/newapplicationdetails/${token}`);
        setApplication(resp.data);
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };
    fetchApplication();
  }, [token]);

  if (!application) {
    return <p>Loading...</p>;
  }

  return (
    
    <div className="application-details">
      
  <h2>Student Application Details</h2>
   
  {/* Personal Info */}
  <section>

    <div>
      <b>Photo:</b>
      <br />
{application.stud_photo && (
  <img
    src={`http://localhost:5000${application.stud_photo}`}
    alt="Student"
    style={{ width: "150px", height: "150px", objectFit: "cover" }}
  />
)}

    </div>

    <h3>Personal Information</h3>

    <p><b>Name:</b> {application.stud_name}</p>
    <p><b>Email:</b> {application.stud_email}</p>
    <p><b>Date of Birth:</b> {application.stud_dob}</p>
    <p><b>Phone:</b> {application.stud_phone}</p>
    <p><b>Address:</b> {application.stud_address}</p>
    <p><b>Gender:</b> {application.stud_gender}</p>
    <p><b>Religion:</b> {application.stud_religion}</p>
    <p><b>Nationality:</b> {application.stud_nationality}</p>
    <p><b>Category:</b> {application.stud_category}</p>
  </section>

  {/* Academics */}
  <section>
    <h3>Academic Information</h3>

    <p><b>10th Year:</b> {application.sslc_year}</p>
    <p><b>10th Marks:</b> {application.sslc_marks}</p>


    <p><b>12th Year:</b> {application.plustwo_year}</p>
    <p><b>12th Marks:</b> {application.plustwo_marks}</p>


    <p><b>UG Year:</b> {application.ug_year}</p>
    <p><b>UG Marks:</b> {application.ug_marks}</p>

    <p><b>Qualification:</b> {application.stud_qualification}</p>
   

    <p><b>Entrance Exam Score:</b> {application.entrance_exam_score}</p>
    <p><b>Entrance Exam Rank:</b> {application.entrance_exam_rank}</p>
  </section>

  {/* Parents */}
  <section>
    <h3>Parent Information</h3>
    <p><b>Father Name:</b> {application.father_name}</p>

    <p><b>Father Phone:</b> {application.father_phone}</p>

    <p><b>Mother Name:</b> {application.mother_name}</p>
    <p><b>Mother Phone:</b> {application.mother_phone}</p>
  </section>

  {/* File uploads */}
  <section>

</section>
  <p><b>Submitted At:</b> {new Date(application.submitted_at).toLocaleString()}</p>
    <button>Accept</button>
  </div>
  );
}
