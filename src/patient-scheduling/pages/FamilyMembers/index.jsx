import Page from "components/Page";
import React, { useState, Suspense } from "react";
import { withTranslation } from "react-i18next";
import styles from "./familyMembers.module.scss";
import "./familyMembers.scss";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
} from "reactstrap";
import Card from "components/Card";
import Loader from "components/Loader";
import { Link } from "react-router-dom";
import MemberAddedYou from "./components/MemberAddedYou";
import AddedMembers from "./components/AddedMembers";
import { getStorage, setStorage } from "utils";
import constants from "../../../constants";

const FamilyMembers = ({ t, history }) => {
  /* for go back to previous page */
  const onBack = () => history.push(`/doctors`);

  /* Initializations & Declarations */
  const cachedActiveTab = getStorage(
    constants.familyMembers.cache.familyMemberlisting
  );
  const [activeTab, setActiveTab] = useState(
    cachedActiveTab?.activeTab ? cachedActiveTab.activeTab : 1
  );
  const tabName = constants.familyMemberTabStatus;

  /**
   * @method: [manageTab]
   * @description: this method will call when we change the tab
   * @param {string} tab
   */
  const manageTab = (tab) => {
    window.scrollTo(0, 0);
    setActiveTab(tab);
    setStorage(constants.familyMembers.cache.familyMemberlisting, {
      activeTab: tab,
    });
  };

  return (
    <Page className={styles["family-member-page"]} onBack={onBack}>
      <div className={styles["main-title-row"]}>
        <Row className="align-items-center">
          <Col md="7">
            <h2 className={styles["family-member-title"] + " page-title"}>
              {t("patient.familyMembers")}
            </h2>
          </Col>
          <Col md="5" className="text-md-right">
            <Link
              to="/add-new-member"
              title={t("patient.addNewMember")}
              onClick={() => {
                setStorage(constants.familyMembers.cache.familyMemberlisting, {
                  activeTab: 1,
                });
              }}
              className={
                "button button-round button-shadow " + styles["button-mobile"]
              }
            >
              {t("patient.addNewMember")}
            </Link>
          </Col>
        </Row>
      </div>
      <Card>
        <div
          className={
            "common-tabs scheduler-tabs " + styles["family-member-tabs"]
          }
        >
          <Nav tabs className={styles["nav-tabs"]}>
            <NavItem>
              <NavLink
                className={activeTab == tabName.addedMembers ? "active" : ""}
                onClick={() => manageTab(tabName.addedMembers)}
              >
                {t("patient.addedMembers")}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab == tabName.membersAddedYou ? "active" : ""}
                onClick={() => manageTab(tabName.membersAddedYou)}
              >
                {t("patient.membersAddedYou")}
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <Suspense fallback={<Loader />}>
              <TabPane tabId={1}>
                {activeTab === tabName.addedMembers && (
                  <AddedMembers status={activeTab} />
                )}
              </TabPane>
              <TabPane tabId={2}>
                {activeTab === tabName.membersAddedYou && (
                  <MemberAddedYou status={activeTab} />
                )}
              </TabPane>
            </Suspense>
          </TabContent>
        </div>
      </Card>
    </Page>
  );
};

export default withTranslation()(FamilyMembers);
