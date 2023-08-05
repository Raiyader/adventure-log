import { useRef, useState } from "react";
import EditIcon from "../../icon/Edit";
import CheckIcon from "../../icon/Check";
import classes from "./LogDetail.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function Location({ _id, location, adventurer }) {
  const { data: session, status } = useSession();
  const [newLocation, setNewLocation] = useState(location);
  const [isEditing, setIsEditing] = useState(false);
  const locationRef = useRef();
  const router = useRouter();

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

    const enteredLocation = locationRef.current.value;

    const res = await fetch("/api/log/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: _id,
        location: enteredLocation,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      //error
    }
    setNewLocation(data.log.location);
    router.replace(`/logs/${_id}`);
    setIsEditing(false);
  };
  return (
    <>
      {isEditing ? (
        <form onSubmit={submitHandler}>
          <input
            type="text"
            name="location"
            ref={locationRef}
            onKeyDown={escapeHandler}
            defaultValue={location}
            required
          />
          <button className={classes.btn}>
            <CheckIcon />
          </button>
        </form>
      ) : (
        <p>
          {newLocation}
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

export default Location;
