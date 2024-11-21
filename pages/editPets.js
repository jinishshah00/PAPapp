import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function editPets({ isLoggedIn, userRole }) {
    return (
        <>
            {isLoggedIn && userRole === 'shelterOwner' && (
                <Button href='/addPet' variant="contained" endIcon={<Add />} sx={{ mt: 2 }}>
                    Add New Pet
                </Button>
            )}
        </>
    );
}
