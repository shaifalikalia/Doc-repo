import React from "react";
import styles from "./../DoctorDetail.module.scss";
import { withTranslation } from "react-i18next";
import Text from "components/Text";
import { Link } from "react-router-dom";
import constants from "../../../../constants.js";
import qs from "query-string";

const QuestionnaireCard = ({
  t,
  officeId,
  doctorId,
  isQuestionnaireFilled,
  timeRequiredForAppointment,
  memberId,
}) => {
  return (
    <div className={styles["questionnaire-card"]}>
      <Text size="16px" weight="600" color="#fff" marginBottom="25px">
        {!isQuestionnaireFilled
          ? t("patient.fillQuestionnaireDesc")
          : t("patient.viewEditQuestionnaire", {
              time: timeRequiredForAppointment,
            })}
      </Text>
      <Link
        to={{
          pathname: constants.routes.questionnaireForm,
          search: qs.stringify(
            {
              officeId,
              doctorId,
              memberId,
              isEdit: isQuestionnaireFilled || null,
            },
            { skipNull: true }
          ),
        }}
      >
        {!isQuestionnaireFilled ? (
          <button
            className="button button-round"
            title={t("patient.fillInTheQuestionnaire")}
          >
            {t("patient.fillInTheQuestionnaire")}
          </button>
        ) : (
          <button
            className={
              "button button-round button-border " + styles["border-green"]
            }
            title={t("patient.viewEdit")}
          >
            {t("patient.viewEdit")}
          </button>
        )}
      </Link>
    </div>
  );
};

export default withTranslation()(QuestionnaireCard);
