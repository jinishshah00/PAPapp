import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../CSS/petPage.module.css';
import { Button, TextField } from '@mui/material';
import { Pets, Cake, Straighten, LocationOn, Medication } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function EditPetPage() {
  const router = useRouter();
  const { id } = router.query;

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  

  useEffect(() => {
    if (id) {
      fetchPetDetails(id); // Fetch the pet details dynamically
    }
  }, [id]);

  const fetchPetDetails = async (petId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pets/getPet/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pet details');
      }
      const data = await response.json();
      setPet(data);
      console.log(data);
      setUpdatedData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image to upload.");
      return;
    }

    const imgdata = new FormData();
    imgdata.append('name', pet.name);
    imgdata.append('image', selectedImage);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pets/updatePetImage/${id}`, {
        method: 'PUT',
        credentials: 'include', // Include cookies for authentication
        body: imgdata,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image.");
      }

      const data = await response.json();
      alert("Image updated successfully!");
      // Optionally refresh the page to show the updated image
      router.reload();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pets/updatePet/${id}`, {
        method: 'PUT',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update pet details.");
      }

      alert("Pet details updated successfully!");
      router.push('/editPets'); // Redirect back to edit pets list
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Do you really need to delete the pet?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pets/deletePet/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
      });

      // Log the full response for debugging
      console.log('Delete Response:', response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete pet.");
      }

      alert("Pet deleted successfully!");
      router.push('/editPets'); // Redirect back to edit pets list
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.mainCon}>
      <div className={styles.petCon}>
        <div className={styles.imgCon}>
          <img src={previewImage || pet.image} alt={pet.name} />
          <div className={styles.photoButtonCon}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
              id="upload-image"
            />
            <label htmlFor="upload-image">
              <Button variant="outlined" component="span">
                Choose Image
              </Button>
            </label>
            <Button
              variant="contained"
              onClick={handleImageUpload}
              disabled={!selectedImage}
            >
              Upload Image
            </Button>
          </div>
        </div>

        <div className={styles.infoCon}>
          <AccountCircleIcon />
          <TextField
            label="Name"
            variant="outlined"
            value={updatedData.name}
            sx={{margin: '15px 0'}}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        <div className={styles.infoCon}>
          <Pets />
          <TextField
            label="Breed"
            variant="outlined"
            value={updatedData.breed}
            sx={{margin: '15px 0'}}
            onChange={(e) => handleInputChange('breed', e.target.value)}
          />
        </div>

        <div className={styles.infoCon}>
          <Cake />
          <TextField
            label="Age"
            variant="outlined"
            type="number"
            value={updatedData.age}
            sx={{margin: '15px 0'}}
            onChange={(e) => handleInputChange('age', e.target.value)}
          />
        </div>

        <div className={styles.infoCon}>
          <Straighten />
          <TextField
            label="Size"
            variant="outlined"
            value={updatedData.size}
            sx={{margin: '15px 0'}}
            onChange={(e) => handleInputChange('size', e.target.value)}
          />
        </div>

        <div className={styles.infoCon}>
          <LocationOn />
          <TextField
            label="Location"
            variant="outlined"
            value={updatedData.location}
            sx={{margin: '15px 0'}}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>

        <div className={styles.infoCon}>
          <Medication />
          <TextField
            label="Medical History"
            variant="outlined"
            multiline
            value={updatedData.medicalHistory}
            sx={{margin: '15px 0'}}
            onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
          />
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outlined" onClick={() => router.push('/editPets')}>
              Cancel
          </Button>
          <Button startIcon={<DeleteForeverIcon />} variant="outlined" onClick={handleDelete} color="error">
            Delete Pet
          </Button>
        </div>
      </div>
    </div>
  );
}
