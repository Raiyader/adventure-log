import Filter from "../../../components/logs/Filter";
import { connectDatabase } from "../../../lib/db";
import UserLogs from "../../../components/logs/UserLogs";
import { useRouter } from "next/router";
import Button from "../../../components/ui/Button";
import Head from "next/head";

function Userpage({ myLogs, noLog }) {
  const router = useRouter();
  const adventurer = router.query.username;
  const filterLogs = (year, month) => {
    router.push(`/u/${adventurer}/${year}/${month}`);
  };
  return (
    <>
      <Head>
        <title>{adventurer}'s Logs</title>
      </Head>
      <Button link={`/u/${adventurer}/add-log`}>Add New Log</Button>
      <Filter onSearch={filterLogs} />
      {noLog && (
        <p style={{ textAlign: "center", fontWeight: "bold" }}>No logs found</p>
      )}
      <UserLogs myLogs={myLogs} />
    </>
  );
}

export async function getStaticProps({ params }) {
  const adventurer = params.username;
  const client = await connectDatabase();
  const db = client.db();

  const getMyLogs = await db
    .collection("logs")
    .find({ adventurer: adventurer })
    .toArray();

  let convertedMyLogs;
  if (getMyLogs.length === 0) {
    convertedMyLogs = [];
    return {
      props: { noLog: convertedMyLogs },
    };
  } else {
    convertedMyLogs = JSON.parse(JSON.stringify(getMyLogs));
  }

  return {
    props: { myLogs: convertedMyLogs },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const client = await connectDatabase();
  const db = client.db();

  const logs = await db.collection("logs").find().toArray();

  const convertedLogs = JSON.parse(JSON.stringify(logs));

  const paths = convertedLogs.map((log) => ({
    params: { username: log.adventurer },
  }));

  return {
    paths: paths,
    fallback: true,
  };
}

export default Userpage;
