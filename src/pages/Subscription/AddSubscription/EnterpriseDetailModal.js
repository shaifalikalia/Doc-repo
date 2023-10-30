import React, { Fragment, useMemo } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal, ModalBody } from "reactstrap";
import crossIcon from "./../../../assets/images/cross.svg";
import styles from "./PricingPlan.module.scss";
import { Col, Row } from "reactstrap/lib";
import constants, { getcurreny } from "../../../constants";
import { convertIntoTwoDecimal } from "utils";
import "./PricingPlan.scss";

const EnterpriseDetailModal = ({
  t,
  isBasicPriceDetailModalOpen,
  curreny,
  closeBasicPriceDetailModal,
  isProfessionalModelOpen,
  planList,
  planType,
  isEnterPrisePlanExist,
}) => {
  const subscriptionPlans = useMemo(() => {
    if (isEnterPrisePlanExist && planList) {
      return planList.filter((item) => item.id === planType);
    }

    if (!planType || !planList) return [];
    return planList.filter((item) => item.subscriptionPlan === planType);
  }, [planType, planList]);

  let multipleOffice = {};

  if (
    Array.isArray(subscriptionPlans) &&
    subscriptionPlans?.length &&
    isEnterPrisePlanExist
  ) {
    multipleOffice = subscriptionPlans[0];
  }

  const convertIntoDecimalWithCurrency = (value) => {
    const countryCurreny = constants.currenyArray.find(
      (item) => item.value === curreny
    );
    return `${countryCurreny?.name} ${convertIntoTwoDecimal(value)}`;
  };

  return (
    <Modal
      isOpen={isBasicPriceDetailModalOpen || isProfessionalModelOpen}
      toggle={closeBasicPriceDetailModal}
      className="modal-dialog-centered basic-price-detail-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeBasicPriceDetailModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <div className={"plan-detail " + styles["plan-detail"]}>
          <Row>
            <Col md="12" className={styles["right-container"]}>
              <div className={"plan-detail-box " + styles["plan-detail-box"]}>
                <div
                  className={
                    "d-flex justify-content-between align-items-center " +
                    styles["accordian"]
                  }
                >
                  <h3> {t("accountOwner.multipleOffice")}</h3>
                </div>

                <SubscriptionFeatures
                  details={multipleOffice}
                  t={t}
                  convertIntoDecimalWithCurrency={
                    convertIntoDecimalWithCurrency
                  }
                  curreny={curreny}
                />
              </div>
            </Col>
            <Col md="12">
              <div className="alert-img-icon">
                <div className="alert-image">
                  {" "}
                  <img
                    src={
                      require("assets/images/alert-circle-black.svg").default
                    }
                    alt="icon"
                  />{" "}
                </div>
                <div className="alert-content">
                  {t("accountOwner.trialSelectedToast")}
                </div>
              </div>
            </Col>
            <Col md="12">
              <div className="button-block text-center">
                <button
                  className="button button-round button-border button-dark close-button"
                  onClick={closeBasicPriceDetailModal}
                  title={t("close")}
                >
                  {t("close")}
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default withTranslation()(EnterpriseDetailModal);

function SubscriptionFeatures({
  details,
  t,
  convertIntoDecimalWithCurrency,
  curreny,
}) {
  let setupFee = t("userPages.plan.free");
  let countryCurreny = getcurreny(curreny);
  if (curreny === constants.curreny.CAD && details?.setupFeeChargeInCad) {
    setupFee = `${countryCurreny} ${convertIntoTwoDecimal(
      details?.setupFeeChargeInCad
    )}`;
  }
  let officeCharges = `${countryCurreny} ${convertIntoTwoDecimal(
    details?.perOfficeChargeInCad
  )}${t("perMonthperOffice")}`;
  let permanentStaff = `${countryCurreny} ${convertIntoTwoDecimal(
    details?.perPermanentStaffMemberChargeInCad
  )}${t("perMonthperStaff")}`;
  let tempraryStaff = `${countryCurreny} ${convertIntoTwoDecimal(
    details?.perTemporaryStaffMemberChargeInCad
  )}${t("perMonthperStaff")}`;
  let perStaff = `${countryCurreny} ${convertIntoTwoDecimal(
    details?.perPlacementChangeInCad
  )}${t("perStaff")}`;

  if (curreny === constants.curreny.USD) {
    if (details?.setupFeeChargeInUsd) {
      setupFee = `${countryCurreny} ${convertIntoTwoDecimal(
        details?.setupFeeChargeInUsd
      )}`;
    }
    officeCharges = `${countryCurreny} ${convertIntoTwoDecimal(
      details?.perOfficeChargeInUsd
    )}${t("perMonthperOffice")}`;
    permanentStaff = `${countryCurreny} ${convertIntoTwoDecimal(
      details?.perPermanentStaffMemberChargeInUsd
    )}${t("perMonthperStaff")}`;
    tempraryStaff = `${countryCurreny} ${convertIntoTwoDecimal(
      details?.perTemporaryStaffMemberChargeInUsd
    )}${t("perMonthperStaff")}`;
    perStaff = `${countryCurreny} ${convertIntoTwoDecimal(
      details?.perPlacementChangeInUsd
    )}${t("perStaff")}`;
  }

  return (
    <Fragment>
      <div className="feature-list">
        <ul>
          <li>
            <label>{t("accountOwner.oneTimeSetupFee")}</label>
            <span>{setupFee}</span>
          </li>
          <li>
            <label>{t("superAdmin.officeCharges")}</label>
            <span>{officeCharges}</span>
          </li>
          <li>
            <label>{t("superAdmin.permanentStaffCharges")}</label>
            <span>{permanentStaff}</span>
          </li>
          <li>
            <label>{t("superAdmin.temporaryStaffCharges")}</label>
            <span>{tempraryStaff}</span>
          </li>

          <li className={styles["last-child"]}>
            <label>{t("superAdmin.perEachPlacement")}</label>
            <span>{perStaff}</span>
          </li>
        </ul>
      </div>
    </Fragment>
  );
}
