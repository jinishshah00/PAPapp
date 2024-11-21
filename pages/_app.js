// pages/_app.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import '../CSS/main.css';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const customTheme = createTheme({
    palette: {
      primary: {
        main: '#DE5C20', // Your primary color
      },
      background: {
        default: '#FBFCFF', // Background color
      },
      text: {
        primary: '#DE5C20', // Primary color for text as well
        secondary: '#000', // Optional secondary color if needed elsewhere
      },
    },
  });

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');

    const handleAuthChange = (loggedIn, role) => {
        setIsLoggedIn(loggedIn);
        setUserRole(role);
    };
    // Conditionally render header and footer only if the path is not "/login"
    const showHeaderFooter = router.pathname !== '/login' && router.pathname !== '/register' && router.pathname !== '/updateProfile' && router.pathname !== '/addPet';

    return (
        <>
            <ThemeProvider theme={customTheme}>
                {showHeaderFooter && <Header onAuthChange={handleAuthChange}/>}
                <Component {...pageProps} isLoggedIn={isLoggedIn} userRole={userRole}/>
                {showHeaderFooter && <Footer />}
            </ThemeProvider>
        </>
    );
}
