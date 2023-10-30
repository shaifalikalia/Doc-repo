import React, { useState, useEffect } from "react";
import Page from "components/Page";
import { withTranslation } from "react-i18next";
import constants from "./../../../constants";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { decodeId, setStorage, getStorage, encodeId } from "utils";
import { Suspense } from "react";
import TimesheetForm from "./TimesheetForm";
import useRemoveCache from "hooks/useRemoveCache";
import Toast from "components/Toast/Alert";
import { useSelector } from "react-redux";
import Loader from "components/Loader";
import styles from "./Timesheet.module.scss";
import Leaves from "../Leaves";
import { useOfficeDetail } from "repositories/office-repository";

function Timesheet({ history, match, location, t }) {
  const cachedActiveTab = getStorage(constants.leavesAndTimesheet.cache.list);
  const profile = useSelector((state) => state.userProfile.profile);
  const [activeTab, setActiveTab] = useState(
    cachedActiveTab?.activeTab ? cachedActiveTab.activeTab : "1"
  );
  const { data: officeDetail } = useOfficeDetail(
    decodeId(match.params.officeId)
  );

  const goBack = () => {
    if (location.state && location.state.viewMode) {
      let locationData = location.state;
      locationData["userId"] = profile.id;
      locationData["officeId"] = officeId;
      history.push({
        pathname: "/timesheet-summary",
        state: locationData,
      });
    } else {
      history.push({
        pathname: constants.routes.staff.officeOptions.replace(
          ":officeId",
          encodeId(officeId)
        ),
        state: location.state,
      });
    }
  };

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setStorage(constants.leavesAndTimesheet.cache.list, {
      activeTab: activeTab,
    });
  }, [activeTab]);

  useRemoveCache(
    [constants.routes.staff.applyLeaves],
    constants.leavesAndTimesheet.cache.list
  );

  let officeId;
  try {
    officeId = decodeId(match.params.officeId);
    if (isNaN(officeId)) {
      history.push("/");
      return null;
    }
  } catch (e) {
    history.push("/");
    return null;
  }

  return (
    <Page onBack={goBack}>
      {officeDetail && officeDetail?.name && (
        <h2 className={"page-title " + styles["heading"]}>
          {officeDetail.name}
        </h2>
      )}
      <div className={styles["sub-head"]}>{t("staff.timesheetLeaves")}</div>

      {errorMessage && (
        <Toast
          errorToast
          message={errorMessage}
          handleClose={() => setErrorMessage("")}
        />
      )}
      <div className="account-setup-block pt-0">
        <div className={"form-wrapper " + styles["leave-form-wrapper"]}>
          <div className="common-tabs scheduler-tabs edit-profile-tabs ">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={activeTab === "1" ? "active" : ""}
                  onClick={() => setActiveTab("1")}
                >
                  {t("staff.timesheet")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "2" ? "active" : ""}
                  onClick={() => setActiveTab("2")}
                >
                  {t("staffLeaves.leaves")}
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <Suspense fallback={<Loader />}>
                <TabPane tabId="1">
                  {activeTab === "1" && (
                    <TimesheetForm
                      officeId={officeId}
                      onError={setErrorMessage}
                      t={t}
                      location={location}
                    />
                  )}
                </TabPane>
                <TabPane tabId="2">
                  {activeTab === "2" && (
                    <Leaves userId={profile?.id} officeId={officeId} />
                  )}
                </TabPane>
              </Suspense>
            </TabContent>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default withTranslation()(Timesheet);
