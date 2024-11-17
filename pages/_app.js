// pages/_app.js
import { useRouter } from 'next/router';
import '../CSS/main.css';
import Header from '../components/header.js';
import Footer from '../components/footer.js';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();

    // Conditionally render header and footer only if the path is not "/login"
    const showHeaderFooter = router.pathname !== '/login' && router.pathname !== '/register' && router.pathname !== '/updateProfile';

    return (
        <>
            {showHeaderFooter && <Header />}
            <Component {...pageProps} />
            {showHeaderFooter && <Footer />}
        </>
    );
}
