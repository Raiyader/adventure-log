import { useRef, useState } from "react";
import EditIcon from "../../icon/Edit";
import CheckIcon from "../../icon/Check";
import classes from "./LogDetail.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function LogDate({ _id, date, adventurer }) {
  const { data: session, status } = useSession();
  const [newDate, setNewDate] = useState(date);
  const [isEditing, setIsEditing] = useState(false);
  const dateRef = useRef();
  const router = useRouter();

  const newReadableDate = new Date(newDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const toggleHandler = () => {
    setIsEditing((prevState) => !prevState);
  };

  const escapeHandler = (e) => {
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const enteredDate = dateRef.current.value;

    const res = await fetch("/api/log/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: _id,
        date: enteredDate,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      //error
    }

    setNewDate(data.log.date);
    router.replace(`/logs/${_id}`);
    setIsEditing(false);
  };
  return (
    <>
      {isEditing ? (
        <form onSubmit={submitHandler}>
          <input
            type="date"
            name="date"
            ref={dateRef}
            onKeyDown={escapeHandler}
            required
          />
          <button className={classes.btn}>
            <CheckIcon />
          </button>
        </form>
      ) : (
        <p>
          {newReadableDate}
          {session && session.user.name === adventurer && (
            <button className={classes.btn} onClick={toggleHandler}>
              <EditIcon />
            </button>
          )}
        </p>
      )}
    </>
  );
}

export default LogDate;
