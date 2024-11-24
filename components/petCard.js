import styles from '../CSS/pet.module.css';
import { Pets } from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function PetCard({ name, breed, location, image }) {
  return (
    <div className={styles.petCard}>
      <img src={`${image}`} alt={`${name}`} />
      {/* <img src='img/maximg.png' alt={'dog'} /> */}
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
