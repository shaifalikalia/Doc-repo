import React from "react";

const Loader = () => {
  return (
    <div className="preloader">
      <div className="lds-default">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <span className="loading-text">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
