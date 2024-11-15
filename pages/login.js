import * as React from 'react';
import axios from 'axios';
import { AppProvider } from '@toolpad/core/AppProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, TextField, Typography, Box, Container, Alert } from '@mui/material';
import styles from '../CSS/login.module.css';
import { useState } from 'react';
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

export default function CustomSignInPage() {
  const [error, setError] = useState(null); // State to handle error messages
  const router = useRouter(); // Next.js router

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    // Get form data
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post('http://localhost:8529/api/users/auth', { email, password }, { withCredentials: true });
      console.log('User authenticated:', response.data);

      // Clear any previous error
      setError(null);

      // Redirect to homepage after successful login
      router.push('/'); // Adjust the path to your actual homepage

    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('User not found. Please check your email or register.');
      } else if (error.response && error.response.status === 401) {
        setError('Invalid password. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <AppProvider theme={customTheme}>
        <Container maxWidth='xs' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Box className={styles.signinBox}>
            <Typography component="h1" variant="h5">
              SIGN IN
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, color: customTheme.palette.text.primary }}>
              Welcome to PAPapp, <br />
              you are doing a wonderful job!
            </Typography>
            
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>} {/* Display error message if any */}
            
            <Box component="form" onSubmit={handleSignIn}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: customTheme.palette.primary.main }}
              >
                Sign In
              </Button>
              <Button href="/register">
                Not a User? Register Now!
              </Button>
            </Box>
          </Box>
        </Container>
      </AppProvider>
    </ThemeProvider>
  );
}
