import { useRef, useState } from "react";
import classes from "./LogForm.module.css";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Error from "../ui/Error";
import Modal from "../layout/Modal";
import CheckIcon from "../icon/Check";

function LogForm() {
  const { data: session, status } = useSession();
  const [selectedImage, setSelectedImage] = useState();
  const [hasError, setHasError] = useState(null);
  const [isSuccessful, setIsSuccessful] = useState(null);
  const titleRef = useRef();
  const contentRef = useRef();
  const dateRef = useRef();
  const locationRef = useRef();

  const router = useRouter();

  const fileHandler = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const enteredTitle = titleRef.current.value;
    const enteredDate = dateRef.current.value;
    const enteredLocation = locationRef.current.value;
    const enteredContent = contentRef.current.value;

    const formData = new FormData();

    formData.append("title", enteredTitle);
    formData.append("image", selectedImage);
    formData.append("date", enteredDate);
    formData.append("location", enteredLocation);
    formData.append("content", enteredContent);
    formData.append("adventurer", session.user.name);

    const res = await fetch("/api/log/add", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (res.status === 422 || res.status === 500) {
      setHasError(data.message);
      return;
    }

    if (res.status === 201) {
      setIsSuccessful(true);
    }

    setTimeout(() => {
      setIsSuccessful(false);
      clearTimeout();
    }, 1500);

    router.replace("/logs");
  };
  return (
    <>
      {isSuccessful && (
        <Modal>
          {" "}
          <CheckIcon />
          <p>Successfully added!</p>
        </Modal>
      )}
      <div className={classes.title}>
        <h1>Add New Log</h1>
      </div>
      {hasError && (
        <Error>
          <p>{hasError}</p>
        </Error>
      )}
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="title">Log Title</label>
          <input id="title" name="title" type="text" ref={titleRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="image">Log Image</label>
          <input id="image" name="image" type="file" onChange={fileHandler} />
        </div>
        <div className={classes.control}>
          <label htmlFor="date">Log Date</label>
          <input id="date" name="date" type="date" ref={dateRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="location">Log Location</label>
          <input
            id="location"
            name="location"
            type="text"
            ref={locationRef}
            required
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="content">Log Content</label>
          <textarea
            id="content"
            name="content"
            rows="5"
            ref={contentRef}
            required
          ></textarea>
        </div>
        <div className={classes.actions}>
          <button>Add Log</button>
        </div>
      </form>
    </>
  );
}

export default LogForm;
