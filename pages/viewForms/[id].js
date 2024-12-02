import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../CSS/formPage.module.css'; // Adjusted the path for CSS
import PetsIcon from '@mui/icons-material/Pets';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { Button } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';

export default function ViewForm({ userRole }) {
  const router = useRouter();
  const { id } = router.query; // Get form ID from the URL
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/forms/${id}`,
          { withCredentials: true }
        );
        setForm(response.data);
      } catch (error) {
        console.error('Error fetching form:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchForm();
  }, [id]);

  const handleAction = async (action) => {
    const confirmationMessage = `Do you really want to ${action} this form?`;
    if (!window.confirm(confirmationMessage)) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/forms/${id}/${action}`,
        {},
        { withCredentials: true }
      );
      alert(`Form ${action}ed successfully!`);
      router.push('/forms'); // Redirect back to the forms page
    } catch (error) {
      console.error(`Error ${action}ing form:`, error);
      alert(`Failed to ${action} form.`);
    }
  };

  if (loading) return <p>Loading form details...</p>;
  if (!form) return <p>Form not found.</p>;

  return (
    <div className={styles.mainCon}>
      <div className={styles.petCon}>
        <img src={form.pet?.image || '/img/default-pet.jpg'} alt="Pet Image" />
        <div className={styles.infoCon}>
          <h1>Adoption Form</h1>
          <div className={styles.infoDiv}>
            <PetsIcon />
            <h2>{form.pet?.name || 'Pet Name'}</h2>
          </div>
          <div className={styles.infoDiv}>
            <AccountCircleIcon />
            <h2>
              {userRole === 'shelterOwner'
                ? form.adopter?.name || 'Adopter Name'
                : form.pet.shelter.name || 'Shelter Owner Name'}
            </h2>
          </div>
          <div className={styles.infoDiv}>
            <EditNoteIcon />
            <h2>Inquiry</h2>
          </div>
          <p>{form.inquiry}</p>
          <div className={styles.infoDiv}>
            <DateRangeIcon />
            <h2>Schedule Request Date</h2>
          </div>
          <p>{new Date(form.scheduleVisit).toLocaleDateString()}</p>
          <h2>Status</h2>
          <div className={styles.infoDiv} style={{ color: getStatusColor(form.status) }}>
            {getStatusIcon(form.status)}
            {getStatusText(form.status)}
          </div>
          {userRole === 'shelterOwner' && (
            <div className={styles.buttonCon}>
              <Button
                variant="outlined"
                endIcon={<DoneIcon />}
                sx={{ color: 'green' }}
                onClick={() => handleAction('accept')}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                endIcon={<CloseIcon />}
                sx={{ color: 'red' }}
                onClick={() => handleAction('reject')}
              >
                Decline
              </Button>
              <Button
                variant="outlined"
                endIcon={<HistoryIcon />}
                sx={{ color: 'orange' }}
                onClick={() => handleAction('reject-date')}
              >
                Reschedule
              </Button>
              <Button
                variant="outlined"
                endIcon={<PetsIcon />}
                sx={{ color: 'green' }}
                onClick={() => handleAction('adopted')}
              >
                Adopt
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get the appropriate icon based on status
const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return <HistoryIcon />;
    case 'accepted':
      return <DoneIcon />;
    case 'rejected':
      return <CloseIcon />;
    case 'rescheduled':
      return <HistoryIcon />;
    case 'adopted':
      return <PetsIcon />;
    default:
      return null;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return ('Pending');
    case 'accepted':
      return ('Accepted');
    case 'rejected':
      return ('Rejected');
    case 'rescheduled':
      return ('Rescheduled');
    case 'adopted':
      return ('Adopted');
    default:
      return null;
  }
};
// Helper function to get the appropriate color based on status
const getStatusColor = (status) => {
  switch (status) {
    case 'accepted':
    case 'adopted':
      return 'green';
    case 'rejected':
      return 'red';
    case 'rescheduled':
      return 'orange';
    default:
      return 'black';
  }
};
