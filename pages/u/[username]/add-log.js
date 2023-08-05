import { getSession } from "next-auth/react";
import LogForm from "../../../components/logs/LogForm";

function LogActionpage() {
  return (
    <>
      <LogForm />
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req: req });
  const url = req.url;
  const findUserUrl = url.split("=")[1];

  if (session) {
    if (session.user.name !== findUserUrl) {
      return {
        redirect: {
          destination: `/u/${session.user.name}`,
          permanent: false,
        },
      };
    }
  }
  if (!session) {
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

export default LogActionpage;
