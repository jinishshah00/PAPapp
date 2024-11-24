import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import EditPetPanel from '../components/petEditPanel.js';

export default function editPets({ isLoggedIn, userRole }) {
    return (
        <>
            {isLoggedIn && userRole === 'shelterOwner' && (
                <div style={{display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <h2>Edit available pets</h2>
                    <EditPetPanel />
                    <Button href='/addPet' variant="contained" endIcon={<Add />} sx={{ mt: 2, marginBottom: '50px'}}>
                        Add New Pet
                    </Button>
                </div>
            )}
        </>
    );
}
