import React from "react";

const ToggleSwitch = ({
  label,
  value,
  onChange,
  onClick = (e) => e.stopPropagation(),
}) => {
  return (
    <div className="toggle-switch" onClick={onClick}>
      <input
        type="checkbox"
        className="toggle-switch-checkbox"
        checked={value}
        onChange={onChange}
        name={label}
        id={label}
      />

      <label className="toggle-switch-label" htmlFor={label}>
        <span className="toggle-switch-inner" />
        <span className="toggle-switch-switch" />
      </label>
    </div>
  );
};

export default ToggleSwitch;
