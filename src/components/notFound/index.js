import React, { Component } from "react";
import { Link } from "react-router-dom";

class NotFound extends Component {
  render() {
    return (
      <div className="page-error-block">
        <div className="container">
          <div className="page-error-container">
            <img
              className="bg-image"
              alt="img"
              src={require("assets/images/error-graphic-bg.svg").default}
            />
            <div className="page404Wrapper">
              <img
                alt="img"
                src={require("assets/images/error-graphic.svg").default}
              />
              <h5>Page Not Found</h5>
            </div>
          </div>
          <Link to="/">
            {" "}
            <button
              className="button button-round button-shadow"
              title="Save Office"
            >
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default NotFound;
