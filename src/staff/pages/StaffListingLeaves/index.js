import React, { useState, useEffect, useCallback } from "react";
import { withTranslation } from "react-i18next";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import Select from "react-select";
import Page from "components/Page";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";
import useHandleApiError from "hooks/useHandleApiError";
import useRemoveCache from "hooks/useRemoveCache";
import { useOfficeDetail } from "repositories/office-repository";
import {
  useLeaveListing,
  updateLeaveStatus,
} from "repositories/leave-repository";
import { setStorage, getStorage, decodeId, encodeId } from "utils";
import Empty from "components/Empty";
import Loader from "components/Loader";
import toast from "react-hot-toast";
import styles from "./StaffListingLeaves.module.scss";
import "./StaffListingLeaves.scss";
import constants from "../../../constants";
import LeavesTaskCard from "./component/LeavesTaskCard";
import RejectionModal from "../StaffListingTimesheet/component/RejectionModal";
import FamilyModal from "../../../patient-scheduling/pages/FamilyMembers/components/AddedMembers/FamilyModal";

const PAGE_SIZE = 5;
const StaffListingLeaves = ({ t, history, location }) => {
  const profile = useSelector((state) => state?.userProfile?.profile);
  const leaveListStatus = constants.LeaveStatus;
  const leaveListTypeStatus = constants.LeaveTypeStatus;
  const [leaveList, setLeaveList] = useState([]);
  let { officeId } = useParams();
  officeId = decodeId(officeId);

  const cacheValue = getStorage(constants.Leave.cache.leaveListing);
  const [pageNumber, setPageNumber] = useState(cacheValue?.pageNumber || 1);
  const [searchText, setSearchText] = useState("");
  const [apiSearchText, setApiSearchText] = useState("");
  const searchTerm = apiSearchText ? apiSearchText : "";
  const [selectedLeaveIds, setSelectedLeaveIds] = useState([]);
  const [pendingLeaveRecords, setPendingLeaveRecords] = useState([]);
  const [selectedLeaveStatus, setSelectedLeaveStatus] = useState(
    leaveListStatus[0].value
  );
  let status = selectedLeaveStatus;
  const [year, setYear] = useState(
    cacheValue?.year || new Date().getFullYear()
  );
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const { data: officeDetail } = useOfficeDetail(officeId);
  const {
    data,
    error: isError,
    isLoading,
    isFetching,
    refetch,
  } = useLeaveListing(
    officeId,
    status,
    year,
    pageNumber,
    PAGE_SIZE,
    searchTerm
  );

  let totalItems = data?.pagination?.totalPages * PAGE_SIZE;
  useHandleApiError(isLoading, isFetching, isError);

  useEffect(() => {
    setStorage(constants.Leave.cache.leaveListing, {
      pageNumber: pageNumber,
      year: year,
    });
  }, [pageNumber, year]);

  useRemoveCache([], constants.Leave.cache.leaveListing);

  useEffect(() => {
    //This use effect is very importent to run the column formatter on state changes.
    if (data?.data) {
      const leaveListUpdated =
        leaveList?.map((val) => {
          val.counter = val.counter + 1;
          return val;
        }) || [];

      setLeaveList([...leaveListUpdated]);
    }
  }, [selectedLeaveIds]);

  useEffect(() => {
    let dataToUpdate = [];
    if (data?.data) {
      let prev = data.data;
      const leaveListUpdated =
        prev?.leave?.map((val) => {
          val.counter = val.counter || 0 + 1;
          return val;
        }) || [];

      dataToUpdate = structuredClone([...leaveListUpdated]);
      setSelectedLeaveIds([]);
    }

    const pendingRecords = dataToUpdate.filter(
      (val) => val.status === leaveListStatus[1].value
    );
    setPendingLeaveRecords(pendingRecords);
    setLeaveList(dataToUpdate);
  }, [data?.data]);

  const onBack = () => {
    if (profile.isAdmin) {
      history.push({
        pathname: constants.routes.staff.officeAdmin.replace(
          ":officeId",
          encodeId(officeId)
        ),
        state: location.state,
      });
    } else {
      history.push(
        constants.routes.accountOwner.officeOptions.replace(
          ":officeId",
          encodeId(officeId)
        )
      );
    }
  };

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const yearsList = [
    {
      label: nextYear,
      value: nextYear,
    },
  ];
  for (let i = 0; i < 9; i++) {
    yearsList.unshift({
      label: currentYear - i,
      value: currentYear - i,
    });
  }

  const handleSearchText = useCallback(
    debounce((searchTextValue) => {
      setPageNumber(1);
      setApiSearchText(searchTextValue);
    }, 1000),
    []
  );

  const handleChange = (event) => {
    const { value } = event.target;
    setSearchText(value);
    handleSearchText(value);
  };

  const handleSelectedYear = (item) => {
    setYear(item?.value);
    updatePageNumber(1);
  };

  const handleStatus = (item) => {
    setSelectedLeaveStatus(item?.value);
    updatePageNumber(1);
  };

  const updatePageNumber = (page) => {
    setPageNumber(page);
  };

  const acceptRejectLeave = async (actionTypeId, isApproved, reason) => {
    setShowLoader(true);

    if (!actionTypeId) {
      actionTypeId = selectedLeaveIds;
    }

    try {
      await updateLeaveStatus({
        id: actionTypeId.toString(),
        isAccepted: isApproved,
        comment: reason ? reason : "",
      });

      refetch();
      setSelectedLeaveIds([]);
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setShowLoader(false);
    }
  };

  const toggleAllCheckbox = (e) => {
    let selectedData = e.target.checked ? pendingLeaveRecords : [];
    let ids = selectedData.map((val) => val.id);

    setSelectedLeaveIds(ids);
  };

  const toggleCheckbox = (e, row) => {
    if (!e.target.checked) {
      setSelectedLeaveIds((prev) =>
        prev?.filter((it) => it !== +e.target.value)
      );
    } else {
      setSelectedLeaveIds((prev) => [...prev, +e.target.value]);
    }
  };

  const confirmSubmitRequest = async (actionId, isApproved, reason) => {
    setIsRejectionModalOpen(false);
    setConfirmModal(false);
    await acceptRejectLeave(actionId, isApproved, reason);
  };

  const renderListing = () => (
    <div className={styles["card-container"]}>
      {!!leaveList?.length ? (
        leaveList.map((leave) => (
          <LeavesTaskCard
            key={leave.id}
            leaveDetail={leave}
            index={leave.id}
            leaveListStatus={leaveListStatus}
            leaveListTypeStatus={leaveListTypeStatus}
            handleAcceptRejectLeave={(actionData, isApproved, actionType) => {
              if (actionType === "Reject") {
                setSelectedLeaveIds([actionData?.id]);
                setIsRejectionModalOpen(true);
              }

              if (actionType === "Accept") {
                if (actionData?.backupUserId || actionData?.backupName) {
                  acceptRejectLeave(actionData?.id, isApproved);
                } else {
                  setSelectedLeaveIds([actionData?.id]);
                  setConfirmModal(true);
                }
              }
            }}
            isLoading={isLoading}
            checkBoxOnChange={(e) => toggleCheckbox(e, leave)}
            checkBoxValue={leave.id}
            checkBoxCheckedValue={selectedLeaveIds?.includes(leave.id)}
            officeId={officeId}
            onRefetch={() => {
              refetch();
            }}
          />
        ))
      ) : (
        <Empty Message={t("noRecordFound")} />
      )}
    </div>
  );

  return (
    <>
      <Page
        className={"staff-listing-leaves " + styles["staff-listing-leaves"]}
        onBack={onBack}
      >
        {(showLoader || isLoading) && <Loader />}
        {officeDetail && officeDetail.name && (
          <h2 class="page-title heading">{officeDetail.name}</h2>
        )}
        <div className={styles["sub-head"]}>{t("staffLeaves.leaves")}</div>
        <div
          className={
            "d-flex justify-content-between align-items-center " +
            styles["left-main"]
          }
        >
          <div
            className={"d-flex align-items-center " + styles["left-container"]}
          >
            <div
              className={
                "member-filter review-rating-filter all-option " +
                styles["left-inner"]
              }
            >
              <Select
                options={leaveListStatus}
                defaultValue={leaveListStatus.find(
                  (item) => item.value === selectedLeaveStatus
                )}
                className={["react-select-container"]}
                onChange={handleStatus}
                classNamePrefix="react-select"
              />
            </div>

            <div
              className={
                "member-filter review-rating-filter year-option " +
                styles["left-inner"]
              }
            >
              <Select
                options={yearsList}
                defaultValue={{
                  label: cacheValue?.year || new Date().getFullYear(),
                  value: cacheValue?.year || new Date().getFullYear(),
                }}
                className={["react-select-container"]}
                onChange={handleSelectedYear}
                classNamePrefix="react-select"
              />
            </div>
          </div>
          <div className={"search-box " + styles["search"]}>
            <input
              type="text"
              value={searchText}
              onChange={handleChange}
              placeholder={t("accountOwner.searchStaff")}
            />
            <span className="ico">
              <img
                src={require("assets/images/search-icon.svg").default}
                alt="icon"
              />
            </span>
          </div>
        </div>
        <div
          className={
            "d-flex justify-content-between " + styles["action-container"]
          }
        >
          {pendingLeaveRecords.length > 0 && (
            <>
              <div className="d-flex">
                <div className={"ch-checkbox " + styles["ch-checkbox"]}>
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        pendingLeaveRecords.length > 0 &&
                        selectedLeaveIds.length === pendingLeaveRecords.length
                      }
                      onChange={toggleAllCheckbox}
                    />
                    <span> {t("staffTimesheet.selectAll")}</span>
                  </label>
                </div>
                {selectedLeaveIds.length > 0 && (
                  <span className={styles["timesheet-leave-length"]}>
                    ({selectedLeaveIds.length})
                  </span>
                )}
              </div>
            </>
          )}
          {selectedLeaveIds.length > 0 && (
            <div>
              <span
                title={t("approve")}
                className="cursor-pointer link-btn mr-3"
                onClick={() => acceptRejectLeave(selectedLeaveIds, true)}
              >
                {t("staffTimesheet.approve")}
              </span>
              <span
                className="link-btn"
                style={{ color: "#e76f2a" }}
                title="Reject"
                onClick={() => setIsRejectionModalOpen(true)}
              >
                <u> {t("reject")}</u>
              </span>
            </div>
          )}
        </div>
        {renderListing()}
        <PaginationProvider
          pagination={paginationFactory({
            custom: true,
            sizePerPage: PAGE_SIZE,
            totalSize: totalItems,
            page: pageNumber,
            onPageChange: setPageNumber,
          })}
        >
          {({ paginationProps, paginationTableProps }) => {
            return (
              <div className="data-table-block">
                {/* Paginator component needs table to work, this is why we have used it.  */}
                <div style={{ display: "none" }}>
                  <BootstrapTable
                    keyField="id"
                    data={[]}
                    columns={[{ text: "sometext" }]}
                    {...paginationTableProps}
                  />
                </div>
                <div className={"pagnation-block "}>
                  {totalItems > PAGE_SIZE && (
                    <PaginationListStandalone {...paginationProps} />
                  )}
                </div>
              </div>
            );
          }}
        </PaginationProvider>
      </Page>
      {isRejectionModalOpen && (
        <RejectionModal
          isRejectionModalOpen={isRejectionModalOpen}
          setIsRejectionModalOpen={setIsRejectionModalOpen}
          forLeave={true}
          onReject={(reason) =>
            confirmSubmitRequest(selectedLeaveIds, false, reason)
          }
        />
      )}

      {confirmModal && (
        <div className="markaspaidModal">
          <FamilyModal
            isFamilyModalOpen={confirmModal}
            setIsFamilyModalOpen={setConfirmModal}
            title={t("staffLeaves.approveLeave")}
            subTitle1={t("staffLeaves.approveLeaveWithoutAdding")}
            subTitle2={t("staffLeaves.approveLeaveContent")}
            leftBtnText={t("staffLeaves.approve")}
            rightBtnText={t("cancel")}
            onConfirm={() => confirmSubmitRequest(selectedLeaveIds, true)}
          />
        </div>
      )}
    </>
  );
};

export default withTranslation()(StaffListingLeaves);
