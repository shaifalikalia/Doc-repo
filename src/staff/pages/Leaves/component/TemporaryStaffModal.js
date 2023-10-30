import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import "./../Leaves.scss";
import styles from "./../Leaves.module.scss";
import crossIcon from "../../../../assets/images/cross.svg";
import Text from "components/Text";
import { Modal, ModalBody } from "reactstrap";
import useHandleApiError from "hooks/useHandleApiError";
import { useTemporaryStaffList } from "repositories/leave-repository";
import Empty from "components/Empty";
import Loader from "components/Loader";
import constants from "../../../../constants";

const TemporaryStaffModal = ({
  t,
  isTemporaryStaffModalOpen,
  setIsTemporaryStaffModalOpen,
  officeId,
  leaveId,
  toDate,
  fromDate,
  handleAdd,
}) => {
  const weekDaysList = constants.WeekDays;
  const closeTemporaryStaffModal = () => setIsTemporaryStaffModalOpen(false);
  const [selectedUser, setSelectedUser] = useState({});
  const {
    data,
    isLoading,
    error: isError,
    isFetching,
  } = useTemporaryStaffList(officeId, leaveId, fromDate, toDate);
  useHandleApiError(isLoading, isFetching, isError);

  const tempUserList = data?.data;

  const getAvailableDays = (item) => {
    let availableDays = item?.availableDays;

    weekDaysList.forEach((day) => {
      availableDays = availableDays?.replaceAll(day.id.toString(), day.day);
    });

    return availableDays;
  };

  return (
    <Modal
      isOpen={isTemporaryStaffModalOpen}
      toggle={closeTemporaryStaffModal}
      className={
        "modal-dialog-centered  modal-width-660 backup-modal " +
        styles["temporary-modal"]
      }
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeTemporaryStaffModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <div className={"modal-custom-title " + styles["modal-custom-title"]}>
          <Text size="25px" marginBottom="14px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {t("staffLeaves.selectTemporaryStaff")}
            </span>
          </Text>
        </div>
        {isLoading && <Loader />}
        {!!tempUserList?.length ? (
          <ul className={styles["main-wrapper"]}>
            {tempUserList.map((tempUser) => (
              <li className={styles["radio-wrapper"]} key={tempUser.id}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="ch-radio">
                    <label onClick={() => setSelectedUser(tempUser)}>
                      <input
                        checked={selectedUser.id === tempUser.id}
                        type="radio"
                      />
                      <span>
                        {`${tempUser.firstName} ${tempUser.lastName} (${tempUser.roleCategory})`}

                        <Text size="13px" weight="400" color="#79869A">
                          {tempUser.availableDays
                            ? getAvailableDays(tempUser)
                            : "--"}
                        </Text>
                      </span>
                    </label>
                  </div>
                  <div>
                    {" "}
                    <Text size="13px" weight="400" color="#2D3245">
                      {tempUser.contactNumber}
                    </Text>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty Message={t("noRecordFound")} />
        )}
        {!!tempUserList?.length && (
          <div className={styles["button-container"]}>
            <button
              className="button button-round button-shadow mr-md-4 w-sm-100 mt-md-10 add-top"
              title={t("add")}
              disabled={Object.keys(selectedUser).length === 0}
              onClick={() => handleAdd(selectedUser)}
            >
              {t("add")}
            </button>
            <button
              className={
                "button button-round button-border btn-mobile-link button-dark"
              }
              title={t("cancel")}
              onClick={closeTemporaryStaffModal}
            >
              {t("cancel")}
            </button>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(TemporaryStaffModal);
