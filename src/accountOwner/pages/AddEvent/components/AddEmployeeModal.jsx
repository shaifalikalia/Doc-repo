import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "../../../../assets/images/cross.svg";
import Text from "components/Text";
import styles from "../AddEvent.module.scss";
import userDefaultImage from "./../../../../assets/images/staff-default-rounded.png";

function AddEmployeeModal({
  t,
  issaveEmployeeModalOpen,
  setIsSaveEmployeeModalOpen,
  allMembersList,
  officeType,
  memberIds,
  setMemberIds,
  eventId,
}) {
  const [membersList, setMembersList] = useState(allMembersList);
  const [selectedMembers, setSelectedMembers] = useState(memberIds);
  const [search, setSearch] = useState("");
  const onSearch = (val) => {
    setSearch(val);
    const allMembers = [...allMembersList];
    let filterArray = [];
    filterArray = allMembers.filter((item) => {
      const fullName = `${item.firstName}${item.lastName}`.toLowerCase();
      const reversedFullName =
        `${item.lastName}${item.firstName}`.toLowerCase();
      const trimmedSearchValue = val.replace(/\s+/g, "").toLowerCase();
      return (
        fullName.includes(trimmedSearchValue) ||
        reversedFullName.includes(trimmedSearchValue)
      );
    });
    setMembersList(filterArray);
  };

  const checkMember = (member) => {
    let selectedMemberIds = selectedMembers;
    let dIndex = selectedMemberIds.findIndex((v) => v.userId === member.id);
    if (dIndex > -1) {
      if (selectedMemberIds?.[dIndex]?.isFromDetail === false) {
        selectedMemberIds.splice(dIndex, 1);
      } else {
        selectedMemberIds[dIndex].IsDeleted =
          !selectedMemberIds?.[dIndex].IsDeleted;
      }
    } else {
      selectedMemberIds.push({
        id: 0,
        schedulerEventId: eventId ? eventId : 0,
        userId: member?.id,
        officeId: officeType,
        IsDeleted: false,
        isFromDetail: false,
      });
    }
    setSelectedMembers([...selectedMemberIds]);
  };

  const addDefaultSrc = (ev) => {
    ev.target.src = userDefaultImage;
    ev.target.onerror = null;
  };

  const checkMemberRoleAvaliable = (array, value) => {
    let checkedValue = array?.some(
      (e) => e?.userId === value?.id && e?.IsDeleted === false
    );
    return checkedValue;
  };

  return (
    <>
      <Modal
        isOpen={issaveEmployeeModalOpen}
        toggle={() => setIsSaveEmployeeModalOpen(false)}
        className={
          "modal-dialog-centered " + styles["add-employee-modal-dialog"]
        }
        modalClassName="custom-modal"
      >
        <span
          className="close-btn"
          onClick={() => setIsSaveEmployeeModalOpen(false)}
        >
          <img src={crossIcon} alt="close" />
        </span>
        <ModalBody>
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {" "}
              {t("accountOwner.addEmployees")}
            </span>
          </Text>
          <div className={"search-box " + styles["search-box"]}>
            <input
              type="text"
              placeholder={t("accountOwner.searchByName")}
              value={search}
              onChange={(e) => {
                onSearch(e.currentTarget.value);
              }}
            />
            <span className="ico">
              <img
                src={require("assets/images/search-icon.svg").default}
                alt="icon"
              />
            </span>
          </div>
          <Text
            size="12px"
            marginBottom="10px"
            weight="400"
            color="rgb(111, 119, 136)"
          >
            {selectedMembers?.filter((e) => e?.IsDeleted === false)?.length}{" "}
            {t("Selected")}
          </Text>
          <ul className={"modal-employee-list " + styles["employee-list"]}>
            {membersList.length > 0 &&
              membersList.map((val, key) => (
                <li key={key}>
                  <div className="ch-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={checkMemberRoleAvaliable(selectedMembers, val)}
                        onChange={() => checkMember(val)}
                      />
                      <span>
                        {" "}
                        <img
                          src={val.profilePic || userDefaultImage}
                          onError={addDefaultSrc}
                          alt="profile"
                        />{" "}
                        {val.firstName} {val.lastName}{" "}
                      </span>
                    </label>
                  </div>
                </li>
              ))}
            {membersList.length === 0 && (
              <li>
                <div className="ch-checkbox">
                  <label>{t("noRecordFound")}</label>
                </div>
              </li>
            )}
          </ul>

          <button
            className="button button-round button-shadow mr-sm-3 mb-3 w-sm-100"
            title={t("accountOwner.addEmployees")}
            onClick={() => {
              setMemberIds(selectedMembers);
              setIsSaveEmployeeModalOpen(false);
            }}
          >
            {t("accountOwner.addEmployees")}
          </button>
          <button
            className="button button-round button-border btn-mobile-link button-dark mb-md-3"
            onClick={() => setIsSaveEmployeeModalOpen(false)}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(AddEmployeeModal);
