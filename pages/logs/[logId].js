import { ObjectId } from "mongodb";
import { connectDatabase } from "../../lib/db";
import LogDetail from "../../components/logs/log_detail/LogDetail";
import Head from "next/head";

function LogDetailpage({ log }) {
  if (!log) {
    return <p className="centered">Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>{log.title}</title>
      </Head>
      <LogDetail
        _id={log._id}
        title={log.title}
        image={log.image}
        date={log.date}
        location={log.location}
        content={log.content}
        adventurer={log.adventurer}
      />
    </>
  );
}

export async function getStaticProps({ params }) {
  const logId = params.logId;
  const client = await connectDatabase();
  const db = client.db();

  const singleLog = await db
    .collection("logs")
    .find({ _id: new ObjectId(logId) })
    .toArray();

  const convertedSingleLog = JSON.parse(JSON.stringify(singleLog[0]));
  return {
    props: {
      log: convertedSingleLog,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const client = await connectDatabase();
  const db = client.db();

  const logs = await db.collection("logs").find().toArray();

  const convertedLogs = JSON.parse(JSON.stringify(logs));

  const paths = convertedLogs.map((log) => ({ params: { logId: log._id } }));

  return {
    paths: paths,
    fallback: true,
  };
}

export default LogDetailpage;
