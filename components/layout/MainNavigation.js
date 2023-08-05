import classes from "./MainNavigation.module.css";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import LoginIcon from "../../components/icon/Login";
import LogoutIcon from "../icon/Logout";
import logo from "../../public/images/adventure-log-logo.png";
import User from "./User";

function MainNavigation() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const logoutHandler = () => {
    signOut();
    router.replace("/");
  };
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link href="/">
          <Image src={logo} alt="Adventure Log" width={120} height={120} />
        </Link>
      </div>
      <nav className={classes.navigation}>
        <ul>
          <li>
            <Link href="/logs">Logs</Link>
          </li>
          {session && (
            <li>
              <Link href={`/u/${session.user.name}`}>
                <User />
              </Link>
            </li>
          )}
          {!session && (
            <li>
              <Link href="/auth/login">
                <LoginIcon />
                Login
              </Link>
            </li>
          )}
          {session && (
            <li>
              <button onClick={logoutHandler}>
                <LogoutIcon />
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
