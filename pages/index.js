import { getSession } from "next-auth/react";
import Home from "../components/home/Home";

function Homepage() {
  return (
    <>
      <Home />
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req: req });

  if (session) {
    return {
      redirect: {
        destination: "/logs",
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

export default Homepage;
