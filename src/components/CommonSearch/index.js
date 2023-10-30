import React from "react";

const CommonSearch = (props) => {
  return (
    <div className={`common-search-box ${props.Classes ? props.Classes : ""}`}>
      <input
        type="text"
        placeholder={props?.Placeholder}
        value={props?.Value}
        onChange={props?.HandleChange}
      />
      <span className="ico">
        <img
          src={require("assets/images/search-icon.svg").default}
          alt="icon"
        />
      </span>
    </div>
  );
};

export default CommonSearch;
