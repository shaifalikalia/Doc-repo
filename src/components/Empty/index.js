import React from "react";

const Empty = (props) => {
  return (
    <div className="empty-block">
      {props.Image ? (
        <img src={require(`assets/images/${props.Image}`).default} alt="icon" />
      ) : (
        <img src={require("assets/images/empty-icon.svg").default} alt="icon" />
      )}
      <h4>{props.Message}</h4>
    </div>
  );
};

export default Empty;
