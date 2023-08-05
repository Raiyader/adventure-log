import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import classes from "./LogDetail.module.css";
import EditIcon from "../../icon/Edit";
import CheckIcon from "../../icon/Check";

function LogImage({ _id, title, image, adventurer }) {
  const { data: session, status } = useSession();
  const [newImage, setNewImage] = useState(image);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const router = useRouter();

  const toggleHandler = () => {
    setIsEditing((prevState) => !prevState);
  };

  const fileHandler = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const escapeHandler = (e) => {
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_id", _id);
    formData.append("image", selectedImage);

    const res = await fetch("/api/log/edit-image", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!res.ok) {
      //error
    }

    setNewImage(data.log.image);
    router.replace(`/logs/${_id}`);
    setIsEditing(false);
  };
  return (
    <>
      {isEditing ? (
        <form onSubmit={submitHandler}>
          <input
            id="image"
            name="image"
            type="file"
            onKeyDown={escapeHandler}
            onChange={fileHandler}
          />
          <button className={classes.btn}>
            <CheckIcon />
          </button>
        </form>
      ) : (
        <h1>
          <Image
            loader={() => {
              return newImage;
            }}
            src={newImage}
            alt={title}
            width={250}
            height={160}
          />
          {session && session.user.name === adventurer && (
            <button className={classes.button} onClick={toggleHandler}>
              <EditIcon />
            </button>
          )}
        </h1>
      )}
    </>
  );
}

export default LogImage;
