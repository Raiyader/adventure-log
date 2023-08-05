import DeleteLog from "../DeleteLog";
import Title from "./Title";
import LogImage from "./LogImage";
import DateIcon from "../../icon/Date";
import Date from "./Date";
import LocationIcon from "../../icon/Location";
import Location from "./Location";
import Content from "./Content";
import classes from "./LogDetail.module.css";

function LogDetail({ _id, title, image, date, location, content, adventurer }) {
  return (
    <>
      <DeleteLog _id={_id} adventurer={adventurer} />
      <div className={classes.title}>
        <Title _id={_id} title={title} adventurer={adventurer} />
      </div>
      <div className={classes.image}>
        <LogImage
          _id={_id}
          title={title}
          image={image}
          adventurer={adventurer}
        />
      </div>
      <div className={classes.detail}>
        <DateIcon />
        <Date _id={_id} date={date} adventurer={adventurer} />
        <LocationIcon />
        <Location _id={_id} location={location} adventurer={adventurer} />
      </div>
      <div className={classes.content}>
        <Content _id={_id} content={content} adventurer={adventurer} />
      </div>
    </>
  );
}

export default LogDetail;
