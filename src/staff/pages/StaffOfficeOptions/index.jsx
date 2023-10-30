import React, { useState, useEffect } from "react";
import Page from "components/Page";
import { Col, Row } from "reactstrap";
import styles from "./StaffOfficeOptions.module.scss";
import timeSheetIcon from "./../../../assets/images/icTimeSheets.svg";
import contractsIcon from "./../../../assets/images/contracts.svg";
import accountIcon from "./../../../assets/images/accountadmin.svg";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import constants from "../../../constants";
import { motion } from "framer-motion";
import { useOfficeDetail } from "repositories/office-repository";
import { useSelector } from "react-redux";
import useSubscriptionAccess from "hooks/useSubscriptionAccess";
import { decodeId } from "utils";

function StaffOfficeOptions({ history, location, match, t }) {
  const { redirectWithCheck, isModuleDisabledClass } = useSubscriptionAccess();
  const modulesAccess = useSelector((prev) => prev);
  const [selectedPlanFeature, setSelectedPlanFeature] = useState({});

  const goBack = () => history.push(constants.routes.accountOwner.offices);
  const profile = useSelector((state) => state.userProfile.profile);

  let officeName = null;
  let isAdmin = false;

  if (
    location.state &&
    location.state.officeData &&
    location.state.officeData.officeName
  ) {
    officeName = location.state.officeData.officeName;
  }

  if (
    location.state &&
    location.state.officeData &&
    location.state.officeData.isAdmin
  ) {
    isAdmin = location.state.officeData.isAdmin;
  }

  const { isLoading, data } = useOfficeDetail(decodeId(match.params.officeId));
  if (!isLoading && data) {
    officeName = data.name;
  }

  useEffect(() => {
    if (modulesAccess) getFormContractsModuleAccess();
  }, [modulesAccess, data]);

  const getFormContractsModuleAccess = () => {
    try {
      const subscription = modulesAccess?.Subscription;
      let selectedPlanData;
      if (subscription?.length) {
        selectedPlanData = subscription?.find(
          (val) => val?.ownerId === data?.ownerId
        );
        setSelectedPlanFeature(selectedPlanData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Page
      onBack={goBack}
      isTitleLoading={!officeName && isLoading}
      title={officeName || (data && data.name)}
      className={styles["page"]}
    >
      <Row>
        <Col lg="4">
          {" "}
          <Card
            to={constants.routes.staff.timesheet.replace(
              ":officeId",
              match.params.officeId
            )}
            icon={timeSheetIcon}
            title={t("staff.myTimesheetsLeaves")}
            data={location.state}
          />
        </Col>
        {data && !data.isTempOffice && (
          <Col
            lg="4"
            className={isModuleDisabledClass(
              constants.moduleNameWithId.formAndContracts,
              selectedPlanFeature
            )}
          >
            <Card
              to={constants.routes.staff.officeContracts.replace(
                ":officeId",
                match.params.officeId
              )}
              icon={contractsIcon}
              redirectTo={() =>
                redirectWithCheck(
                  {
                    pathname: constants.routes.staff.officeContracts.replace(
                      ":officeId",
                      match.params.officeId
                    ),
                    state: location.state,
                  },
                  !!isModuleDisabledClass(
                    constants.moduleNameWithId.formAndContracts,
                    selectedPlanFeature
                  )
                )
              }
              title={t("contracts.formsAndContract")}
              data={location.state}
            />
          </Col>
        )}
        {profile && isAdmin && (
          <Col lg="4">
            <Card
              to={constants.routes.staff.officeAdmin.replace(
                ":officeId",
                match.params.officeId
              )}
              icon={accountIcon}
              title={t("adminControls")}
              data={location.state}
            />
          </Col>
        )}
      </Row>
    </Page>
  );
}

function Card({ to, icon, title, data, redirectTo }) {
  if (redirectTo) {
    return (
      <motion.div
        whileHover={{ scale: constants.animation.hoverScale }}
        whileTap={{ scale: constants.animation.hoverScale }}
      >
        <span onClick={redirectTo} className="pointer">
          <div className={styles["card"]}>
            <img className={`${styles["icon"]} mr-2`} src={icon} alt="icon" />
            <h4>{title}</h4>
          </div>
        </span>
      </motion.div>
    );
  }
  return (
    <motion.div
      whileHover={{ scale: constants.animation.hoverScale }}
      whileTap={{ scale: constants.animation.hoverScale }}
    >
      <Link
        to={{
          pathname: to,
          state: data,
        }}
      >
        <div className={styles["card"]}>
          <img className={`${styles["icon"]} mr-2`} src={icon} alt="icon" />
          <h4>{title}</h4>
        </div>
      </Link>
    </motion.div>
  );
}

export default withTranslation()(StaffOfficeOptions);
