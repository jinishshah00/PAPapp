import styles from '../CSS/index.module.css';
import { Button } from '@mui/material';
import { Launch } from '@mui/icons-material';


export default function Home() {
  return (
      <>
          <div className={styles.homeContainer}>
              <div className={styles.banner}>
                <img src="/img/fallleaves.png" alt="fall leaves" className={styles.leavesImage} />
                <img src="/img/dog.png" alt="dog" className={styles.dogImage} />  
                  <div className={styles.bannerContent}>
                      <h1 className={styles.mainTitle}>Fall In Love</h1>
                      <h2>With a Loyal Friend</h2>
                      <p>
                          Every adoption gives a pet a loving home and fills your life with endless joy. Open your heart, adopt today!
                      </p>
                      <Button 
                        variant="contained" 
                        endIcon={<Launch />}
                        sx={{
                            bgcolor: 'var(--primary-color)',
                        }}
                        >
                            Adopt Now
                        </Button>
                  </div>
              </div>
          </div>
      </>
  );
}
