import { useRouter } from "next/router";
import classes from "./AuthHeader.module.css";
import Image from "next/image";
import logo from "../../public/images/adventure-log-logo.png";

function AuthHeader() {
  const router = useRouter();
  const isLogin = router.query.slug === "login";
  return (
    <div className={classes.welcome}>
      <Image src={logo} alt="Adventure Log" width={120} height="auto" />
      <h1>Hello adventurer,</h1>
      {isLogin && <p>Let's go on an adventure!</p>}
      {!isLogin && <p>Welcome to "Adventure Log"</p>}
      {!isLogin && <p>Create an account and start sharing your adventures</p>}
    </div>
  );
}

export default AuthHeader;
