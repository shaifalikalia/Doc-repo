import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import Table from "components/table";
import { Fragment } from "react";
import Select from "react-select";
import { Card, Col, Row } from "reactstrap";
import Page from "components/Page";
import Text from "components/Text";
import DatePicker from "react-datepicker";
import { useParams } from "react-router-dom";
import RejectionModal from "./RejectionModal";
import moment from "moment/moment";
import toast from "react-hot-toast";
import useRemoveCache from "hooks/useRemoveCache";
import {
  useTimesheetListing,
  timeSheetDataExport,
  updateTimesheetStatus,
} from "repositories/timesheet-repository";
import { useOfficeDetail } from "repositories/office-repository";
import useHandleApiError from "hooks/useHandleApiError";
import Empty from "components/Empty";
import Loader from "components/Loader";
import {
  convertTimeMinuteToHour,
  convertTimeMinuteToDays,
  handleError,
  setStorage,
  getStorage,
  decodeId,
  encodeId,
} from "utils";
import qs from "query-string";
import constants from "../../../../constants";
import styles from "./../StaffListingTimesheet.module.scss";
import "./../StaffListingTimesheet.scss";
import InfoModal from "./../component/InfoModal";
import FamilyModal from "../../../../patient-scheduling/pages/FamilyMembers/components/AddedMembers/FamilyModal";

const PAGE_SIZE = 4;

const TimesheetDetail = ({ t, history }) => {
  const cacheValue = getStorage(
    constants.Timesheet.cache.timesheetListingCache
  );
  const staffMemberCacheValue = getStorage(
    constants.Timesheet.cache.staffMemberTimesheetlisting
  );
  let { officeId, userId } = useParams();

  officeId = decodeId(officeId);
  userId = decodeId(userId);

  let sheetPageNumber =
    userId !== cacheValue?.timesheetUserId ? 1 : cacheValue?.pageNumber || 1;
  const timesheetListingStatus = constants.TimesheetListingStatus;
  const [timesheetLists, setTimesheetLists] = useState([]);
  const [pageNumber, setPageNumber] = useState(sheetPageNumber);
  const [date, setDate] = useState({
    from: staffMemberCacheValue?.dateFrom
      ? new Date(staffMemberCacheValue?.dateFrom)
      : new Date(moment().startOf("month").format("YYYY-MM-DD")),
    to: staffMemberCacheValue?.dateTo
      ? new Date(staffMemberCacheValue?.dateTo)
      : new Date(),
  });
  const startDate = moment(date.from).format("YYYY-MM-DD");
  const endDate = moment(date.to).format("YYYY-MM-DD");

  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    timesheetListingStatus[0]?.value
  );
  let status = selectedOption;
  const [selectedTimesheetIds, setSelectedTimesheetIds] = useState([]);
  const [selectAllStaff, setSelectAllStaff] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedStaffData, setSelectedStaffData] = useState([]);

  const {
    data,
    error: isError,
    isLoading,
    isFetching,
    refetch,
  } = useTimesheetListing(
    officeId,
    userId,
    pageNumber,
    PAGE_SIZE,
    startDate,
    endDate,
    status
  );
  const { data: officeDetail } = useOfficeDetail(officeId);

  const timesheetData = data?.data?.timesheet_details;
  let totalItems = data?.pagination?.totalPages * PAGE_SIZE;

  useHandleApiError(isLoading, isFetching, isError);

  const onBack = () => {
    history.push(
      constants.routes.accountOwner.timesheet.replace(
        ":officeId",
        encodeId(officeId)
      )
    );
  };

  useEffect(() => {
    //This use effect is very importent to run the column formatter on state changes.
    if (data?.data) {
      const timesheetListsUpdated =
        timesheetLists?.map((val) => {
          val.counter = val.counter + 1;
          return val;
        }) || [];

      setTimesheetLists([...timesheetListsUpdated]);
    }
  }, [selectedTimesheetIds, selectAllStaff]);

  useEffect(() => {
    if (data?.data) {
      let prev = data.data;
      const timesheetListsUpdated =
        prev?.timesheet_details?.timesheetList?.map((val) => {
          val.counter = 1;
          return val;
        }) || [];

      setTimesheetLists(structuredClone([...timesheetListsUpdated]));
    } else {
      setTimesheetLists([]);
    }
  }, [data]);

  useEffect(() => {
    setStorage(constants.Timesheet.cache.timesheetListingCache, {
      dateFrom: date.from,
      dateTo: date.to,
      pageNumber: pageNumber,
      timesheetUserId: userId,
    });
  }, [date, pageNumber, userId]);

  useEffect(() => {
    if (pageNumber === 1) {
      refetch();
    }
  }, []);

  useRemoveCache(
    [
      constants.routes.accountOwner.timesheet,
      constants.routes.staff.timesheetDateDetail,
    ],
    constants.Timesheet.cache.timesheetListingCache
  );

  const updatePageNumber = (page) => {
    setPageNumber(page);
  };

  const toggleAllCheckbox = (e) => {
    let selectedData = e.target.checked ? timesheetLists : [];
    let ids = selectedData.map((val) => val.id);

    setSelectedStaffData(selectedData);
    setSelectedTimesheetIds(ids);
    setSelectAllStaff(e.target.checked);
  };

  const toggleCheckbox = (e, row) => {
    if (!e.target.checked) {
      setSelectedTimesheetIds((prev) =>
        prev?.filter((it) => it !== +e.target.value)
      );
      setSelectedStaffData((prev) =>
        prev?.filter((it) => it.id !== +e.target.value)
      );
    } else {
      setSelectedTimesheetIds((prev) => [...prev, +e.target.value]);
      setSelectedStaffData((prev) => [...prev, row]);
    }
  };

  const changeDate = (obj) => {
    setDate((prev) => ({ ...prev, ...obj }));
    updatePageNumber(1);
  };

  const getHolidays = () => {
    const holidays = timesheetData?.holidayList.map(
      (val) => `${val.title}(${moment(val.date).format("ll")})`
    );

    return holidays?.join(" | ");
  };

  const handleStatus = (item) => {
    setSelectedOption(item?.value);
    updatePageNumber(1);
  };

  const downloadTimesheetExportedData = async () => {
    setShowLoader(true);

    try {
      let res = await timeSheetDataExport(
        officeId,
        startDate,
        endDate,
        userId,
        selectedOption
      );
      res?.file_Url && window.open(res.file_Url, "_self");
    } catch (err) {
      handleError(err);
    } finally {
      setShowLoader(false);
    }
  };

  const manageTimesheetDetailsRouter = (sheetData) => {
    const searchParams = {
      officeId: encodeId(officeId),
      userId: encodeId(userId),
      advanceTimesheetType: sheetData.advanceTimesheetType,
      timesheetId: sheetData.id,
    };

    history.push({
      pathname: constants.routes.staff.timesheetDateDetail,
      search: qs.stringify(searchParams),
    });
  };

  const handleTimesheetStatus = (rowData) => (
    <>
      {rowData && rowData.statusId === timesheetListingStatus[1]?.value && (
        <span>{t("staffTimesheet.pendingForApproval")}</span>
      )}
      {rowData && rowData.statusId === timesheetListingStatus[2]?.value && (
        <span>{t("staffTimesheet.approved")}</span>
      )}
      {rowData && rowData.statusId === timesheetListingStatus[3]?.value && (
        <span>{t("rejected")}</span>
      )}
      {rowData && rowData.statusId === timesheetListingStatus[4]?.value && (
        <span>{t("staffTimesheet.paid")}</span>
      )}
    </>
  );

  const handleAllSelectionStatus = (statusValue) => {
    let notShowInfoPopup = false;

    if (statusValue === timesheetListingStatus[4]?.value.toString()) {
      notShowInfoPopup = selectedStaffData.some(
        (value) =>
          value.statusId.toString() ===
          timesheetListingStatus[2]?.value.toString()
      );
    }

    if (
      statusValue === timesheetListingStatus[2]?.value.toString() ||
      statusValue === timesheetListingStatus[3]?.value.toString()
    ) {
      notShowInfoPopup = selectedStaffData.some(
        (value) =>
          value.statusId.toString() ===
          timesheetListingStatus[1]?.value.toString()
      );
    }

    if (notShowInfoPopup) {
      if (statusValue === timesheetListingStatus[4]?.value.toString()) {
        setConfirmModal(true);
        return;
      }

      if (statusValue === timesheetListingStatus[3]?.value.toString()) {
        setIsRejectionModalOpen(true);
        return;
      }

      updateStatus(statusValue);
    } else {
      setIsInfoModalOpen(true);
    }
  };

  const confirmSubmitRequest = async (statusId, reason) => {
    setConfirmModal(false);
    setIsRejectionModalOpen(false);
    await updateStatus(statusId, null, reason);
  };

  const updateStatus = async (statusId, timesheetId, reason) => {
    setShowLoader(true);

    try {
      let response = await updateTimesheetStatus({
        timesheetId:
          selectedTimesheetIds?.toString() || timesheetId?.toString(),
        statusId: statusId,
        reason: reason ? reason : "",
      });

      refetch();
      toast.success(response?.message);
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setShowLoader(false);
    }

    setSelectedStaffData([]);
    setSelectedTimesheetIds([]);
  };

  const columns = [
    {
      attrs: { datatitle: t("staffTimesheet.date") },
      dataField: "counter",
      text: (
        <Fragment>
          <div>
            <label className="mb-0">
              <span className="py-1"> {t("staffTimesheet.date")}</span>
            </label>
          </div>
        </Fragment>
      ),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <div className="d-flex">
            <div className="ch-checkbox">
              <label>
                <input
                  type="checkbox"
                  value={row.id}
                  checked={selectedTimesheetIds?.includes(row.id)}
                  onChange={(e) => toggleCheckbox(e, row)}
                />
                <span className="text-decoration-none">&nbsp;</span>
              </label>
            </div>
            <div
              className="custom-staff-name"
              onClick={() => manageTimesheetDetailsRouter(row)}
            >
              <span className="cursor-pointer text-decoration-underline">
                {" "}
                {moment(row.timesheetDate).format("ll")}
              </span>
            </div>
          </div>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffTimesheet.started") },
      dataField: "started",
      text: t("staffTimesheet.started"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span>{row.startTime ? row.startTime : "--"}</span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffTimesheet.finished") },
      dataField: "finished",
      text: t("staffTimesheet.finished"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span>{row.endTime ? row.endTime : "--"}</span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffTimesheet.break") },
      dataField: "break",
      text: t("staffTimesheet.break"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span>
            {row.breakTime
              ? `${convertTimeMinuteToHour(row.breakTime)} Hrs`
              : "--"}
          </span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffTimesheet.total") },
      dataField: "total",
      text: t("staffTimesheet.total"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span>
            {row.timeSpent
              ? `${convertTimeMinuteToHour(row.timeSpent)} Hrs`
              : "--"}
          </span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffTimesheet.totalAmount") },
      dataField: "totalAmount",
      text: t("staffTimesheet.totalAmount"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span>
            {row.totalAmountForPayment
              ? `CAD ${row.totalAmountForPayment.toFixed(2)}`
              : "--"}
          </span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffTimesheet.hourlyRate") },
      dataField: "hourlyRate",
      text: t("staffTimesheet.hourlyRate"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span>{row.hourlyRate ? `CAD ${row.hourlyRate}` : "--"}</span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffTimesheet.overtime") },
      dataField: "overtime",
      text: t("staffTimesheet.overtime"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span>
            {row.overtimeInMins
              ? `${convertTimeMinuteToHour(row.overtimeInMins)} Hrs`
              : "--"}
          </span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffTimesheet.status") },
      dataField: "status",
      text: t("staffTimesheet.status"),
      formatter: (cellContent, row, rowIndex) => {
        return (
          <Fragment>
            {row && row.statusId ? handleTimesheetStatus(row) : "--"}
          </Fragment>
        );
      },
    },

    {
      attrs: { datatitle: t("") },
      dataField: "",
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          {row && row.statusId === timesheetListingStatus[2]?.value && (
            <span
              title={t("markAsPaid")}
              className="cursor-pointer link-btn approve"
              onClick={() => {
                setSelectedTimesheetIds([row?.id]);
                setConfirmModal(true);
              }}
            >
              {t("staffTimesheet.markAsPaid")}
            </span>
          )}
          {row && row.statusId === timesheetListingStatus[1]?.value && (
            <>
              <span
                title={t("approve")}
                className="cursor-pointer link-btn mr-4"
                onClick={() =>
                  updateStatus(timesheetListingStatus[2]?.value, row?.id)
                }
              >
                {t("staffTimesheet.approve")}
              </span>
              <span
                className="link-btn reject"
                style={{ color: "#e76f2a" }}
                title="Reject"
                onClick={() => {
                  setSelectedTimesheetIds([row?.id]);
                  setIsRejectionModalOpen(true);
                }}
              >
                <u>{t("reject")}</u>
              </span>
            </>
          )}
        </Fragment>
      ),
    },
  ];

  const renderHeader = () => (
    <>
      {officeDetail && officeDetail.name && (
        <h2 className="page-title heading">{officeDetail.name}</h2>
      )}
      {timesheetData && timesheetData?.name && (
        <h5 className={styles["sub-head"]}>
          {t("staffTimesheet.timesheetsDetailFor") + timesheetData.name}
          {timesheetData && timesheetData?.designation && (
            <span> ({timesheetData.designation})</span>
          )}
        </h5>
      )}
    </>
  );

  const renderHolidayAndFilters = () => (
    <Row>
      <Col md="9" className="order-2 order-md-1">
        <div
          className={
            "d-flex justify-content-between align-items-center " +
            styles["left-main"]
          }
        >
          <div
            className={"d-flex align-items-center " + styles["left-container"]}
          >
            <div className="member-filter review-rating-filter z-index2">
              <Select
                options={timesheetListingStatus}
                classNamePrefix="react-select"
                defaultValue={timesheetListingStatus.find(
                  (item) => item.value === selectedOption
                )}
                className={["react-select-container"]}
                onChange={handleStatus}
              />
            </div>
            <div className={styles["calendar-box"]}>
              <div className="c-field mb-3">
                <label>{t("from")}</label>
                <div className="d-flex inputdate">
                  <DatePicker
                    dateFormat="dd-MM-yyyy"
                    className="c-form-control"
                    selected={date.from}
                    onSelect={(value) => changeDate({ from: value })}
                    maxDate={date.to}
                  />
                </div>
              </div>
              <div className="c-field mb-3">
                <label>{t("to")}</label>
                <div className="d-flex inputdate">
                  <DatePicker
                    popperPlacement="bottom-end"
                    dateFormat="dd-MM-yyyy"
                    className="c-form-control"
                    selected={date.to}
                    onSelect={(value) => changeDate({ to: value })}
                    minDate={date.from}
                    maxDate={new Date()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {timesheetData &&
          timesheetData?.holidayList &&
          timesheetData?.holidayList.length > 0 && (
            <p className={styles["holidays-description"]}>
              <span>{t("staffTimesheet.holidaysDescription")}</span>
              <span className={styles["holidays"]}>{getHolidays()}</span>
            </p>
          )}
        <button
          className={
            "button button-round button-border  button-dark " +
            styles["export-timesheet-btn"]
          }
          onClick={downloadTimesheetExportedData}
          title={t("staffTimesheet.exportTimesheetData")}
        >
          {t("staffTimesheet.exportTimesheetData")}
        </button>
      </Col>
      <Col md="3" className="order-1 order-md-2">
        <img
          className={styles["timesheet-detail-img"]}
          src={
            timesheetData && timesheetData?.profilePic
              ? timesheetData.profilePic
              : require("assets/images/staff-default.svg").default
          }
          alt="icon"
        />
      </Col>
    </Row>
  );

  const renderConsolidatedData = () => (
    <>
      <Card
        className={styles["timesheet-detail-card"]}
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
        cursor="default"
      >
        <div
          className={
            styles["left-side-card"] + " " + styles["left-side-detail-card"]
          }
        >
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.totalHours")}
            </Text>
            <div className={styles["total-hours"]}>
              <Text size="20px" marginBottom="0px" weight="500" color="#FFFFFF">
                {timesheetData?.totalTimeWithBreakDuration
                  ? `${convertTimeMinuteToHour(
                      timesheetData?.totalTimeWithBreakDuration
                    )} Hrs`
                  : "--"}
              </Text>
            </div>
          </div>
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.totalHoursOfPayment")}
            </Text>
            <div className={styles["total-hours"]}>
              <Text size="20px" marginBottom="0px" weight="500" color="#FFFFFF">
                {timesheetData?.totalApprovedMinutes
                  ? `${convertTimeMinuteToHour(
                      timesheetData?.totalApprovedMinutes
                    )} Hrs`
                  : "--"}
              </Text>
            </div>
          </div>
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.totalAmount")}
            </Text>
            <div className={styles["total-hours"]}>
              <Text size="20px" marginBottom="0px" weight="500" color="#FFFFFF">
                {timesheetData?.totalAmount
                  ? `CAD ${timesheetData?.totalAmount.toFixed(2)}`
                  : "--"}
              </Text>
            </div>
          </div>
        </div>
        <div
          className={
            styles["right-side-card"] + " " + styles["right-side-detail-card"]
          }
        >
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.loggedHours")}
            </Text>
            <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
              {timesheetData?.logged
                ? `${convertTimeMinuteToHour(timesheetData?.logged)} Hrs`
                : "--"}
            </Text>
          </div>
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.approved")}
            </Text>
            <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
              {timesheetData?.totalApprovedMinutes
                ? `${convertTimeMinuteToHour(
                    timesheetData?.totalApprovedMinutes
                  )} Hrs`
                : "--"}
            </Text>
          </div>
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.overtime")}
            </Text>
            <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
              {timesheetData?.totalOvertimeInMins
                ? `${convertTimeMinuteToHour(
                    timesheetData?.totalOvertimeInMins
                  )} Hrs`
                : "--"}
            </Text>
          </div>
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.holidays")}
            </Text>
            <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
              {timesheetData?.totalHolidayMinutes
                ? `${convertTimeMinuteToDays(
                    timesheetData?.totalHolidayMinutes
                  ).toFixed(2)} Days`
                : "--"}
            </Text>
          </div>
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.workingDays")}
            </Text>
            <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
              {timesheetData?.workingDays
                ? `${timesheetData?.workingDays} Days`
                : "--"}
            </Text>
          </div>
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.leaves")}
            </Text>
            <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
              {timesheetData?.leaves ? `${timesheetData?.leaves} Days` : "--"}
            </Text>
          </div>
        </div>
      </Card>
      <div
        className={
          "d-block d-md-flex justify-content-between " +
          styles["action-container"]
        }
      >
        {timesheetLists.length > 0 && (
          <div className="d-flex">
            <div className={"ch-checkbox " + styles["ch-checkbox"]}>
              <label>
                <input
                  type="checkbox"
                  checked={
                    timesheetLists.length > 0 &&
                    selectedTimesheetIds.length === timesheetLists.length
                  }
                  onChange={toggleAllCheckbox}
                />
                <span> {t("staffTimesheet.selectAll")}</span>
              </label>
            </div>
            {selectedTimesheetIds?.length > 0 && (
              <span>({selectedTimesheetIds.length})</span>
            )}
          </div>
        )}
        <div>
          {timesheetLists.length > 0 && selectedTimesheetIds.length > 1 && (
            <div>
              <span
                title={t("markAsPaid")}
                className="cursor-pointer link-btn mr-4"
                onClick={() =>
                  handleAllSelectionStatus(
                    timesheetListingStatus[4]?.value.toString()
                  )
                }
              >
                {t("staffTimesheet.markAsPaid")}
              </span>
              <span
                title={t("approve")}
                className="cursor-pointer link-btn mr-4"
                onClick={() =>
                  handleAllSelectionStatus(
                    timesheetListingStatus[2]?.value.toString()
                  )
                }
              >
                {t("staffTimesheet.approve")}
              </span>
              <span
                className="link-btn"
                style={{ color: "#e76f2a" }}
                title="Reject"
                onClick={() =>
                  handleAllSelectionStatus(
                    timesheetListingStatus[3]?.value.toString()
                  )
                }
              >
                <u> {t("reject")}</u>
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderListing = () => (
    <div className="table-td-last-50 timesheet-table shadow-responsive">
      {!!timesheetLists?.length ? (
        <Table
          keyField="id"
          data={timesheetLists}
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
      <Page
        className={"staff-listing-timesheet " + styles["timesheet-page"]}
        onBack={onBack}
      >
        {(isLoading || showLoader) && <Loader />}
        {renderHeader()}
        {renderHolidayAndFilters()}
        {renderConsolidatedData()}
        {renderListing()}
      </Page>
      {confirmModal && (
        <FamilyModal
          isFamilyModalOpen={confirmModal}
          setIsFamilyModalOpen={setConfirmModal}
          title={t("staffTimesheet.markAsPaid")}
          subTitle1={t("staffTimesheet.cannotUndo")}
          subTitle2={t("staffTimesheet.markAsPaidConfirmMsg")}
          leftBtnText={t("Confirm")}
          rightBtnText={t("cancel")}
          onConfirm={() =>
            confirmSubmitRequest(timesheetListingStatus[4]?.value)
          }
        />
      )}
      {isRejectionModalOpen && (
        <RejectionModal
          isRejectionModalOpen={isRejectionModalOpen}
          setIsRejectionModalOpen={setIsRejectionModalOpen}
          staffMemberName={timesheetData.name}
          onReject={(reason) =>
            confirmSubmitRequest(timesheetListingStatus[3]?.value, reason)
          }
        />
      )}
      {isInfoModalOpen && (
        <InfoModal
          isInfoModalOpen={isInfoModalOpen}
          setIsInfoModalOpen={setIsInfoModalOpen}
        />
      )}
    </>
  );
};

export default withTranslation()(TimesheetDetail);
