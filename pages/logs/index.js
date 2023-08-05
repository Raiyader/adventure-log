import Filter from "../../components/logs/Filter";
import { useRouter } from "next/router";
import { connectDatabase } from "../../lib/db";
import Logs from "../../components/logs/Logs";
import Head from "next/head";

function Logspage({ logs }) {
  const router = useRouter();
  const filterLogs = (year, month) => {
    router.push(`/logs/${year}/${month}`);
  };
  return (
    <>
      <Head>
        <title>Adventure Logs</title>
      </Head>
      <Filter onSearch={filterLogs} />
      <Logs logs={logs} />
    </>
  );
}

export async function getStaticProps() {
  const client = await connectDatabase();
  const db = client.db();

  const getLogs = await db.collection("logs").find().toArray();

  const convertedLogs = JSON.parse(JSON.stringify(getLogs));

  return {
    props: { logs: convertedLogs },
    revalidate: 10,
  };
}

export default Logspage;
