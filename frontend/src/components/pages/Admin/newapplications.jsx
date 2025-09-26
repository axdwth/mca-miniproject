import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// MUI Components
import {
    Box, Paper, Typography, Grid, Avatar, Button,
    CircularProgress, Alert, Divider, Chip
} from '@mui/material';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

export default function ApplicationDetails() {
    const { token } = useParams();
    const [application, setApplication] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const resp = await axios.get(`http://localhost:5000/viewnewapplicationdetails/${token}`);
                setApplication(resp.data);
            } catch (err) {
                console.error("Error fetching application:", err);
                setError('Failed to load application details. Please try again.');
            }
        };
        fetchApplication();
    }, [token]);
    
    // --- Action Handlers ---
const handleAccept = async () => {
    try {
        const resp = await fetch(`http://localhost:5000/applications/accept/${application.stud_email}`, { method: "PUT" });
        if (resp.ok) {
            navigate("/admin/accepted");
        } else {
            setError("Failed to accept application. Please try again.");
        }
    } catch (err) {
        setError("Failed to accept application. Please try again.",err);
    }
};

const handleReject = async () => {
  await fetch(`http://localhost:5000/applications/reject/${application.stud_email}`, { method: "PUT" });
  navigate("/admin/rejected");
};

const handleQueue = async () => {
  await fetch(`http://localhost:5000/applications/queue/${application.stud_email}`, { method: "PUT" });
  navigate("/admin/queue");
};

    if (error) {
        return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
    }

    if (!application) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, bgcolor: '#f4f6f8' }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                {/* --- Header Section --- */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                        src={`http://localhost:5000${application.stud_photo}`}
                        alt="Student Photo"
                        sx={{ width: 100, height: 100, mr: 3 }}
                    />
                    <Box>
                        <Typography variant="h4" fontWeight="bold">{application.stud_name}</Typography>
                        <Typography variant="h6" color="text.secondary">{application.stud_email}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Submitted On: {new Date(application.submitted_at).toLocaleString()}
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {/* --- Main Content Grid --- */}
                <Grid container spacing={4}>
                    {/* Left Column */}
                    <Grid item xs={12} md={6}>
                        <InfoSection title="Personal Information">
                            <InfoPair label="Date of Birth" value={application.stud_dob} />
                            <InfoPair label="Phone" value={application.stud_phone} />
                            <InfoPair label="Address" value={application.stud_address} />
                            <InfoPair label="Gender" value={application.stud_gender} />
                            <InfoPair label="Religion" value={application.stud_religion} />
                             <InfoPair label="Nationality" value={application.stud_nationality} />
                            <InfoPair label="Category" value={application.stud_category} />
                        </InfoSection>

                        <InfoSection title="Parent Information">
                            <InfoPair label="Father's Name" value={application.father_name} />
                           
                            <InfoPair label="Father's Phone" value={application.father_phone} />
                            <Divider sx={{ my: 1 }} />
                            <InfoPair label="Mother's Name" value={application.mother_name} />
                            
                            <InfoPair label="Mother's Phone" value={application.mother_phone} />
                        </InfoSection>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={6}>
                        <InfoSection title="Academic Information">
                            <InfoPair label="Qualification" value={application.stud_qualification} />
                           
                            <InfoPair label="Entrance Exam Score" value={application.entrance_exam_score} />
                            <InfoPair label="Entrance Exam Rank" value={application.entrance_exam_rank} />
                             <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle2" color="text.secondary"><b>UG:</b> {application.ug_college} ({application.ug_year}) - {application.ug_marks}</Typography>
                            <Typography variant="subtitle2" color="text.secondary"><b>12th:</b> {application.plustwo_school} ({application.plustwo_year}) - {application.plustwo_marks}</Typography>
                            <Typography variant="subtitle2" color="text.secondary"><b>10th:</b> {application.sslc_school} ({application.sslc_year}) - {application.sslc_marks}</Typography>
                        </InfoSection>

                        <InfoSection title="Uploaded Files">
                          <FileChip 
        label="ID Proof" 
        uploaded={!!application.stud_id}
    />
                        </InfoSection>
                    </Grid>
                </Grid>

                {/* --- Action Buttons --- */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={handleAccept}>
                        Accept
                    </Button>
                    <Button variant="contained" color="error" startIcon={<CancelIcon />} onClick={handleReject}>
                        Reject
                    </Button>
                    <Button variant="contained" color="warning" startIcon={<HourglassTopIcon />} onClick={handleQueue}>
                        Add to Queue
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

// --- Helper Components for cleaner layout ---
const InfoSection = ({ title, children }) => (
    <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>{title}</Typography>
        {children}
    </Box>
);

const InfoPair = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
        <Typography variant="body1" color="text.secondary">{label}:</Typography>
        <Typography variant="body1" fontWeight="500">{value}</Typography>
    </Box>
);

const FileChip = ({ label, uploaded }) => (
    <Chip
        label={label}
        color={uploaded ? "success" : "default"}
        variant="outlined"
        size="small"
        sx={{ mr: 1, mb: 1 }}
    />
);