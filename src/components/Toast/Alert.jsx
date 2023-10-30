import React from "react";

const Alert = (props) => {
  return (
    <div className={`toast-container ${props.errorToast && "toast-error"}`}>
      <span className="ico">
        {props.errorToast ? (
          <img
            src={require("assets/images/error-close.svg").default}
            className="img-fluid"
            alt="error"
          />
        ) : (
          <img
            src={require("assets/images/tick.svg").default}
            className="img-fluid"
            alt="tick"
          />
        )}
      </span>
      <p>{props.message}</p>
      <span className="close-ico" onClick={props.handleClose}>
        <img
          src={require("assets/images/close.svg").default}
          className="img-fluid"
          alt="close"
        />
      </span>
    </div>
  );
};

export default Alert;
