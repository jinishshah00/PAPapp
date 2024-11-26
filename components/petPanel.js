import { useState, useEffect } from 'react';
import { Edit } from '@mui/icons-material';
import axios from 'axios';
import { Button, Checkbox, FormControlLabel, TextField, Autocomplete, Pagination } from '@mui/material';
import PetCard from './petCard';
import styles from '../CSS/pet.module.css';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function PetPanel({ isLoggedIn, userRole }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    breeds: [],
    ages: [],
    locations: [],
  });
  const [filters, setFilters] = useState({
    breed: '',
    age: '',
    size: [],
    location: '',
  });

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const itemsPerPage = 8; // Define items per page

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pets/distinct`);
        setFilterOptions(response.data);
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };

    fetchFilterOptions();
    fetchPets(); // Fetch pets without filters initially
  }, []);

  const fetchPets = async (filtersState = filters) => {
    setLoading(true);
    setError(null);

    try {
      const query = Object.keys(filtersState)
        .map((key) => {
          if (Array.isArray(filtersState[key])) {
            return filtersState[key].map((value) => `${key}=${value}`).join('&');
          }
          return filtersState[key] ? `${key}=${filtersState[key]}` : '';
        })
        .filter(Boolean)
        .join('&');

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pets/getAllPets?${query}`);
      setPets(response.data);
      setCurrentPage(1); // Reset to the first page whenever filters are applied
    } catch (err) {
      if (err.response?.status === 404) {
        setPets([]); // No pets found for the applied filters
      } else {
        setError('Failed to load pets. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSizeChange = (size) => {
    const updatedSizes = filters.size.includes(size)
      ? filters.size.filter((s) => s !== size)
      : [...filters.size, size];
    setFilters({ ...filters, size: updatedSizes });
  };

  const resetFilters = async () => {
    const resetState = { breed: '', age: '', size: [], location: '' };
    setFilters(resetState);
    await fetchPets(resetState); // Explicitly pass the reset state
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchPets();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update the current page
  };

  // Calculate the pets to display based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedPets = pets.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className={styles.filterCon}>
        {isLoggedIn && userRole === 'shelterOwner' && (
          <Button className={styles.editButtonCon} href="/editPets" variant="contained" endIcon={<Edit />}>
            Edit Pet Listings
          </Button>
        )}
        <form onSubmit={applyFilters} className={styles.filterForm}>
          <div className={styles.leftCon}>
            <Autocomplete
              options={filterOptions.breeds}
              getOptionLabel={(option) => option}
              renderInput={(params) => <TextField {...params} label="Breed" variant="outlined" />}
              value={filters.breed}
              onChange={(event, newValue) => handleFilterChange('breed', newValue)}
            />
            <Autocomplete
              options={filterOptions.ages}
              getOptionLabel={(option) => option.toString()}
              renderInput={(params) => <TextField {...params} label="Age" variant="outlined" />}
              value={filters.age}
              onChange={(event, newValue) => handleFilterChange('age', newValue)}
            />
            <Autocomplete
              options={filterOptions.locations}
              getOptionLabel={(option) => option}
              renderInput={(params) => <TextField {...params} label="Location" variant="outlined" />}
              value={filters.location}
              onChange={(event, newValue) => handleFilterChange('location', newValue)}
            />
          </div>
          <div className={styles.sizeCon}>
            <h3>Select Sizes</h3>
            {['Small', 'Medium', 'Large'].map((size) => (
              <FormControlLabel
                key={size}
                control={
                  <Checkbox
                    checked={filters.size.includes(size)}
                    onChange={() => handleSizeChange(size)}
                  />
                }
                label={size}
              />
            ))}
          </div>
          <div className={styles.buttonCon}>
            <Button endIcon={<FilterAltIcon />} type="submit" variant="contained">
              Apply Filters
            </Button>
            <Button endIcon={<RestartAltIcon />} type="button" variant="outlined" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </form>
      </div>
      {pets.length === 0 && !loading && !error ? (
        <p className={styles.noPetsMessage}>No pets found matching the criteria.</p>
      ) : (
        <div className={styles.petCardCon}>
          {displayedPets.map((pet) => (
            <PetCard key={pet._id} id={pet._id} name={pet.name} breed={pet.breed} location={pet.location} image={pet.image} />
          ))}
        </div>
      )}
      {pets.length > itemsPerPage && (
        <div className={styles.paginationCon}>
          <Pagination
            count={Math.ceil(pets.length / itemsPerPage)} // Total number of pages
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      )}
    </>
  );
}
