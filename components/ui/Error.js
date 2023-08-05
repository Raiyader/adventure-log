import classes from "./Error.module.css";

function Error(props) {
  return <div className={classes.error}>{props.children}</div>;
}

export default Error;
