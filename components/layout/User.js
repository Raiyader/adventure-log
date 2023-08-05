import UserIcon from "../icon/User";
import classes from "./User.module.css";

function User() {
  return (
    <div className={classes.user}>
      <UserIcon />
    </div>
  );
}

export default User;
