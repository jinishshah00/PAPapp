import { useRouter } from 'next/router';
import styles from '../CSS/pet.module.css';
import { Pets } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function PetCard({ id, name, breed, location, image, isEditMode = false }) {
  const router = useRouter();

  const handleCardClick = () => {
    if (id) {
      if (isEditMode) {
        // Navigate to the edit page for the specific pet
        router.push(`/editPets/${id}`);
      } else {
        // Navigate to the adopt page for the specific pet
        router.push(`/pet/${id}`);
      }
    } else {
      console.error('Pet ID is missing!');
    }
  };

  return (
    <div className={styles.petCard} onClick={handleCardClick}>
      <img src={`${image}`} alt={`${name}`} />
      <div className={styles.textCon}>
        <div className={styles.cardName}>
          <AccountCircleIcon sx={{ padding: '0px 10px' }} />
          {name}
        </div>
        <div className={styles.cardName}>
          <Pets sx={{ padding: '0px 10px' }} />
          {breed}
        </div>
        <div className={styles.cardName}>
          <LocationOnIcon sx={{ padding: '0px 10px' }} />
          {location}
        </div>
      </div>
    </div>
  );
}
