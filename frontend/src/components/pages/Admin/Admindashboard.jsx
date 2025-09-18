import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // Using Axios for cleaner API calls

// MUI Components
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    CssBaseline, Typography, Grid, Paper, Avatar, CircularProgress, Alert
} from '@mui/material';

// Charting Library
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';


// --- Main AdminDashboard Component ---
export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [welcomeMessage, setWelcomeMessage] = useState("");
    const navigate = useNavigate();

    // --- API Data for Charts and Stats ---
    const [stats, setStats] = useState({ new: 0, accepted: 0, waiting: 0, rejected: 0 });
    const [applicationData, setApplicationData] = useState([]);
    // --- End API Data ---

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get("http://localhost:5000/admin/dashboard", {
                    withCredentials: true,
                });
                setWelcomeMessage(response.data.message || "Welcome, Admin!");
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError("Unauthorized. Please login again.");
                    navigate("/login");
                } else {
                    setError("A network or server error occurred.");
                    console.error("Dashboard fetch error:", err);
                }
            } finally {
                setLoading(false);
            }
        };
        checkSession();
        // Fetch dashboard stats & chart data
        const fetchStats = async () => {
            try {
                const response = await axios.get("http://localhost:5000/admin/dashboard-stats", { withCredentials: true });
                setStats(response.data.stats);
                setApplicationData(response.data.chart);
            } catch (err) {
                console.error("Dashboard stats fetch error:", err);
            }
        };
        fetchStats();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
            navigate("/login"); // Navigate to login even if API call fails
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (error) {
        return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
    }

    const sidebarWidth = 260;
    const navItems = [
        { text: 'New Applications', path: '/admin/viewapplications', icon: <ArticleIcon /> },
        { text: 'Accepted', path: '/admin/accepted', icon: <CheckCircleIcon /> },
        { text: 'Waiting List', path: '/admin/queue', icon: <HourglassEmptyIcon /> },
        { text: 'Rejected', path: '/admin/rejected', icon: <CancelIcon /> },
        {text:'settings',path:'/admin/settings',icon:<SettingsRoundedIcon/>},
        {text: 'Manage Admins', path: '/admin/profile', icon: <ManageAccountsIcon /> }
        
    ];

    return (
        <Box sx={{ display: 'flex', bgcolor: '#ffffffff', minHeight: '300vh' }}>
            <CssBaseline />

            {/* --- Sidebar --- */}
            <Drawer
                variant="permanent"
                sx={{
                    width: sidebarWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: sidebarWidth,
                        boxSizing: 'border-box',
                        bgcolor: '#474747ff',
                        color: '#fff',
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DashboardIcon />
                    <Typography variant="h6" component="h1" fontWeight="bold">Admin Dashboard</Typography>
                </Box>
                <List>
                    {navItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton component={Link} to={item.path} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' } }}>
                                <ListItemIcon sx={{ color: '#ffffffff' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ marginTop: 'auto', p: 2 }}>
                    <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' } }}>
                        <ListItemIcon sx={{ color: '#9ca3af' }}><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </Box>
            </Drawer>

            {/* --- Main Content --- */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" color="text.primary">
                    {welcomeMessage}
                </Typography>
                
                {/* Stat Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <StatCard title="New Applications" value={stats.new} color="#1976d2" />
                    <StatCard title="Accepted" value={stats.accepted} color="#2e7d32" />
                    <StatCard title="Waiting List" value={stats.waiting} color="#ed6c02" />
                    <StatCard title="Rejected" value={stats.rejected} color="#d32f2f" />
                </Grid>

                {/* Chart */}
                <Paper elevation={3} sx={{ p: 2, borderRadius: '16px' }}>
                    <Typography variant="h6" gutterBottom>Application Trends</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={applicationData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="New" fill="#8884d8" />
                            <Bar dataKey="Accepted" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </Box>
        </Box>
    );
}

// Helper component for the stat cards
const StatCard = ({ title, value, color }) => (
    <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: '16px', bgcolor: color, color: '#fff' }}>
            <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
            <Typography variant="h4" fontWeight="bold">{value}</Typography>
        </Paper>
    </Grid>
);