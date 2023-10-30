import React from 'react'
import Text from 'components/Text'
import { withTranslation } from "react-i18next";


const  Eventnotexist = ({t}) => {
  return (
    <div className="scheduler-empty-box">
    <p>
      <img
        src={require("assets/images/request-calendar.svg").default}
        alt="icon"
      />{" "}
    </p>
    <Text size="25px" marginBottom="0" weight="500" color="#111B45">
      {t("scheduler.eventDoesNotExist")}
    </Text>
  </div>

  )
}

export default withTranslation()(Eventnotexist);
