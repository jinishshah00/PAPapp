import PetPanel from '../components/petPanel';
import styles from '../CSS/adopt.module.css'

export default function Adopt({ isLoggedIn, userRole }) {
    return (
        <>
            <div className={styles.mainCon}>
                <PetPanel isLoggedIn={isLoggedIn} userRole={userRole}/>
            </div>
        </>
    );
}
