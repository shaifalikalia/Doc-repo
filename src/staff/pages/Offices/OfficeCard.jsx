import React, { Fragment } from "react";
import styles from "./Offices.module.scss";
import { withTranslation } from "react-i18next";
import addressIcon from "./../../../assets/images/address-icon.svg";
import defaultImg from "./../../../assets/images/default-image.svg";

import { useHistory } from "react-router-dom";
import { removeDeactivatedOffice } from "repositories/office-repository";
import constants from "./../../../constants";
import { motion } from "framer-motion";
import { useState } from "react";
import RequestApprovalModal from "./components/RequestApprovalModal";
import { setStorage, handleError, encodeId } from "utils";
import toast from "react-hot-toast";
import FamilyModal from "patient-scheduling/pages/FamilyMembers/components/AddedMembers/FamilyModal";

const animationVariant = {
  hidden: { y: 50, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

function OfficeCard(props) {
  const {
    officeId,
    name,
    officeData,
    t,
    image,
    isAdmin,
    designation,
    numberOfPendingRequestsApprovals,
    jobType,
    isVirtualOffice,
    isUserRemovedFromOffice,
    hasOwnerPackageExpired,
    isActive,
    isUserActiveOfficeStaff,
    ownerId,
    handleDelete,
    key,
    location,
  } = props;

  const history = useHistory();
  let { address } = props;
  if (!address) {
    address = <i>{t("staff.addressNotAddedByTheAccountOwner")}</i>;
  }

  const [isRequestApprovalModalOpen, setIsRequestApprovalModalOpen] =
    useState(false);
  const [rejectAprrovalCount, setRejectAprrovalCount] = useState(
    numberOfPendingRequestsApprovals
  );
  const [confirmModal, setConfirmModal] = useState(false);

  const redirect = (pathname) => {
    setStorage(constants.sessionStoragecache.officeKey, ownerId);
    history.push(pathname);
  };

  const deleteDeactivatedOffice = () => {
    setConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (officeId) {
        const payload = {
          officeId: officeId,
        };

        let res = await removeDeactivatedOffice(payload);
        setConfirmModal(false);
        handleDelete(officeId);
        toast.success(res.message);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setConfirmModal(false);
    }
  };

  const isAdminCard = () => {
    return (
      <div className={styles["staff-office-card"]} key={key}>
        <span
          className="no-underline pointer"
          onClick={() =>
            redirect({
              pathname: constants.routes.staff.officeOptions.replace(
                ":officeId",
                encodeId(officeId)
              ),
              state: {
                officeData: officeData,
              },
            })
          }
        >
          <div className={styles["office-card-header"]}>
            <div className={styles["img-box"]}>
              <img src={image || defaultImg} alt="office" />
            </div>
            <div className={styles["text-box"]}>
              <h4 className={styles["office-title"]}>{name}</h4>
              <div className={styles["office-desc"]}>
                <img src={addressIcon} alt="address icon" className="mr-2" />
                <p>{address}</p>
              </div>
            </div>
          </div>
        </span>
        {isAdmin && (
          <div className={styles["office-setting-icon"]}>
            <img
              src={require("assets/images/office/office-setting.svg").default}
              alt="icon"
            />
          </div>
        )}

        <div className={styles["staff-detail-card"]}>
          <ul>
            {!isVirtualOffice && (
              <Fragment>
                {isAdmin && (
                  <li>
                    <img
                      src={require("assets/images/office/mail.svg").default}
                      alt="icon"
                    />{" "}
                    <span
                      onClick={() => {
                        setIsRequestApprovalModalOpen(true);
                      }}
                      className="link-btn font-regular font-11"
                    >
                      {`${
                        rejectAprrovalCount || numberOfPendingRequestsApprovals
                      } Pending Requests & Approvals`}
                    </span>
                  </li>
                )}
                <li>
                  <img
                    src={require("assets/images/office/suitcase.svg").default}
                    alt="icon"
                  />
                  {designation}
                </li>
                <li>
                  <img
                    src={require("assets/images/office/hours.svg").default}
                    alt="icon"
                  />
                  {jobType == constants.JOBTYPE.Temporary
                    ? t("temporary")
                    : t("permanent")}{" "}
                </li>
                {(!isUserActiveOfficeStaff ||
                  isUserRemovedFromOffice ||
                  hasOwnerPackageExpired ||
                  !isActive) && (
                  <li
                    className={`${styles["deleted-office"]} cursor-pointer`}
                    onClick={() => deleteDeactivatedOffice()}
                  >
                    <img
                      src={require("assets/images/delete-red.svg").default}
                      alt="icon"
                    />
                    {t("deactivatedOffice")}
                  </li>
                )}
              </Fragment>
            )}

            {isVirtualOffice && (
              <li>
                <img
                  src={require("assets/images/office/suitcase.svg").default}
                  alt="icon"
                />
                {t("ReferenceOffice")}
              </li>
            )}
          </ul>
        </div>
        {isRequestApprovalModalOpen && (
          <RequestApprovalModal
            isRequestApprovalModalOpen={isRequestApprovalModalOpen}
            setIsRequestApprovalModalOpen={setIsRequestApprovalModalOpen}
            officeId={officeId}
            onUpdate={(updatedCount) => setRejectAprrovalCount(updatedCount)}
          />
        )}
        {confirmModal && (
          <FamilyModal
            isFamilyModalOpen={confirmModal}
            setIsFamilyModalOpen={setConfirmModal}
            title={t("accountOwner.removeOffice")}
            subTitle2={t("accountOwner.removeOfficeConfirmation")}
            leftBtnText={t("ok")}
            rightBtnText={t("cancel")}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    );
  };

  return (
    <motion.div
      variants={animationVariant}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1.05 }}
      className="col-md-6 col-lg-4"
    >
      {isAdminCard()}
    </motion.div>
  );
}

export default withTranslation()(OfficeCard);
