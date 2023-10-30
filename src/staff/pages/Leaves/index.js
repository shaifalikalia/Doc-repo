import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import Table from "components/table";
import Select from "react-select";
import styles from "./Leaves.module.scss";
import "./Leaves.scss";
import { Link } from "react-router-dom";
import Empty from "components/Empty";
import useRemoveCache from "hooks/useRemoveCache";
import { Fragment } from "react";
import Loader from "components/Loader";
import moment from "moment/moment";
import { setStorage, getStorage } from "utils";
import useHandleApiError from "hooks/useHandleApiError";
import { useStaffLeaveListing } from "repositories/leave-repository";
import { useWarningDetails } from "repositories/office-repository";
import constants from "../../../constants";
import CustomModal from "components/CustomModal";

const PAGE_SIZE = 6;
const WORD_LIMIT = 60;

const Leaves = ({ t, officeId, userId }) => {
  const cacheValue = getStorage(constants.Leave.cache.staffLeavelisting);
  const staffLeaveListStatus = constants.LeaveStatus;
  const staffLeaveTypeStatus = constants.LeaveTypeStatus;
  const [staffLeavelist, setStaffLeavelist] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [pageNumber, setPageNumber] = useState(cacheValue?.pageNumber || 1);
  const [year, setYear] = useState(
    cacheValue?.year || new Date().getFullYear()
  );

  const {
    data,
    error: isError,
    isLoading,
    isFetching,
  } = useStaffLeaveListing(officeId, userId, year, pageNumber, PAGE_SIZE);
  const { data: warningData } = useWarningDetails(officeId);

  let totalItems = data?.pagination?.totalPages * PAGE_SIZE;
  const leaveWarningData = {
    leavewarning: warningData?.showWarningMessageForLeaveRequest,
    numberofdays: warningData?.leaveRequestNoticePeriod,
    numberofdaysnotice:
      warningData?.showWarningMessageForLeaveRequestWhenDurationIsGreaterThan,
  };

  useHandleApiError(isLoading, isFetching, isError);

  useEffect(() => {
    setStorage(constants.Leave.cache.staffLeavelisting, {
      pageNumber: pageNumber,
      year: year,
    });
  }, [pageNumber, year]);

  useEffect(() => {
    if (data?.data) {
      setStaffLeavelist(data.data?.leave);
    }
  }, [data]);

  const customizeText = (text) => {
    if (!text) return "--";

    if (text?.length < WORD_LIMIT) {
      return text;
    }
    return text.slice(0, WORD_LIMIT).concat("...");
  };

  useRemoveCache([], constants.Leave.cache.staffLeavelisting);

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

  const updatePageNumber = (page) => {
    setPageNumber(page);
  };

  const handleSelectedYear = (item) => {
    setYear(item?.value);
    updatePageNumber(1);
  };

  const handleStaffLeaveListStatus = (statusId) => (
    <>
      {statusId === staffLeaveListStatus[1].value && (
        <span>{t("pending")}</span>
      )}
      {statusId === staffLeaveListStatus[2].value && (
        <span>{t("staffTimesheet.approved")}</span>
      )}
      {statusId === staffLeaveListStatus[3].value && (
        <span>{t("rejected")}</span>
      )}
    </>
  );

  const handleStaffLeaveTypeStatus = (leaveType) => (
    <>
      {leaveType === staffLeaveTypeStatus[1]?.value && (
        <span>{t("staffLeaves.casual")}</span>
      )}
      {leaveType === staffLeaveTypeStatus[2]?.value && (
        <span>{t("staffLeaves.medical")}</span>
      )}
      {leaveType === staffLeaveTypeStatus[3]?.value && (
        <span>{t("staffLeaves.vacation")}</span>
      )}
    </>
  );

  const columns = [
    {
      attrs: { datatitle: t("staffLeaves.from") },
      dataField: "from",
      text: t("staffLeaves.from"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span>{row.fromDate ? moment(row.fromDate).format("ll") : "--"}</span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffLeaves.to") },
      dataField: "to",
      text: t("staffLeaves.to"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span>{row.toDate ? moment(row.toDate).format("ll") : "--"}</span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffLeaves.duration") },
      dataField: "duration",
      text: t("staffLeaves.duration"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span>{row.duration ? row.duration : "--"}</span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffLeaves.leaveType") },
      dataField: "leaveType",
      text: t("staffLeaves.leaveType"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span>
            {row?.leaveType ? handleStaffLeaveTypeStatus(row.leaveType) : "--"}
          </span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffLeaves.status") },
      dataField: "status",
      text: t("staffLeaves.status"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span>
            {row?.status ? handleStaffLeaveListStatus(row.status) : "--"}
          </span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffLeaves.reason") },
      dataField: "counter",
      text: t("staffLeaves.reason"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <div className="status-div">
            <span className="status">{customizeText(row.description)}</span>
            {row?.description?.length >= WORD_LIMIT && (
              <span
                className="link-btn"
                onClick={() => {
                  setSelectedReason(row.description);
                }}
              >
                Read More
              </span>
            )}
          </div>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffLeaves.reasonForRejection") },
      dataField: "reasonForRejection",
      text: t("staffLeaves.reasonForRejection"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          {row?.comment && (
            <div className="status-div">
              <span className="status">{customizeText(row?.comment)}</span>
              {row?.description?.length >= WORD_LIMIT && (
                <span
                  className="link-btn"
                  onClick={() => {
                    setSelectedReason(row.description);
                  }}
                >
                  Read More
                </span>
              )}
            </div>
          )}
        </Fragment>
      ),
    },
  ];

  const renderListing = () => (
    <div className="table-td-last-50 leaves-table shadow-responsive">
      {!!staffLeavelist?.length ? (
        <Table
          keyField="id"
          data={staffLeavelist}
          columns={columns}
          handlePagination={(e) => setPageNumber(e)}
          pageNumber={pageNumber}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
        />
      ) : (
        <Empty Message={t("noRecordFound")} />
      )}
    </div>
  );

  return (
    <>
      <div className={"leaves-page " + styles["leaves-page"]}>
        {isLoading && <Loader />}
        {leaveWarningData.leavewarning && (
          <div className={styles["alert-box"]}>
            <div className={styles["alert-img"]}>
              <img
                src={require("assets/images/alert-circle-black.svg").default}
                alt="icon"
              />
            </div>
            <div>
              {t("staffLeaves.alertMessage", {
                days: leaveWarningData.numberofdaysnotice,
                month: leaveWarningData.numberofdays / 30,
              })}
            </div>
          </div>
        )}
        <div className="d-md-flex justify-content-between align-items-center ">
          <div className="member-filter review-rating-filter all-option custom-scroll">
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
          <Link to={`/apply-leaves/${officeId}`}>
            <button
              className="button button-round button-shadow w-sm-100 "
              title={t("staffLeaves.applyLeave")}
            >
              {t("staffLeaves.applyLeave")}
            </button>
          </Link>
        </div>
        {renderListing()}
      </div>
      {selectedReason && (
        <CustomModal
          isOpen={!!selectedReason}
          setIsOpen={() => setSelectedReason(null)}
          title={t("staffLeaves.reason")}
          subTitle1={selectedReason}
        />
      )}
    </>
  );
};

export default withTranslation()(Leaves);
