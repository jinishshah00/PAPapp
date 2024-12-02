import { useEffect, useState } from 'react';
import FormCard from '../components/formCard';
import axios from 'axios';

export default function Forms({ isLoggedIn, userRole }) {
    const [forms, setForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const role = userRole;
                const endpoint =
                    role === 'shelterOwner'
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
    }, []);

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
                    {forms.map((form) => (
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
            </div>
        </>
    );
}
