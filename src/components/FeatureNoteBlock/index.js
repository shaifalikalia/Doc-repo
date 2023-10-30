import React from "react";
import { withTranslation } from "react-i18next";

const FeatureNoteBlock = (props) => {
  return (
    <div className="feature-note-block">
      <div className="container">
        <h2>{props.Title}</h2>
        <p>{props.Desc}</p>
      </div>
    </div>
  );
};

export default withTranslation()(FeatureNoteBlock);
