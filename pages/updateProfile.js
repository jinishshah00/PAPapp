import * as React from 'react';
import axios from 'axios';
import { AppProvider } from '@toolpad/core/AppProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, TextField, Typography, Box, Container, Alert } from '@mui/material';
import styles from '../CSS/login.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Define your custom theme with primary color
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#DE5C20', // Your primary color
    },
    background: {
      default: '#FBFCFF', // Background color
    },
    text: {
      primary: '#DE5C20', // Primary color for text as well
      secondary: '#000', // Optional secondary color if needed elsewhere
    },
  },
});

export default function UpdateProfilePage() {
  const [error, setError] = useState(null); // State to handle error messages
  const [success, setSuccess] = useState(null); // State to handle success messages
  const [userData, setUserData] = useState({ name: '', password: '' }); // User data state
  const router = useRouter(); // Next.js router

  useEffect(() => {
    // Fetch user profile data on page load
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, { withCredentials: true });
        setUserData({ name: response.data.user.name, password: '' }); // Populate name, leave password blank
      } catch (error) {
        setError('Failed to load profile. Please try again.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Update user profile
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`,
        { name: userData.name, password: userData.password || undefined }, // Send only if password is not empty
        { withCredentials: true }
      );
      setSuccess('Profile updated successfully!');
      setError(null);
      setUserData({ ...userData, password: '' }); // Clear password field after successful update
    } catch (error) {
      setSuccess(null);
      if (error.response && error.response.status === 400) {
        setError('Invalid data. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <ThemeProvider theme={customTheme}>
      <AppProvider theme={customTheme}>
        <Container maxWidth='xs' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Box className={styles.signinBox}>
            <Typography component="h1" variant="h5">
              Update Profile
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, color: customTheme.palette.text.primary }}>
              Update your account details below.
            </Typography>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>} {/* Display error message if any */}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>} {/* Display success message if any */}

            <Box component="form" onSubmit={handleUpdate}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                autoComplete="name"
                autoFocus
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={userData.password}
                onChange={handleChange}
                autoComplete="new-password"
                helperText="Leave blank to keep your current password."
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: customTheme.palette.primary.main }}
              >
                Update Profile
              </Button>
            </Box>

            <Button
              onClick={() => router.push('/')}
              variant="text"
              sx={{ mt: 2, color: customTheme.palette.text.primary }}
            >
              Cancel
            </Button>
          </Box>
        </Container>
      </AppProvider>
    </ThemeProvider>
  );
}
