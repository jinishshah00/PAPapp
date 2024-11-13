// pages/_app.js
import '../CSS/main.css';
import Header from '../components/header.js';
import Footer from '../components/footer.js';

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Header />
            <Component {...pageProps} />
            <Footer />
        </>
    );
}
