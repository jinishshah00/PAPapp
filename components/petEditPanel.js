import { useState, useEffect } from 'react';
import axios from 'axios';
import PetCard from './petCard';
import { Pagination } from '@mui/material';
import styles from '../CSS/pet.module.css';

export default function EditPetPanel() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const itemsPerPage = 10; // Define items per page

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pets/getShelterPets`, {
        withCredentials: true, // Send cookies with the request
      });
      setPets(response.data);
      setCurrentPage(1); // Reset to the first page whenever data is fetched
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('You are not authorized to view this page. Please log in as a shelter owner.');
      } else if (err.response && err.response.status === 404) {
        setError('No pets found for your shelter.');
      } else {
        setError('Failed to load pets. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update the current page
  };

  // Calculate the pets to display based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedPets = pets.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <p>Loading pets...</p>;

  return (
    <>
      {error ? (
        <p className={styles.errorMessage}>{error}</p>
      ) : (
        <>
          <div className={styles.petCardCon}>
            {displayedPets.map((pet) => (
              <PetCard
                key={pet._id}
                name={pet.name}
                breed={pet.breed}
                location={pet.location}
                image={pet.image}
              />
            ))}
          </div>
          <div className={styles.paginationCon}>
            <Pagination
              count={Math.ceil(pets.length / itemsPerPage)} // Total number of pages
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </>
      )}
    </>
  );
}
