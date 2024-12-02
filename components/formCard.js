import styles from '../CSS/formCard.module.css';
import { useRouter } from 'next/router';
import { Pets, History, Done, Cancel, AccountCircle } from '@mui/icons-material';

export default function FormCard({ petName, status, image, adopterName, userRole, formId }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/viewForms/${formId}`); // Navigate to the individual form page
  };

  return (
    <div className={styles.mainCon} onClick={handleClick}>
      <img src={image || '/img/default-pet.jpg'} alt="pet image" />
      <div className={styles.textCon}>
        <div className={styles.cardName}>
          <Pets sx={{ padding: '0px 10px' }} />
          {petName}
        </div>
        {status === 'pending' && (
          <div className={styles.cardName}>
            <History sx={{ padding: '0px 10px' }} />
            Pending
          </div>
        )}
        {status === 'accepted' && (
          <div className={styles.accept}>
            <Done sx={{ padding: '0px 10px' }} />
            Accepted
          </div>
        )}
        {status === 'rejected' && (
          <div className={styles.decline}>
            <Cancel sx={{ padding: '0px 10px' }} />
            Declined
          </div>
        )}
        {status === 'adopted' && (
          <div className={styles.accept}>
            <Pets sx={{ padding: '0px 10px' }} />
            Adopted
          </div>
        )}
        {userRole === 'shelterOwner' && (
          <div className={styles.cardName}>
            <AccountCircle sx={{ padding: '0px 10px' }} />
            {adopterName || 'Adopter Name'}
          </div>
        )}
      </div>
    </div>
  );
}
