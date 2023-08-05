import LogItem from "./LogItem";
import classes from "./Logs.module.css";

function Logs({ logs }) {
  return (
    <ul className={classes.list}>
      {logs.map((log) => (
        <LogItem
          key={log._id}
          _id={log._id}
          title={log.title}
          image={log.image}
          content={log.content}
          date={log.date}
          location={log.location}
          adventurer={log.adventurer}
        />
      ))}
    </ul>
  );
}

export default Logs;
