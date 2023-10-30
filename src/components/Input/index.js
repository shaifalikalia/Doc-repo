import React, { useEffect, useRef } from "react";

/**
 *
 * @param {{
 *  Id: string;
 *  Title: string,
 *  Classes: string
 *  Error: string,
 *  Autofocus: boolean,
 *  Type: string,
 *  ReadOnly: boolean,
 *  Placeholder: string,
 *  Name: string,
 *  HandleChange: function,
 *  MaxLength: number,
 *  Value: any,
 *  Disabled: boolean,
 *  autoComplete: 'on' | 'off',
 *  HelperLabel: string
 *  HandleKeyDown: function
 * }} props
 * @returns
 */
const Input = (props) => {
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
          onKeyDown={props.HandleKeyDown}
          id={props.Id}
        />
        <div className="helper-label">{props.HelperLabel}</div>
      </div>
      {props.Error && <span className="error-msg">{props.Error}</span>}
    </div>
  );
};

export default Input;
