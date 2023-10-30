import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import Text from "components/Text";
import { useApprovalsAndRequests } from "repositories/office-repository";
import {
  updateTimesheetStatus,
  updateEditTimesheetRequestStatus,
} from "repositories/timesheet-repository";
import { updateLeaveStatus } from "repositories/leave-repository";
import styles from "./../Offices.module.scss";
import useHandleApiError from "hooks/useHandleApiError";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "components/Loader";
import toast from "react-hot-toast";
import Empty from "components/Empty";
import "./../Offices.scss";
import crossIcon from "../../../../assets/images/cross.svg";
import { Modal, ModalBody, Spinner } from "reactstrap";
import RequestApprovalCard from "./RequestApprovalCard";

const PAGE_SIZE = 100;

const RequestApprovalModal = ({
  t,
  isRequestApprovalModalOpen,
  setIsRequestApprovalModalOpen,
  officeId,
  onUpdate,
}) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [loadData, setLoadData] = useState(false);
  const [pageData, setPageData] = useState({
    recentUpdatesList: [],
    totalItems: 0,
    totalPages: 1,
  });
  const {
    data,
    error: isError,
    isLoading,
    isFetching,
    refetch,
  } = useApprovalsAndRequests(officeId, pageNumber, PAGE_SIZE);
  const { recentUpdatesList, totalItems, totalPages } = pageData;

  /* use to handle API errors */
  useHandleApiError(isLoading, isFetching, isError);

  const closeRequestApprovalModal = () => setIsRequestApprovalModalOpen(false);
  useEffect(() => {
    if (!isLoading && data?.data?.recentUpdates) {
      setPageData((prev) => {
        return {
          totalItems: data?.pagination?.totalItems,
          totalPages: data?.pagination?.totalPages,
          recentUpdatesList: [...data.data.recentUpdates],
        };
      });
    }
  }, [isLoading, data, pageNumber]);

  useEffect(() => {
    onUpdate(data?.data?.count);
  }, [data?.data?.count]);

  const acceptRejectTimesheet = async (timesheetId, statusId, reason) => {
    setLoadData(true);
    try {
      await updateTimesheetStatus({
        timesheetId: timesheetId?.toString(),
        statusId: statusId,
        reason: reason ? reason : null,
      });

      setPageData((prev) => ({
        ...prev,
        recentUpdatesList: prev.recentUpdatesList.filter(
          (item) => item.timesheetId !== timesheetId
        ),
      }));

      refetch();
      setLoadData(false);
    } catch (error) {
      toast.error(error?.message);
      setLoadData(false);
    }
  };

  const acceptRejectLeave = async (actionTypeId, isApproved) => {
    setLoadData(true);
    try {
      await updateLeaveStatus({
        id: actionTypeId.toString(),
        isAccepted: isApproved,
      });
      setPageData((prev) => ({
        ...prev,
        recentUpdatesList: prev.recentUpdatesList.filter(
          (item) => item.leave_Id !== actionTypeId
        ),
      }));

      refetch();
      setLoadData(false);
    } catch (error) {
      toast.error(error?.message);
      setLoadData(false);
    }
  };

  const acceptRejectEditTimesheetRequest = async (actionTypeId, isApproved) => {
    setLoadData(true);
    try {
      await updateEditTimesheetRequestStatus(actionTypeId, isApproved);
      setPageData((prev) => ({
        ...prev,
        recentUpdatesList: prev.recentUpdatesList.filter(
          (item) => item.clockInOutTimeSheetEditRequestId !== actionTypeId
        ),
      }));

      refetch();
      setLoadData(false);
    } catch (error) {
      toast.error(error?.message);
      setLoadData(false);
    }
  };

  return (
    <Modal
      isOpen={isRequestApprovalModalOpen}
      toggle={closeRequestApprovalModal}
      className={
        "modal-dialog-centered  modal-width-660 approval-modal " +
        styles["approval-modal"]
      }
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeRequestApprovalModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody id="scrollableDiv">
        <div
          className={
            "modal-custom-title title-location-center mw-100 " +
            styles["modal-custom-title"]
          }
        >
          <Text size="25px" marginBottom="40px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {t("staffTimesheet.requestandApprovals")}
              {data?.data?.count > 0 && <span>({data?.data?.count})</span>}
            </span>
          </Text>
        </div>
        <div className={styles["card-container"]}>
          {(isLoading || isFetching || loadData) && <Loader />}
          {recentUpdatesList && recentUpdatesList.length > 0 ? (
            <InfiniteScroll
              dataLength={recentUpdatesList.length}
              hasMore={recentUpdatesList.length < totalItems}
              next={() =>
                pageNumber < totalPages && setPageNumber((v) => v + 1)
              }
              scrollableTarget="scrollableDiv"
              loader={
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" className="loader-spinner" />
                </div>
              }
            >
              {recentUpdatesList.map((updateList, index) => (
                <div key={index}>
                  {updateList && (
                    <RequestApprovalCard
                      list={updateList}
                      handleAction={(
                        actionType,
                        actionTypeId,
                        statusId,
                        isApproved
                      ) => {
                        if (actionType === "Timesheet") {
                          acceptRejectTimesheet(actionTypeId, statusId);
                        }
                        if (actionType === "Leave") {
                          acceptRejectLeave(actionTypeId, isApproved);
                        }
                        if (actionType === "EditTimesheetRequest") {
                          acceptRejectEditTimesheetRequest(
                            actionTypeId,
                            isApproved
                          );
                        }
                      }}
                    />
                  )}
                </div>
              ))}
            </InfiniteScroll>
          ) : (
            <Empty Message={t("noRecordFound")} />
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(RequestApprovalModal);
