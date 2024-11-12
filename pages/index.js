import styles from '../CSS/index.module.css';

export default function Home() {
  return (
      <>
          <div className={styles.homeContainer}>
              <div className={styles.banner}>
                  {/* <img src="/img/fallleaves.png" alt="fall leaves" className={styles.leavesImage} />
                  <div className={styles.bannerContent}>
                      <h1 className={styles.mainTitle}>Fall In Love</h1>
                      <h2 className={styles.subTitle}>With a Loyal Friend</h2>
                      <p className={styles.description}>
                          Every adoption gives a pet a loving home and fills your life with endless joy. Open your heart, adopt today!
                      </p>
                      <button className={styles.adoptButton}>Adopt Now</button>
                  </div>
                  <img src="/img/dog.png" alt="dog" className={styles.dogImage} /> */}
              </div>
              {/* <footer className={styles.footer}>
                  <p>Copyright © 2024. All Rights Reserved.</p>
              </footer> */}
          </div>
      </>
  );
}
