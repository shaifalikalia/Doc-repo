import Card from "components/Card";
import Page from "components/Page";
import React, { useState, useEffect } from "react";
import constants from "../../../constants";
import { getFullName } from "./utils";

import { SendBirdProvider } from "@sendbird/uikit-react";
import { withTranslation } from "react-i18next";
import "./TeamConversation.scss";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import InternalTabContent from "./components/TabsContent/InternalTabContent";
import ExternalTabContent from "./components/TabsContent/ExternalTabContent";
import useTeamConversationState from "Messenger/hooks/useTeamConversationState";
import useSelectedAccountOwner from "Messenger/hooks/useSelectedAccountOwner";
import SwitchOwnerModal from "accountOwner/pages/Scheduler/components/Modals/SwitchOwnerModal";
import { Redirect } from "react-router-dom";
import { handleError } from "utils";
import MessageDot from "components/MessageDot";
const TeamConversation = ({ t }) => {
  const [hubspotContainer, setContainer] = useState(null);
  const el = document.getElementById("hubspot-messages-iframe-container");

  if (!hubspotContainer && el) {
    setContainer(el);
  }

  useEffect(() => {
    if (hubspotContainer) {
      hubspotContainer?.remove();
    }
    return () => {
      if (hubspotContainer) {
        document?.body?.appendChild?.(hubspotContainer);
      }
    };
  }, [hubspotContainer]);

  const [currentChannel, setCurrentChannel] = useState(null);
  const {
    state: { ownerData, selectedOwner, showSwitchOwnerModal },
    updateMethods: { setShowSwitchOwnerModal },
    otherMethods: { switchNewAccountOwner },
  } = useSelectedAccountOwner({
    localStorageKey: constants.localStorageKeys.selectedChatAccountOwner,
    setCurrentChannel,
  });
  const { state, updateMethods, otherMethods } = useTeamConversationState({
    selectedOwner,
  });
  const { activeTab, profile } = state;
  const { setActiveTab } = updateMethods;
  const { handleBack } = otherMethods;

  let isStaff = false;
  if (profile && profile.role) {
    isStaff = profile.role.systemRole === constants.systemRoles.staff;
  }

  if (profile && profile.role) {
    if (profile.role.systemRole === constants.systemRoles.staff) {
      if (!profile.isAdmin && !profile.isMessenger) {
        return <Redirect to={"/"} />;
      }
    }
  }

  return (
    <div className="messenger-page-content">
      <Page onBack={handleBack}>
        <div className="d-md-flex justify-content-between scheduler-page">
          <h2 className="page-title mb-0">{t("messenger.teamConversation")}</h2>
          {isStaff && ownerData && ownerData.length > 1 && (
            <div className="top-right-text">
              {selectedOwner && (
                <div className="show-text">
                  {t("messenger.selectedAccountOwnerText")}{" "}
                  <b>'{getFullName(selectedOwner)}'</b>
                  <MessageDot />
                </div>
              )}
              <span
                className="link-btn"
                onClick={() => {
                  setShowSwitchOwnerModal(true);
                }}
              >
                {t("messenger.changeAccountOwner")}
              </span>
            </div>
          )}
        </div>
        <Card
          radius="10px"
          marginBottom="18px"
          shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
          cursor="default"
          className={"team-chat-card"}
        >
          <div className="common-tabs messenger-tabs">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={activeTab === "1" ? "active" : ""}
                  onClick={() => {
                    setCurrentChannel(null);
                    setActiveTab("1");
                  }}
                >
                  {t("messenger.internal")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === "2" ? "active" : ""}
                  onClick={() => {
                    if (profile.isAccountOwner || profile.isAdmin) {
                      setCurrentChannel(null);
                      setActiveTab("2");
                    } else {
                      handleError(
                        new Error(t("messenger.externalChatAccessError"))
                      );
                    }
                  }}
                >
                  {t("messenger.external")}
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                {!!profile && activeTab === "1" && (
                  <SendBirdProvider
                    appId={process.env.REACT_APP_SENDBIRD_APP_ID}
                    userId={`${profile.id}`}
                    nickname={getFullName(profile)}
                    profileUrl={profile.profilePic || null}
                    isMentionEnabled={false}
                    isReactionEnabled={false}
                  >
                    <InternalTabContent
                      currentUser={profile}
                      selectedOwner={selectedOwner}
                      currentChannel={currentChannel}
                      setCurrentChannel={setCurrentChannel}
                    />
                  </SendBirdProvider>
                )}
              </TabPane>
              <TabPane tabId="2">
                {!!profile && activeTab === "2" && (
                  <SendBirdProvider
                    appId={process.env.REACT_APP_SENDBIRD_APP_ID}
                    userId={`${profile.id}`}
                    nickname={getFullName(profile)}
                    profileUrl={profile.profilePic || null}
                    isMentionEnabled={false}
                    isReactionEnabled={false}
                  >
                    <ExternalTabContent
                      externalTabActive={true}
                      currentUser={profile}
                      selectedOwner={selectedOwner}
                      currentChannel={currentChannel}
                      setCurrentChannel={setCurrentChannel}
                    />
                  </SendBirdProvider>
                )}
              </TabPane>
            </TabContent>
          </div>
        </Card>
        <SwitchOwnerModal
          subTitle={t("messenger.teamConversation")}
          showSwitchOwnerModal={showSwitchOwnerModal}
          setShowSwitchOwnerModal={setShowSwitchOwnerModal}
          ownerList={ownerData}
          selectedOwner={selectedOwner}
          setSelectedOwner={switchNewAccountOwner}
        />
      </Page>
    </div>
  );
};

export default withTranslation()(TeamConversation);
