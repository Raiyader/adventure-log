import { useRouter } from "next/router";
import { connectDatabase } from "../../lib/db";
import Error from "../../components/ui/Error";
import Filter from "../../components/logs/Filter";
import Button from "../../components/ui/Button";
import FilteredLogs from "../../components/logs/FilteredLogs";

function Slug(props) {
  const router = useRouter();
  const filterData = router.query.slug;
  const readableDate = new Date(filterData[0], filterData[1] - 1);
  const month = readableDate.toLocaleString("en-US", {
    month: "long",
  });
  const year = readableDate.getFullYear();
  const selectedDate = `${month}, ${year}`;
  if (props.isInvalid) {
    return (
      <>
        <Filter />
        <Error>
          <p>Date is not valid</p>
        </Error>
      </>
    );
  }
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "1rem" }}>
        {props.filteredLogs.length === 0
          ? `No logs found in ${selectedDate}`
          : `Logs in ${selectedDate}`}
      </h1>
      <Button link={"/logs"}>Show All Logs</Button>
      <FilteredLogs filteredLogs={props.filteredLogs} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const filterData = params.slug;

  const filteredYear = +filterData[0];
  const filteredMonth = +filterData[1];

  let selectedMonth = filteredMonth;

  if (filteredMonth < 9) {
    selectedMonth = `0${filteredMonth}`;
  }

  if (
    isNaN(filteredYear) ||
    isNaN(filteredMonth) ||
    filteredYear > 2030 ||
    filteredYear < 2020 ||
    filteredMonth < 1 ||
    filteredMonth > 12
  ) {
    return {
      props: { isInvalid: true },
    };
  }

  const client = await connectDatabase();
  const db = client.db();

  let filteredLogs = await db
    .collection("logs")
    .find({
      date: {
        $gte: new Date(`${filteredYear}-${selectedMonth}-01`).toISOString(),
        $lte: new Date(`${filteredYear}-${selectedMonth}-31`).toISOString(),
      },
    })
    .toArray();

  if (selectedMonth === "02") {
    if (filteredYear % 4 === 0) {
      filteredLogs = await db
        .collection("logs")
        .find({
          date: {
            $gte: new Date(`${filteredYear}-${selectedMonth}-01`).toISOString(),
            $lte: new Date(`${filteredYear}-${selectedMonth}-29`).toISOString(),
          },
        })
        .toArray();
    } else {
      filteredLogs = await db
        .collection("logs")
        .find({
          date: {
            $gte: new Date(`${filteredYear}-${selectedMonth}-01`).toISOString(),
            $lte: new Date(`${filteredYear}-${selectedMonth}-28`).toISOString(),
          },
        })
        .toArray();
    }
  }

  const convertedLogs = JSON.parse(JSON.stringify(filteredLogs));

  return {
    props: {
      filteredLogs: convertedLogs,
    },
  };
}

export default Slug;
