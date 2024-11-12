// pages/_app.js
import '../CSS/main.css'; // Import global CSS here
import '../CSS/header.css'; // Import Header-specific CSS here
import Header from '../components/Header';

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Header />
            <Component {...pageProps} />
        </>
    );
}
