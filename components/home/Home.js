import Image from "next/image";
import classes from "./Home.module.css";
import homepage from "../../public/images/homepage-yoal-desurmont-unsplash.jpg";
import Link from "next/link";

function Home() {
  return (
    <>
      <div className={classes.home}>
        <div className={classes.image}>
          <Image
            src={homepage}
            alt="Taken by Yoal Desurmont"
            width={400}
            height={400}
          />
        </div>
        <h1>Let the adventure begin</h1>
        <Link href="/auth/login">Start your Adventure</Link>
      </div>
    </>
  );
}

export default Home;
