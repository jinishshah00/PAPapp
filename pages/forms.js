import { useEffect, useState } from 'react';
import FormCard from '../components/formCard';
import axios from 'axios';
import { Pagination, Checkbox, FormControlLabel, Button } from '@mui/material';

export default function Forms({ isLoggedIn, userRole }) {
    const [forms, setForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAdopted, setShowAdopted] = useState(false); // State for the checkbox
    const itemsPerPage = 5; // Number of forms per page

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const role = userRole;
                const endpoint = showAdopted
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/forms/shelter/adopted` // Call adopted forms endpoint
                    : role === 'shelterOwner'
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/forms/shelter`
                    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/forms/adopter`;

                const response = await axios.get(endpoint, { withCredentials: true });
                setForms(response.data);
            } catch (error) {
                console.error('Error fetching forms:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchForms();
    }, [showAdopted]); // Refetch whenever showAdopted changes

    const handlePageChange = (event, value) => {
        setCurrentPage(value); // Update the current page
    };

    const handleAdoptedCheckbox = () => {
        setShowAdopted((prev) => !prev); // Toggle the checkbox state
    };

    // Calculate the forms to display based on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedForms = forms.slice(startIndex, startIndex + itemsPerPage);

    if (isLoading) return <p>Loading forms...</p>;
    if (!forms.length) return <p>No forms found.</p>;

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    width: '80%',
                    padding: '0 10%',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {userRole === 'shelterOwner' && (
                    <div style={{ display: 'flex', justifyContent: 'center', position: 'absolute', right: '13%', top: '23vh'}}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showAdopted}
                                    onChange={handleAdoptedCheckbox}
                                    color="primary"
                                />
                            }
                            label="ADOPTED PETS ONLY"
                        />
                    </div>
                )}
                <h1 style={{ marginTop: '30px' }}>Adoption Forms</h1>
                <div
                    style={{
                        marginBottom: '20px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                    }}
                >
                    {displayedForms.map((form) => (
                        <FormCard
                            key={form._id}
                            petName={form.pet?.name || 'Unknown'}
                            status={form.status}
                            image={form.pet?.image}
                            adopterName={form.adopter?.name || null}
                            userRole={userRole}
                            formId={form._id}
                        />
                    ))}
                </div>
                {forms.length > itemsPerPage && (
                    <Pagination
                        count={Math.ceil(forms.length / itemsPerPage)} // Total number of pages
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{ marginTop: '20px' }}
                    />
                )}
            </div>
        </>
    );
}
