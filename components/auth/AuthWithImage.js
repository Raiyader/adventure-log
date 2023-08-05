import Image from "next/image";
import authImg from "../../public/images/auth-manuel-meurisse-unsplash.jpg";
import classes from "./AuthHeader.module.css";

function AuthWithImage() {
  return (
    <div className={classes.image}>
      <Image
        src={authImg}
        alt="Taken by Manuel Meurisse"
        width={400}
        height={400}
      />
    </div>
  );
}

export default AuthWithImage;
