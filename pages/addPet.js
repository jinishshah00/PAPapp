import React, { useState } from 'react';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, TextField, Typography, Box, Container, Alert } from '@mui/material';
import { Pets } from '@mui/icons-material';
import styles from '../CSS/login.module.css';
import { useRouter } from 'next/router';

// Define your custom theme with primary color
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#DE5C20',
    },
    background: {
      default: '#FBFCFF',
    },
    text: {
      primary: '#DE5C20',
      secondary: '#000',
    },
  },
});

export default function AddPet() {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    size: '',
    location: '',
    medicalHistory: '',
  });
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(''); // Store image name for acknowledgment
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageName(file?.name || ''); // Set image name or clear it
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!image) {
      setError('Please upload an image for the pet.');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('breed', formData.breed);
    data.append('age', formData.age);
    data.append('size', formData.size);
    data.append('location', formData.location);
    data.append('medicalHistory', formData.medicalHistory);
    data.append('image', image);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pets/createPet`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
      );
      setSuccess('Pet added successfully!');
      setFormData({
        name: '',
        breed: '',
        age: '',
        size: '',
        location: '',
        medicalHistory: '',
      });
      setImage(null);
      setImageName('');
      router.push('/editPets'); // Redirect on success
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Box className={styles.signinBox}>
          <Typography
            component="h1"
            variant="h5"
            sx={{ display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}
          >
            Add New Pet <Pets sx={{ margin: '10px' }} />
          </Typography>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data">
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="breed"
              label="Breed"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              autoComplete="off"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="age"
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              autoComplete="off"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="size"
              label="Size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              autoComplete="off"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="location"
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              autoComplete="off"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="medicalHistory"
              label="Medical History"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              autoComplete="off"
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2, mb: 1, color: customTheme.palette.text.primary }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {imageName && (
              <Typography
                variant="subtitle2"
                sx={{ mt: 1, mb: 2, color: customTheme.palette.text.primary }}
              >
                Uploaded: {imageName}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: customTheme.palette.primary.main }}
            >
              Add Pet
            </Button>
          </Box>
          <Button
            onClick={() => router.push('/editPets')}
            variant="text"
            sx={{ mt: 2, color: customTheme.palette.text.primary }}
          >
            Cancel
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
