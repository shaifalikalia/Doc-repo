import React from "react";
import { Link } from "react-router-dom";
import styles from "./../BasicSubscription.module.scss";
import "./../BasicSubscription.scss";
import { withTranslation } from "react-i18next";
import { Col, Row } from "reactstrap/lib";

const USDPrice = ({ t, editSubscriptionPath, details }) => {
  return (
    <div className={"plan-detail basic-plan pb-0 "}>
      <div className={"container " + styles["basic-container"]}>
        <div className={"plan-detail-box " + styles["plan-detail-box"]}>
          <Row>
            <Col md="6" className={styles["left-container"]}>
              <div className={styles["inner-left"]}>
                <h3> {t("superAdmin.singleOffice")}</h3>
                <ul>
                  <li>
                    <label>{t("superAdmin.setUpFree")}</label>
                    <span>{details?.setupFeeChargeInUsd}</span>
                  </li>
                  <li>
                    <label>{t("superAdmin.officeCharges")}</label>
                    <span>{details?.perOfficeChargeInUsd}</span>
                  </li>
                  <li>
                    <label>{t("superAdmin.permanentStaffCharges")}</label>
                    <span>{details?.perPermanentStaffMemberChargeInUsd}</span>
                  </li>
                  <li>
                    <label>{t("superAdmin.temporaryStaffCharges")}</label>
                    <span>{details?.perTemporaryStaffMemberChargeInUsd}</span>
                  </li>

                  <li className={styles["last-child"]}>
                    <label>{t("superAdmin.perEachPlacement")}</label>
                    <span>{details?.perPlacementChangeInUsd}</span>
                  </li>
                </ul>
              </div>
            </Col>
            <Col md="6" className={styles["right-container"]}>
              <div className={styles["inner-right"] + " " + "px-0"}>
                <h3> {t("superAdmin.multipleOfficePlan")}</h3>
                <ul>
                  <li>
                    <label>{t("superAdmin.setUpFree")}</label>
                    <span>{details?.multiplesetupFeeChargeInUsd}</span>
                  </li>
                  <li>
                    <label>{t("superAdmin.officeCharges")}</label>
                    <span>{details?.multipleperOfficeChargeInUsd}</span>
                  </li>
                  <li>
                    <label>{t("superAdmin.permanentStaffCharges")}</label>
                    <span>
                      {details?.multipleperPermanentStaffMemberChargeInUsd}
                    </span>
                  </li>
                  <li>
                    <label>{t("superAdmin.temporaryStaffCharges")}</label>
                    <span>
                      {details?.multipleperTemporaryStaffMemberChargeInUsd}
                    </span>
                  </li>

                  <li className={styles["last-child"]}>
                    <label>{t("superAdmin.perEachPlacement")}</label>
                    <span>{details?.multipleperPlacementChangeInUsd}</span>
                  </li>
                </ul>
              </div>
            </Col>
            <Col md="6">
              <div className="button-block">
                <Link to={editSubscriptionPath}>
                  <button
                    className="button button-round button-border button-dark"
                    title={t("superAdmin.editSubscription")}
                  >
                    {t("superAdmin.editSubscription")}
                  </button>
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(USDPrice);
