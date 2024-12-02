import styles from '../../CSS/petPage.module.css';
import { Button } from '@mui/material';
import { Launch } from '@mui/icons-material';
import { Pets } from '@mui/icons-material';
import CakeIcon from '@mui/icons-material/Cake';
import StraightenIcon from '@mui/icons-material/Straighten';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MedicationIcon from '@mui/icons-material/Medication';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function PetPage({ isLoggedIn, userRole }) {
  const router = useRouter();
  const { id } = router.query; // Extract the pet ID from the URL
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [formExists, setFormExists] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPetDetails(id); // Fetch the pet details dynamically
      fetchUserDetails(); // Fetch the logged-in user's details
    }
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pets/getPet/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pet details');
      }
      const data = await response.json();
      setPet(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
        method: 'get',
        credentials: 'include',
      });

      if (!response.ok) {
        setUser(null); // Not signed in
        return;
      }

      const data = await response.json();
      setUser(data);

      // Check if a form already exists for this pet and user
      if (id && data) {
        const formCheckResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/forms/checkForm?pet=${id}&adopter=${data.user._id}`,
          { credentials: 'include' }
        );
        const formCheckData = await formCheckResponse.json();
        setFormExists(formCheckData.exists); // Boolean indicating if the form exists
      }
    } catch (err) {
      setUser(null);
    }
  };

  const handleAdoptClick = () => {
    if (!isLoggedIn) {
      // Redirect to sign-in page if the user is not logged in
      router.push('/login');
    } else if (userRole === 'shelterOwner') {
      // Prevent shelter owners from accessing the form
      alert('Shelter owners cannot adopt pets.');
    } else if (formExists) {
      // Show an alert if the form already exists
      alert('You have already submitted an adoption request for this pet.');
    } else {
      // Redirect adopters to the form page
      router.push(`/form/${id}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className={styles.mainCon}>
        <div className={styles.petCon}>
          <img className={styles.image} src={pet.image} alt={pet.name} />
          <Button startIcon={<Launch sx={{ fontSize: '1.8rem !important' }} />} onClick={handleAdoptClick}>
            <h1>Adopt / {pet.name}</h1>
          </Button>
          <div className={styles.infoCon}>
            <Pets />
            <h3>{pet.breed}</h3>
          </div>
          <div className={styles.infoCon}>
            <CakeIcon />
            <h3>{pet.age} yrs</h3>
          </div>
          <div className={styles.infoCon}>
            <StraightenIcon />
            <h3>{pet.size}</h3>
          </div>
          <div className={styles.infoCon}>
            <LocationOnIcon />
            <h3>{pet.location}</h3>
          </div>
          <div className={styles.infoCon}>
            <MedicationIcon />
            <h3>{pet.medicalHistory || 'Medication history will be displayed here'}</h3>
          </div>
          <div className={styles.infoCon}>
            <AccountCircleIcon />
            <h3>Shelted by {pet.shelter.name || 'Shelter Owner Name'}</h3>
          </div>
          <div className={styles.infoCon}>
            <EmailIcon />
            <h3>{pet.shelter.email || 'Shelter Owner Email'}</h3>
          </div>
        </div>
      </div>
    </>
  );
}