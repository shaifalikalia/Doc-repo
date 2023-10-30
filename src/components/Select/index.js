import React from "react";

const Select = (props) => {
  return (
    <div
      className={`c-field ${props.Classes ? props.Classes : ""} ${
        props.Error ? "error-input" : ""
      }`}
    >
      <label>{props.Title}</label>
      <div className="select-control">
        <select
          className="c-form-control"
          onChange={props.HandleChange}
          name={props.Name}
          disabled={props.Disabled}
          value={props.selectedOption}
        >
          <option style={{ display: "none" }}></option>
          {props.Options &&
            props.Options.map((item) => (
              <option key={item.id} value={item.id}>
                {" "}
                {item.name || item?.category}{" "}
              </option>
            ))}
        </select>
      </div>
      {props.Error && <span className="error-msg">{props.Error}</span>}
    </div>
  );
};

export default Select;
