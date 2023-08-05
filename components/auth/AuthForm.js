import classes from "./AuthForm.module.css";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Error from "../ui/Error";
import Modal from "../layout/Modal";
import CheckIcon from "../icon/Check";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [hasError, setHasError] = useState(null);
  const [isSuccessful, setIsSuccessful] = useState(null);
  const emailRef = useRef();
  const passRef = useRef();
  const confirmPassRef = useRef();
  const usernameRef = useRef();
  const router = useRouter();

  const createUser = async (email, username, password, confirmPass) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password, confirmPass }),
    });

    const data = await res.json();

    if (!res.ok) {
      setHasError(data.message);
      return;
    }

    if (res.status === 201) {
      setIsSuccessful(true);
    }

    return data;
  };

  setTimeout(() => {
    setIsSuccessful(false);
    clearTimeout();
  }, 1500);

  useEffect(() => {
    if (router.query.slug === "signup") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [router]);

  useEffect(() => {}, [router]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const enteredEmail = emailRef.current.value;
    const enteredPassword = passRef.current.value;

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });
      if (!result.error) {
        setIsSuccessful(true);
        router.replace("/");
      } else {
        setHasError(result.error);
      }
    } else {
      const enteredConfirmPass = confirmPassRef.current.value;
      const enteredUsername = usernameRef.current.value;
      const result = await createUser(
        enteredEmail,
        enteredUsername,
        enteredPassword,
        enteredConfirmPass
      );
      if (result) {
        setHasError(null);
        router.replace("/auth/login");
      }
    }
  };
  return (
    <>
      {hasError && (
        <Error>
          <p>{hasError}</p>
        </Error>
      )}
      {isSuccessful && (
        <Modal>
          <CheckIcon />
          <p>Successful!</p>
        </Modal>
      )}
      <form className={classes.form} onSubmit={submitHandler}>
        <label htmlFor="email">Your email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          ref={emailRef}
          required
        />
        {!isLogin && <label htmlFor="username">Your username</label>}
        {!isLogin && (
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            ref={usernameRef}
            required
          />
        )}
        <label htmlFor="password">Your password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          ref={passRef}
          required
        />
        {!isLogin && (
          <label htmlFor="confirm-password">Your password again</label>
        )}
        {!isLogin && (
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="current-password"
            ref={confirmPassRef}
            required
          />
        )}
        <button>{isLogin ? "Login" : "Signup"}</button>
      </form>
    </>
  );
}

export default AuthForm;
