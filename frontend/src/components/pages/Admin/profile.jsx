import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Paper, CircularProgress, Alert } from "@mui/material";

export default function AdminProfile() {
	const [admin, setAdmin] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [form, setForm] = useState({ name: "", email: "", password: "" });

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await axios.get("http://localhost:5000/admin/profile", { withCredentials: true });
				setAdmin(res.data);
				setForm({ name: res.data.name || "", email: res.data.email || "", password: "" });
			} catch (err) {
				setError("Failed to load profile",err);
			} finally {
				setLoading(false);
			}
		};
		fetchProfile();
	}, []);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		try {
			const res = await axios.post("http://localhost:5000/admin/update-profile", form, { withCredentials: true });
			setSuccess("Profile updated successfully!");
			setAdmin(res.data);
		} catch (err) {
			setError("Update failed",err);
		}
	};

	if (loading) return <CircularProgress sx={{ m: 4 }} />;
	if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;

	return (
		<Box sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
			<Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
				<Typography variant="h5" fontWeight="bold" gutterBottom>Admin Profile</Typography>
				{admin && (
					<Box sx={{ mb: 2 }}>
						{admin.last_login && (
							<Typography variant="body2" color="text.secondary">
								Last Login: {new Date(admin.last_login).toLocaleString()}
							</Typography>
						)}
					</Box>
				)}
				<form onSubmit={handleUpdate}>
					<TextField
						label="Name"
						name="name"
						value={form.name}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Email"
						name="email"
						value={form.email}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Password"
						name="password"
						type="password"
						value={form.password}
						onChange={handleChange}
						fullWidth
						margin="normal"
						helperText="new password"
					/>
					<Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Update Profile</Button>
				</form>
				{success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
				{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
			</Paper>
		</Box>
	);
}
