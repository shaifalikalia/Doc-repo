import constants from "../../constants";
import React from "react";
import { Trans, withTranslation } from "react-i18next";
import SubstituteSelector from "./SubstituteSelector";

const SubstituteSelectorFactory = ({
  staff,
  event,
  onAction,
  isActionExecuting,
  onCancel,
  errorMessage,
  onClearErrorMessage,
  t,
}) => {
  const text = constructText(event, t);
  return (
    <SubstituteSelector
      staff={staff}
      event={event}
      text={text}
      onCancel={onCancel}
      onAction={onAction}
      isActionExecuting={isActionExecuting}
      errorMessage={errorMessage}
      onClearErrorMessage={onClearErrorMessage}
    />
  );
};

const constructText = (event, t) => {
  switch (event) {
    case constants.staffActionEvents.deactivation:
      return {
        title: t("accountOwner.deactivateStaff"),
        officeSelectionStep: {
          description: () => (
            <Trans
              i18nKey="accountOwner.officeSelectionDescription"
              values={{ action: "deactivate" }}
            >
              This person is an <strong>‘Account Admin’</strong> for this
              office. Do you want to deactivate this person from this office
              only or all offices?
            </Trans>
          ),
          option1: t("accountOwner.officeSelectionOption1", {
            action: "Deactivate",
          }),
          option2: t("accountOwner.officeSelectionOption2", {
            action: "Deactivate",
          }),
        },
      };

    case constants.staffActionEvents.removal:
      return {
        title: t("accountOwner.removeStaff"),
        officeSelectionStep: {
          description: () => (
            <Trans
              i18nKey="accountOwner.officeSelectionDescription"
              values={{ action: "remove" }}
            >
              This person is an <strong>‘Account Admin’</strong> for this
              office. Do you want to remove this person from this office only or
              all offices?
            </Trans>
          ),
          option1: t("accountOwner.officeSelectionOption1", {
            action: "Remove",
          }),
          option2: t("accountOwner.officeSelectionOption2", {
            action: "Remove",
          }),
        },
      };

    case constants.staffActionEvents.removalAsAdmin:
      return {
        title: t("accountOwner.removeAsAnAccountAdmin"),
        officeSelectionStep: {
          description: () => (
            <Trans
              i18nKey="accountOwner.officeSelectionDescription"
              values={{ action: "remove", role: "as an Admin " }}
            >
              This person is an <strong>‘Account Admin’</strong> for this
              office. Do you want to remove this person as an Admin from this
              office only or all offices?
            </Trans>
          ),
          option1: t("accountOwner.officeSelectionOption1", {
            action: "Remove",
            role: "as an Admin ",
          }),
          option2: t("accountOwner.officeSelectionOption2", {
            action: "Remove",
            role: "as an Admin ",
          }),
        },
      };

    default:
      throw new Error(`Prop 'event' is required.`);
  }
};

export default withTranslation()(SubstituteSelectorFactory);
