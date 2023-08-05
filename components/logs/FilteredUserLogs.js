import LogItem from "./LogItem";
import classes from "./Logs.module.css";

function FilteredUserLogs({ filteredUserLogs }) {
  return (
    <ul className={classes.list}>
      {filteredUserLogs &&
        filteredUserLogs.map((log) => (
          <LogItem
            key={log._id}
            _id={log._id}
            title={log.title}
            image={log.image}
            content={log.content}
            date={log.date}
            location={log.location}
          />
        ))}
    </ul>
  );
}

export default FilteredUserLogs;
