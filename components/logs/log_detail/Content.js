import { useRef, useState } from "react";
import EditIcon from "../../icon/Edit";
import CheckIcon from "../../icon/Check";
import classes from "./LogDetail.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function Content({ _id, content, adventurer }) {
  const { data: session, status } = useSession();
  const [newContent, setNewContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef();
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

    const enteredContent = contentRef.current.value;

    const res = await fetch("/api/log/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: _id,
        content: enteredContent,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      //error
    }

    setNewContent(data.log.content);
    router.replace(`/logs/${_id}`);
    setIsEditing(false);
  };
  return (
    <>
      {isEditing ? (
        <form onSubmit={submitHandler}>
          <textarea
            rows={5}
            name="content"
            ref={contentRef}
            onKeyDown={escapeHandler}
            defaultValue={content}
            required
          />
          <button className={classes.btn}>
            <CheckIcon />
          </button>
        </form>
      ) : (
        <p>
          {session && session.user.name === adventurer && (
            <button className={classes.btn} onClick={toggleHandler}>
              <EditIcon />
            </button>
          )}
          {newContent}
        </p>
      )}
    </>
  );
}

export default Content;
