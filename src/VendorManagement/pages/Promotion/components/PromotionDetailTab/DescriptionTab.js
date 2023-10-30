import React, { Fragment } from "react";
import Text from "components/Text";
import { withTranslation } from "react-i18next";

const DescriptionTab = ({ t, description }) => {
  return (
    <Fragment>
      <Text
        size="16px"
        marginBottom="20px"
        weight="300"
        color=" #535B5F"
        className="whiteSpace"
      >
        {description}
      </Text>
    </Fragment>
  );
};

export default withTranslation()(DescriptionTab);
