import React from "react";
import starFilled from "./../../../assets/images/star-filled.svg";
import starUnfilled from "./../../../assets/images/star-unfilled.svg";
import starHalfFilled from "./../../../assets/images/star-half-filled.svg";
import styles from "./Rating.module.scss";

export default function Rating({ rating, size, margin }) {
  let stars = [];
  for (let i = 0; i < 5; i++) {
    let starStyle = {};
    if (size && size === "medium") {
      starStyle.width = "16px";
      starStyle.height = "16px";
      starStyle.marginRight = "3px";
    }

    if (rating >= i + 1) {
      stars.push(<img alt="" key={i} src={starFilled} style={starStyle} />);
    } else if (rating < i + 1 && rating > i) {
      stars.push(<img alt="" key={i} src={starHalfFilled} style={starStyle} />);
    } else {
      stars.push(<img alt="" key={i} src={starUnfilled} style={starStyle} />);
    }
  }

  let containerStyles = {};
  if (margin) {
    containerStyles.margin = margin;
  }

  return (
    <div style={containerStyles} className={styles["rating-container"]}>
      {stars}
    </div>
  );
}
