import useChannelListHeaderState from "Messenger/hooks/useChannelListHeaderState";
import React from "react";
import { withTranslation } from "react-i18next";
import { getFullName } from "../../utils";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import CreateGroupPopup from "../Modals/CreateGroupPopup";
import NewConversationPopup from "../Modals/NewConversationPopup";
import NewGroupPopup from "../Modals/NewGroupPopup";
import OutsideClickHandler from "react-outside-click-handler";
import constants from "../../../../../constants";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoaderIcon } from "react-hot-toast";

const CustomChannelListHeader = ({ t, ...props }) => {
  const {
    setChannelListQuery,
    setFilteredOffices,
    setCurrentChannel,
    filteredOffices,
    externalTabActive,
    selectedOwner,
    currentUser,
    sdk,
    updateChannelList,
  } = props;
  const { profilePic, isStaff, isAccountOwner } = currentUser;
  const stateData = useChannelListHeaderState({
    setChannelListQuery,
    setFilteredOffices,
    filteredOffices,
    setCurrentChannel,
    selectedOwner,
    sdk,
    currentUser,
    externalTabActive,
    t,
    updateChannelList,
  });
  const { state, updateMethods, otherMethods } = stateData;
  const {
    dropdownOfficeOpen,
    dropdownChatOpen,
    isNewGroupPopupOpen,
    isCreateGroupPopupOpen,
    isNewConversationPopupOpen,
    hasMoreOffices,
    offices,
    isOfficeFilterApplied,
  } = state;
  const {
    setIsNewGroupPopupOpen,
    setIsNewConversationPopupOpen,
    setDropdownOfficeOpen,
  } = updateMethods;
  const { toggleChat, toggleOffice, handleFilterOffices, loadMoreOffices } =
    otherMethods;

  return (
    <>
      <div className="profile-owner-header">
        <div className="img-content-box">
          <div className="profile-image">
            <img
              className="img-cover"
              src={
                profilePic ||
                require("assets/images/staff-default-rounded.png").default
              }
              alt="profile-pic"
            />
          </div>

          <div className="profile-info">
            <div className="profile-name">{getFullName(currentUser)}</div>
            {!externalTabActive && !isAccountOwner && isStaff && (
              <div className="account-ownner-desc">
                {t("messenger.theAcountOwnerIs")} {getFullName(selectedOwner)}{" "}
                Office
              </div>
            )}
          </div>
        </div>
        <div className="action-box">
          <span
            className="plus-icon"
            onClick={() =>
              !externalTabActive
                ? setIsNewGroupPopupOpen(true)
                : setIsNewConversationPopupOpen(true)
            }
          >
            <img
              src={require("assets/images/plus-icon-outline.svg").default}
              alt="icon"
            />
          </span>
        </div>
      </div>

      <div className="channel-dropdowm-wrapper mt-2">
        <Dropdown
          isOpen={dropdownChatOpen}
          toggle={toggleChat}
          className="cursor-pointer"
        ></Dropdown>
        {!externalTabActive && (
          <OutsideClickHandler
            onOutsideClick={() => setDropdownOfficeOpen(false)}
          >
            <Dropdown
              isOpen={dropdownOfficeOpen}
              toggle={() => {}}
              className="cursor-pointer"
            >
              <DropdownToggle
                caret={false}
                onClick={toggleOffice}
                className="dropdown-btn"
                tag="div"
              >
                <span>
                  {!filteredOffices.length ||
                  filteredOffices.includes(constants.chat.ALL_OFFICES)
                    ? t("messenger.allOffices")
                    : t("messenger.selectedOffices")}
                </span>
                {isOfficeFilterApplied && (
                  <span className="notification-dot">•</span>
                )}
                <img
                  src={require("assets/images/chat-down-arrow.svg").default}
                  className="caret-img"
                  alt="caret"
                />
              </DropdownToggle>
              <DropdownMenu right id="offices-list">
                <InfiniteScroll
                  dataLength={offices?.length}
                  hasMore={hasMoreOffices}
                  next={loadMoreOffices}
                  scrollableTarget="offices-list"
                  loader={
                    <DropdownItem tag="div">
                      <LoaderIcon style={{ margin: "0 auto" }} />
                    </DropdownItem>
                  }
                  scrollThreshold={0.5}
                >
                  {offices.map((of) => (
                    <DropdownItem key={of.value} tag="div">
                      <div className="ch-checkbox">
                        <label className="mb-0">
                          <input
                            value={of.value}
                            name={of.name}
                            checked={filteredOffices?.includes(of.value)}
                            onChange={(e) => handleFilterOffices(e, of.value)}
                            type="checkbox"
                          />
                          <span> {of.label} </span>
                        </label>
                      </div>
                    </DropdownItem>
                  ))}
                </InfiniteScroll>
              </DropdownMenu>
            </Dropdown>
          </OutsideClickHandler>
        )}
      </div>

      {/* This show the first step of group/one-2-one creation to select the users */}
      {isNewGroupPopupOpen && <NewGroupPopup stateData={stateData} />}
      {/* This shows the 2nd Step of adding image an name to a group */}
      {isCreateGroupPopupOpen && <CreateGroupPopup stateData={stateData} />}
      {/* This is the first and only step of chat creation for external chat */}
      {isNewConversationPopupOpen && (
        <NewConversationPopup stateData={stateData} />
      )}
    </>
  );
};

export default withTranslation()(CustomChannelListHeader);
