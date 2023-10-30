import React, { Fragment } from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import Text from "components/Text";
import "./ChatModal.scss";
import Loader from "components/Loader";
import { addDefaultStaffRounded } from "utils";
import InfiniteScroll from "react-infinite-scroll-component";

function NewGroupPopup(props) {
  const { t, stateData } = props;
  const { state, otherMethods } = stateData;
  const {
    staffMembers,
    selectedStaff,
    searchText,
    isLoadingStaffList,
    actionInProgress,
    hasMoreStaff,
  } = state;
  const {
    isThisUserSelected,
    handleSelectStaff,
    closeStepOneModal,
    handleStepOne,
    disableOtherUsers,
    loadMoreStaff,
  } = otherMethods;

  return (
    <Fragment>
      <Modal
        isOpen={true}
        toggle={closeStepOneModal}
        className="modal-dialog-centered modal-width-660 new-grop-modal"
        modalClassName="custom-modal"
      >
        {(isLoadingStaffList || actionInProgress) && <Loader />}
        <span className="close-btn" onClick={closeStepOneModal}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        <ModalBody>
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            {t("messenger.newGroup")}
          </Text>
          {!!selectedStaff.length && (
            <Text
              size="12px"
              marginBottom="10px"
              weight="400"
              color="rgb(111, 119, 136)"
            >
              {selectedStaff.length} {t("Selected")}
            </Text>
          )}

          {!!staffMembers && staffMembers.length > 0 && (
            <InfiniteScroll
              dataLength={staffMembers?.length}
              hasMore={hasMoreStaff}
              next={loadMoreStaff}
              scrollableTarget="scrollableDiv"
            >
              <ul
                className={"modal-employee-list group-list"}
                id="scrollableDiv"
              >
                {staffMembers
                  .filter((staff) =>
                    searchText
                      ? staff.name
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      : true
                  )
                  .map((staff, index) => {
                    return (
                      <li key={index}>
                        <div
                          className={`ch-checkbox ${
                            disableOtherUsers(staff) ? "disable-btns" : ""
                          }`}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={isThisUserSelected(staff)}
                              onChange={(e) => handleSelectStaff(e, staff)}
                              disabled={disableOtherUsers(staff)}
                            />
                            <span>
                              <img
                                src={staff.profilePic}
                                alt="profile-pic"
                                onError={addDefaultStaffRounded}
                              />
                              <div>
                                {" "}
                                {staff.name} <small>{staff.officeName}</small>
                              </div>
                            </span>
                          </label>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </InfiniteScroll>
          )}
          {(!staffMembers || !staffMembers.length) && (
            <div className="empty-channel-list text-center col-md-7 mx-auto py-5">
              <img
                src={require("assets/images/empty-icon.svg").default}
                alt="no-staff"
              />
              <h3> {t("messenger.noUserFound")}</h3>
              <p> {t("messenger.noUserFoundDesc")}</p>
            </div>
          )}
          <div className="d-sm-flex btn-box">
            <button
              type="button"
              disabled={!staffMembers || !staffMembers.length}
              onClick={handleStepOne}
              className={
                "button button-round button-shadow  w-sm-100  mr-sm-3 mb-2"
              }
            >
              {selectedStaff.length < 2
                ? t("messenger.startChat")
                : t("messenger.startGroup")}
            </button>

            <button
              type="button"
              onClick={closeStepOneModal}
              className="button mb-md-2 btn-mobile-link button-round button-border button-dark"
            >
              {t("cancel")}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}

export default withTranslation()(NewGroupPopup);
