import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../CSS/formPage.module.css';
import { Button, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';

export default function FormPage() {
  const router = useRouter();
  const { id } = router.query; // Pet ID passed as query parameter
  const [pet, setPet] = useState(null);
  const [formData, setFormData] = useState({
    inquiry: '',
    date: null, // Single date instead of date range
  });

  useEffect(() => {
    if (id) {
      fetchPetDetails(id); // Fetch pet details dynamically
    }
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pets/getPet/${id}`);
      setPet(response.data);
    } catch (err) {
      alert('Error fetching pet details');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const confirmSubmit = confirm('Do you really want to submit the form?');
    if (!confirmSubmit) return;

    try {
      const payload = {
        pet: id,
        inquiry: formData.inquiry,
        scheduleVisit: formData.date,
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/forms`, payload, {
        withCredentials: true, // Include cookies for authentication
      });

      alert('Form submitted successfully!');
      router.push('/adopt');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className={styles.mainCon}>
        <div className={styles.petCon}>
          {pet && <img src={pet.image} alt={pet.name} />}
          <div className={styles.infoCon}>
            <h1>Adopt Form</h1>
            {pet && <h2>{pet.name}</h2>}

            <TextField
              label="Inquiry"
              variant="outlined"
              multiline
              rows={4}
              sx={{ margin: '15px 0' }}
              value={formData.inquiry}
              onChange={(e) => handleInputChange('inquiry', e.target.value)}
            />

            <h3>Select a Date</h3>
            <DatePicker
              label="Schedule Visit"
              value={formData.date}
              onChange={(newDate) => handleInputChange('date', newDate)}
              renderInput={(params) => <TextField {...params} />}
              sx={{ width: '60%' }}
            />

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
              <Button variant="outlined" onClick={() => router.push('/adopt')}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}
