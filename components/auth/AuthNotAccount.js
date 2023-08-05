import Link from "next/link";
import classes from "./AuthHeader.module.css";

function AuthNotAccount() {
  return (
    <div className={classes.welcome}>
      <p>Don't you have an account ?</p>
      <Link href="/auth/signup">Signup</Link>
    </div>
  );
}

export default AuthNotAccount;
