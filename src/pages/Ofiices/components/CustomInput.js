import React, { useEffect, useRef } from "react";

const CustomInput = (props) => {
  const textInput = useRef(null);
  useEffect(() => {
    if (props.Autofocus) {
      textInput.current.focus();
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div
      className={`c-field ${props.Classes ? props.Classes : ""} ${
        props.Error ? "error-input" : ""
      }`}
    >
      <label>{props.Title}</label>
      {/* eslint-disable-next-line */}
      <div className={"d-flex " + "input" + props.Type}>
        <input
          className="c-form-control"
          readOnly={props.ReadOnly}
          type={props.Type}
          placeholder={props.Placeholder}
          name={props.Name}
          onInput={props.HandleChange}
          maxLength={props.MaxLength}
          value={props.Value}
          ref={textInput}
          disabled={props.Disabled}
          autoComplete={props?.autoComplete}
          onBlur={props.onBlurChange}
        />
        <div className="helper-label">{props.HelperLabel}</div>
      </div>
      {props.Error && <span className="error-msg">{props.Error}</span>}
    </div>
  );
};

export default CustomInput;
