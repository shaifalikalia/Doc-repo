import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import Text from "components/Text";
import moment from "moment/moment";
import { withTranslation } from "react-i18next";
import { addBackupStaff } from "repositories/leave-repository";
import toast from "react-hot-toast";
import styles from "./../StaffListingLeaves.module.scss";
import BackupStaffModal from "../../Leaves/component/BackupStaffModal";
import TemporaryStaffModal from "../../Leaves/component/TemporaryStaffModal";

const LeavesTaskCard = ({
  t,
  leaveDetail,
  key,
  leaveListStatus,
  leaveListTypeStatus,
  handleAcceptRejectLeave,
  checkBoxOnChange,
  checkBoxValue,
  checkBoxCheckedValue,
  officeId,
  onRefetch,
}) => {
  const [isAddBackupStaff, setIsAddBackupStaff] = useState(false);
  const [backupStaffRadio, setBackupStaffRadio] = useState(1);
  const [isClickedOnChangeButton, setIsClickedOnChangeButton] = useState(false);
  const [isBackupStaffModalOpen, setIsBackupStaffModalOpen] = useState(false);
  const [isTemporaryStaffModalOpen, setIsTemporaryStaffModalOpen] =
    useState(false);

  const radioHandler = (backupStaffRadioValue) => {
    setBackupStaffRadio(backupStaffRadioValue);
  };

  useEffect(() => {
    if (leaveDetail?.status !== leaveListStatus[1].value) {
      setIsTemporaryStaffModalOpen(false);
      setIsBackupStaffModalOpen(false);
      setIsAddBackupStaff(false);
      setIsClickedOnChangeButton(false);
    }
  }, [leaveDetail?.status]);

  const handleStaffLeaveListStatus = (statusId) => (
    <>
      {statusId === leaveListStatus[1].value && (
        <span className={styles["pending"]}>{t("pending")}</span>
      )}
      {statusId === leaveListStatus[2].value && (
        <span className={styles["approved"]}>
          {t("staffTimesheet.approved")}
        </span>
      )}
      {statusId === leaveListStatus[3].value && (
        <span className={styles["rejected"]}>{t("rejected")}</span>
      )}
    </>
  );

  const handleStaffLeaveTypeStatus = (leaveType) => (
    <>
      {leaveType === leaveListTypeStatus[1]?.value && (
        <span>{t("staffLeaves.casual")}</span>
      )}
      {leaveType === leaveListTypeStatus[2]?.value && (
        <span>{t("staffLeaves.medical")}</span>
      )}
      {leaveType === leaveListTypeStatus[3]?.value && (
        <span>{t("staffLeaves.vacation")}</span>
      )}
    </>
  );

  const addBackupStaffMember = async (name, contactNumber, userId) => {
    try {

      let params = {
        leaveId: leaveDetail?.id,
        backupUserId: userId,
        backupName: name,
        backupContactNumber: contactNumber,
      };

      let res = await addBackupStaff(params);
      toast.success(res.message);
      onRefetch();
      setIsTemporaryStaffModalOpen(false);
      setIsBackupStaffModalOpen(false);
      setIsAddBackupStaff(false);
      setIsClickedOnChangeButton(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div key={key}>
      <Card
        className={styles["leaves-task-card"]}
        radius="10px"
        marginBottom="10px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
        cursor="default"
      >
        <div
          className={
            "d-flex justify-content-between " + styles["inner-content"]
          }
        >
          {leaveDetail?.status === leaveListStatus[1].value ? (
            <div className={"ch-checkbox " + styles["checkbox-color"]}>
              <label>
                <input
                  type="checkbox"
                  value={checkBoxValue}
                  checked={checkBoxCheckedValue}
                  onChange={(e) => checkBoxOnChange(e)}
                />
                <span>{leaveDetail?.name ? leaveDetail?.name : "--"}</span>
              </label>
            </div>
          ) : (
            <div className={styles["name"]}>
              <Text
                size="16px"
                marginBottom="15px"
                weight="600"
                color="#587E85"
              >
                {leaveDetail?.name ? leaveDetail?.name : "--"}
              </Text>
            </div>
          )}
          <div className={styles["approval-status"]}>
            {leaveDetail?.status
              ? handleStaffLeaveListStatus(leaveDetail.status)
              : "--"}
          </div>
        </div>
        <div className={styles["content-box"]}>
          <Row>
            <Col sm="3" xs="6">
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("staffLeaves.from")}
              </Text>
              <Text
                size="14px"
                marginBottom="25px"
                weight="600"
                color="#102c42"
              >
                {leaveDetail?.startDate
                  ? moment(leaveDetail.startDate).format("ll")
                  : "--"}
              </Text>
            </Col>
            <Col sm="3" xs="6">
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("staffLeaves.to")}
              </Text>
              <Text
                size="14px"
                marginBottom="25px"
                weight="600"
                color="#102c42"
              >
                {leaveDetail?.endDate
                  ? moment(leaveDetail.endDate).format("ll")
                  : "--"}
              </Text>
            </Col>
            <Col sm="3" xs="6">
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("staffLeaves.duration")}
              </Text>
              <Text
                size="14px"
                marginBottom="25px"
                weight="600"
                color="#102c42"
              >
                {leaveDetail?.duration ? `${leaveDetail.duration} Days` : "--"}
              </Text>
            </Col>
            <Col sm="3" xs="6">
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("staffLeaves.leaveType")}
              </Text>
              <Text
                size="14px"
                marginBottom="25px"
                weight="600"
                color="#102c42"
              >
                {leaveDetail?.leaveType
                  ? handleStaffLeaveTypeStatus(leaveDetail.leaveType)
                  : "--"}
              </Text>
            </Col>
            <Col sm="12" xs="12" className='mb-2'>
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("staffLeaves.backupStaffMember")}
              </Text>
              {leaveDetail?.status !== leaveListStatus[1].value ? (
                <>
                  {leaveDetail?.backupName ? (
                    <>
                      <Text
                        size="14px"
                        marginBottom="25px"
                        weight="600"
                        color="#102c42"
                      >
                        <span className="d-block">
                          {leaveDetail?.backupName}
                        </span>
                        <span className="d-block">
                          {leaveDetail?.backupContactNumber}
                        </span>
                      </Text>
                    </>
                  ) : (
                    <Text
                      size="14px"
                      marginBottom="9px"
                      weight="600"
                      color="#102c42"
                    >
                      <span>{t("staffLeaves.noStaffAdded")}</span>
                    </Text>
                  )}
                </>
              ) : (
                <>
                  {leaveDetail?.backupUserId ? (
                    <>
                      {!isClickedOnChangeButton && (
                        <>
                          <div className="d-flex flex-column">
                            <Text
                              className="d-inline-block"
                              size="14px"
                              marginBottom="25px"
                              weight="600"
                              color="#102c42"
                            >
                              <span className="d-block">
                                {leaveDetail?.backupUserName}
                              </span>
                              <span className="d-block">
                                {leaveDetail?.backupUserContactNumber}
                              </span>
                            </Text>
                            <span
                              className="text-decoration-link mb-2"
                              onClick={() => {
                                setIsAddBackupStaff(true);
                                setIsClickedOnChangeButton(true);
                              }}
                            >
                              {t("change")}
                            </span>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {leaveDetail?.backupName ? (
                        <>
                          {!isClickedOnChangeButton && (
                            <>
                              <div className="d-flex flex-column">
                                <Text
                                  className="d-inline-block"
                                  size="14px"
                                  weight="600"
                                  color="#102c42"
                                >
                                  <span className="d-block">
                                    {leaveDetail?.backupName}
                                  </span>
                                  <span className="d-block">
                                    {leaveDetail?.backupContactNumber}
                                  </span>
                                </Text>
                                <span
                                  className="text-decoration-link mb-2"
                                  onClick={() => {
                                    setIsAddBackupStaff(true);
                                    setIsClickedOnChangeButton(true);
                                  }}
                                >
                                  {t("change")}
                                </span>
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="ch-checkbox">
                          <label className="pb-2 mb-0 pt-0">
                            <input
                              type="checkbox"
                              name="promocodes"
                              onChange={(e) =>
                                setIsAddBackupStaff(!isAddBackupStaff)
                              }
                            />
                            <span> {t("staffLeaves.addBackupStaff")} </span>
                          </label>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {isAddBackupStaff && (
                <>
                  <div
                    className={
                      "d-flex yellow-alert-box w-100 w-md-50 mb-4 rounded-0 mt-0"
                    }
                  >
                    {t("staffLeaves.selectBackupText")}
                  </div>
                  <div className="d-flex justify-content-between w-100 w-md-50">
                    <div className="ch-radio">
                      <label className="mr-5" onClick={(e) => radioHandler(1)}>
                        <input
                          type="radio"
                          name="sendPromoCodeTo"
                          checked={backupStaffRadio === 1}
                          onChange={() => {}}
                        />
                        <span> {t("staffLeaves.internalTempList")} </span>
                      </label>
                    </div>
                    {backupStaffRadio === 1 && (
                      <span
                        className="link-btn py-2 pb-3 pb-md-0"
                        onClick={() => {
                          setIsTemporaryStaffModalOpen(true);
                        }}
                      >
                        {leaveDetail?.backupUserName || leaveDetail?.backupName
                          ? t("staffLeaves.change")
                          : t("staffLeaves.selectStaff")}
                      </span>
                    )}
                  </div>
                  <div className="d-flex justify-content-between w-100 w-md-50">
                    <div className="ch-radio">
                      <label
                        className="pb-2 pt-3"
                        onClick={(e) => radioHandler(2)}
                      >
                        <input
                          type="radio"
                          name="sendPromoCodeTo"
                          checked={backupStaffRadio === 2}
                          onChange={() => {}}
                        />
                        <span>{t("staffLeaves.addBackupStaffManually")}</span>
                      </label>
                    </div>
                    {backupStaffRadio === 2 && (
                      <span
                        className="link-btn py-2"
                        onClick={() => {
                          setIsBackupStaffModalOpen(true);
                        }}
                      >
                        {leaveDetail?.backupUserName || leaveDetail?.backupName
                          ? t("staffLeaves.change")
                          : t("staffLeaves.selectStaff")}
                      </span>
                    )}
                    <div className="d-none">
                      <span className="link-btn py-2">
                        {" "}
                        {t("staffLeaves.change")}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </Col>
            <Col sm="12" xs="12">
              <Text size="12px" marginBottom="5px" weight="400" color="#6f7788">
                {t("staffLeaves.reasonForLeave")}
              </Text>
              <Text size="14px" weight="600" color="#102c42">
                {leaveDetail?.reason ? leaveDetail?.reason : "--"}
              </Text>
            </Col>
            {leaveDetail?.comment && (
              <Col sm="12" xs="12">
                <Text
                  size="12px"
                  marginBottom="5px"
                  marginTop="15px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("staffLeaves.reasonForRejection")}
                </Text>
                <Text size="14px" weight="600" color="#102c42">
                  {leaveDetail?.comment ? leaveDetail?.comment : "--"}
                </Text>
              </Col>
            )}
          </Row>
          {leaveDetail?.status === leaveListStatus[1].value && (
            <>
              <button
                className={
                  "button button-round button-shadow mr-md-4 w-sm-100  mb-md-0 " +
                  styles["btn-top"]
                }
                title={t("staffLeaves.approve")}
                onClick={() =>
                  handleAcceptRejectLeave(leaveDetail, true, "Accept")
                }
              >
                {t("staffLeaves.approve")}
              </button>
              <button
                className={
                  "button button-round button-border btn-mobile-link button-dark " +
                  styles["reject-btn"]
                }
                title={t("reject")}
                onClick={() =>
                  handleAcceptRejectLeave(leaveDetail, false, "Reject")
                }
              >
                {t("reject")}
              </button>
            </>
          )}
        </div>
      </Card>
      {isBackupStaffModalOpen && (
        <BackupStaffModal
          isBackupStaffModalOpen={isBackupStaffModalOpen}
          setIsBackupStaffModalOpen={setIsBackupStaffModalOpen}
          handleAdd={(name, contactNo) => addBackupStaffMember(name, contactNo)}
        />
      )}
      {isTemporaryStaffModalOpen && (
        <TemporaryStaffModal
          isTemporaryStaffModalOpen={isTemporaryStaffModalOpen}
          setIsTemporaryStaffModalOpen={setIsTemporaryStaffModalOpen}
          officeId={+officeId}
          leaveId={leaveDetail?.id}
          toDate={moment(leaveDetail?.endDate).format("YYYY-MM-DD")}
          fromDate={moment(leaveDetail?.startDate).format("YYYY-MM-DD")}
          handleAdd={(selectedData) =>
            addBackupStaffMember(
              `${selectedData.firstName} ${selectedData.lastName}`,
              selectedData.contactNumber,
              selectedData.userId
            )
          }
        />
      )}
    </div>
  );
};

export default withTranslation()(LeavesTaskCard);
