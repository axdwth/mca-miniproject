import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Import Material-UI components
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  InputAdornment,
} from "@mui/material";

// Import an icon
import SearchIcon from '@mui/icons-material/Search';

// You can likely remove this CSS file as MUI handles the styling
// import "../../../styles/Viewapplication.css";

export default function ViewApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true); // ✨ New loading state
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const resp = await axios.get("http://localhost:5000/newapplications");
        setApplications(resp.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false); // Stop loading indicator in any case
      }
    };
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((i) => {
    const term = searchTerm.toLowerCase();
    return (
      i.stud_name?.toLowerCase().includes(term) ||
      i.stud_email?.toLowerCase().includes(term) ||
      i.stud_phone?.toString().includes(term)
    );
  });

  const renderContent = () => {
    // ✨ Show a loading spinner while fetching data
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      );
    }

    // Show a message and image if no applications are found
    if (filteredApplications.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <img
            src="/assets/no-records-found.png" // Ensure this path is correct from your public folder
            alt="No Records Found"
            style={{ width: '100%', maxWidth: '400px', marginBottom: '16px' }}
          />
          <Typography variant="h6" color="text.secondary">
            No Applications Found
          </Typography>
        </Box>
      );
    }

    // Render the table if there is data
    return (
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="student applications table">
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sl. No.</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Qualification</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>App. Fee</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Score</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Submitted At</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.map((app, index) => (
              <TableRow
                key={app.id || index}
                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{app.stud_name}</TableCell>
                <TableCell>{app.stud_qualification}</TableCell>
                <TableCell>{app.stud_email}</TableCell>
                <TableCell>{app.stud_phone}</TableCell>
                <TableCell>{app.status}</TableCell>
                <TableCell>{app.entrance_exam_score}</TableCell>
                <TableCell>{new Date(app.submitted_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/admin/newapplications/${app.token}`)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" >
          Student Applications
        </Typography>
        <TextField
          label="Search Applications"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '350px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {renderContent()}
    </Container>
  );
}