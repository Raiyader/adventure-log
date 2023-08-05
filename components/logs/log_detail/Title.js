import { useRef, useState } from "react";
import EditIcon from "../../icon/Edit";
import CheckIcon from "../../icon/Check";
import classes from "./LogDetail.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function Title({ _id, title, adventurer }) {
  const { data: session, status } = useSession();
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef();
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

    const enteredTitle = titleRef.current.value;

    const res = await fetch("/api/log/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: _id,
        title: enteredTitle,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      //error
    }

    setNewTitle(data.log.title);
    router.replace(`/logs/${_id}`);

    setIsEditing(false);
  };
  return (
    <>
      {isEditing ? (
        <form onSubmit={submitHandler}>
          <input
            type="text"
            name="title"
            ref={titleRef}
            onKeyDown={escapeHandler}
            defaultValue={title}
            required
          />
          <button className={classes.btn}>
            <CheckIcon />
          </button>
        </form>
      ) : (
        <h1>
          {newTitle}
          {session && session.user.name === adventurer && (
            <button className={classes.btn} onClick={toggleHandler}>
              <EditIcon />
            </button>
          )}
        </h1>
      )}
    </>
  );
}

export default Title;
