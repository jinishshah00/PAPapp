import { Button } from '@mui/material';
import { Edit } from '@mui/icons-material';
import petPanel from '../components/petPanel';

export default function Adopt({ isLoggedIn, userRole }) {
    return (
        <>
            <petPanel />
            {isLoggedIn && userRole === 'shelterOwner' && (
                <Button href='/editPets' variant="contained" endIcon={<Edit />} sx={{ mt: 2 }}>
                    Edit Pet Listings
                </Button>
            )}
        </>
    );
}
