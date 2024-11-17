import * as React from 'react';
import axios from 'axios';
import { AppProvider } from '@toolpad/core/AppProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, TextField, Typography, Box, Container, Alert, FormControlLabel, Checkbox } from '@mui/material';
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

export default function RegisterPage() {
  const [error, setError] = useState(null); // State to handle error messages
  const [role, setRole] = useState('adopter'); // State for role
  const [showSSNField, setShowSSNField] = useState(false); // State to control visibility of SSN field
  const router = useRouter(); // Next.js router

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setRole(selectedRole);
    setShowSSNField(selectedRole === 'shelterOwner'); // Show SSN field only for shelterOwner
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Get form data
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const ssn = showSSNField ? e.target.ssn?.value : null; // Get SSN only if applicable

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/`,
        { name, email, password, role, specialSerialNumber: ssn },
        { withCredentials: true }
      );
      console.log('User Registered:', response.data);

      // Clear any previous error
      setError(null);

      // Redirect to homepage after successful registration
      router.push('/'); // Adjust the path to your actual homepage

    } catch (error) {
      // Error handling for registration
      if (error.response && error.response.status === 400) {
        setError('User already exists or invalid data. Please try again.');
      } else if (error.response && error.response.status === 403) {
        setError('Invalid SSN for shelter owners.');
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
              Register New User
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, color: customTheme.palette.text.primary }}>
              Welcome to PAPapp, <br />
              you are doing a wonderful job!
            </Typography>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>} {/* Display error message if any */}

            <Box component="form" onSubmit={handleSignUp}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
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

              {/* Role Selection */}
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Select Role:
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={role === 'shelterOwner'}
                    onChange={handleRoleChange}
                    value="shelterOwner"
                    name="role"
                  />
                }
                label="Shelter Owner"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={role === 'adopter'}
                    onChange={handleRoleChange}
                    value="adopter"
                    name="role"
                  />
                }
                label="Adopter"
              />

              {/* SSN Field (Visible only for Shelter Owner) */}
              {showSSNField && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="ssn"
                  label="SSN Number"
                  type="text"
                  id="ssn"
                />
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: customTheme.palette.primary.main }}
              >
                Register Now
              </Button>
            </Box>
          </Box>
        </Container>
      </AppProvider>
    </ThemeProvider>
  );
}
