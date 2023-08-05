import Image from "next/image";
import Link from "next/link";
import classes from "./LogItem.module.css";
import DateIcon from "../icon/Date";
import LocationIcon from "../icon/Location";
import ChevronRightIcon from "../icon/ChevronRight";

function LogItem({ _id, title, image, date, location, adventurer }) {
  const readableDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <li className={classes.item}>
      <Image
        loader={() => {
          return image;
        }}
        src={image}
        alt={title}
        width={250}
        height={160}
      />
      <div className={classes.content}>
        <div>
          <h2>{title}</h2>
          <div className={classes.date}>
            <time>
              <DateIcon />
              {readableDate}
            </time>
          </div>
          <div className={classes.address}>
            <address>
              <LocationIcon />
              {location}
            </address>
          </div>
        </div>
        <div className={classes.actions}>
          <Link href={`/logs/${_id}`}>
            <span>Explore Log</span>
            <span className={classes.icon}>
              <ChevronRightIcon />
            </span>
          </Link>
        </div>
      </div>
    </li>
  );
}

export default LogItem;
