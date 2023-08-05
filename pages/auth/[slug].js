import { useRouter } from "next/router";
import AuthForm from "../../components/auth/AuthForm";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthNotAccount from "../../components/auth/AuthNotAccount";
import { getSession } from "next-auth/react";
import AuthWithImage from "../../components/auth/AuthWithImage";
import { useEffect, useState } from "react";
import Head from "next/head";

function Auth() {
  const router = useRouter();
  const [isWide, setIsWide] = useState(null);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsWide(true);
    } else {
      setIsWide(false);
    }
  }, []);

  const isLogin = router.query.slug === "login";
  return (
    <>
      <Head>
        <title>
          {isLogin ? "Adventure Log - Login" : "Adventure Log - Sign up"}
        </title>
      </Head>
      {isWide && <AuthWithImage />}
      <AuthHeader />
      <AuthForm />
      {isLogin && <AuthNotAccount />}
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req: req });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default Auth;
