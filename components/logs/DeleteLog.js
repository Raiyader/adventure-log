import { useRouter } from "next/router";
import classes from "./DeleteLog.module.css";
import Modal from "../layout/Modal";
import { useState } from "react";
import { useSession } from "next-auth/react";

function DeleteLog({ _id, adventurer }) {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const closeModalHandler = () => {
    setIsDeleting(false);
  };
  const openModalHandler = () => {
    setIsDeleting(true);
  };
  const deleteHandler = async () => {
    const res = await fetch("/api/log/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: _id }),
    });
    const data = await res.json();

    if (!res.ok) {
      return;
    }
    setIsDeleting(false);
    router.replace("/logs");
  };
  return (
    <>
      {isDeleting && (
        <Modal onClick={closeModalHandler}>
          <p style={{ textAlign: "center" }}>
            Do you want to delete this log ?
          </p>
          <button className={classes.btn} onClick={deleteHandler}>
            Yes
          </button>
          <button className={classes.btn} onClick={closeModalHandler}>
            No
          </button>
        </Modal>
      )}
      {session && session.user.name === adventurer && (
        <div className={classes.delete}>
          <button onClick={openModalHandler}>Delete Log</button>
        </div>
      )}
    </>
  );
}

export default DeleteLog;
