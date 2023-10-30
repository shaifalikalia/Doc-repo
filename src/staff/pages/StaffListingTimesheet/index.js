import React, { useState, useEffect, useCallback } from "react";
import { withTranslation } from "react-i18next";
import Table from "components/table";
import { Fragment } from "react";
import Select from "react-select";
import moment from "moment/moment";
import { Card } from "reactstrap";
import Page from "components/Page";
import Text from "components/Text";
import styles from "./StaffListingTimesheet.module.scss";
import "./StaffListingTimesheet.scss";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import useRemoveCache from "hooks/useRemoveCache";
import { Link, useParams } from "react-router-dom";
import {
  useStaffTimesheet,
  timeSheetDataExport,
  updateTimesheetStatus,
} from "repositories/timesheet-repository";
import { useOfficeDetail } from "repositories/office-repository";
import useHandleApiError from "hooks/useHandleApiError";
import { debounce } from "lodash";
import Empty from "components/Empty";
import {
  convertTimeMinuteToHour,
  convertTimeMinuteToDays,
  handleError,
  setStorage,
  getStorage,
  decodeId,
  encodeId,
} from "utils";
import Loader from "components/Loader";
import { useSelector } from "react-redux";
import constants from "../../../constants";
import RejectionModal from "./component/RejectionModal";
import InfoModal from "./component/InfoModal";
import FamilyModal from "../../../patient-scheduling/pages/FamilyMembers/components/AddedMembers/FamilyModal";

const PAGE_SIZE = 4;

const StaffListingTimesheet = ({ t, history, location }) => {
  const cacheValue = getStorage(
    constants.Timesheet.cache.staffMemberTimesheetlisting
  );
  const officeId = decodeId(useParams()?.officeId) || null;

  const timesheetStatus = constants.OfficeTimesheetStatus;
  const timesheetDetailStatus = constants.TimesheetListingStatus;

  const [pageNumber, setPageNumber] = useState(cacheValue?.pageNumber || 1);
  const [searchText, setSearchText] = useState(cacheValue?.searchText || null);
  const [apiSearchText, setApiSearchText] = useState(
    cacheValue?.searchText || null
  );
  const [date, setDate] = useState({
    from: cacheValue?.dateFrom
      ? new Date(cacheValue?.dateFrom)
      : new Date(moment().startOf("month").format("YYYY-MM-DD")),
    to: cacheValue?.dateTo ? new Date(cacheValue?.dateTo) : new Date(),
  });

  const [selectedOption, setSelectedOption] = useState(
    cacheValue?.status || timesheetStatus[0].value
  );
  let status = selectedOption;
  const [staffListTimesheet, setStaffListTimesheet] = useState({});
  const [selectedTimesheetIds, setSelectedTimesheetIds] = useState([]);
  const [selectAllStaff, setSelectAllStaff] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedStaffNameList, setSelectedStaffNameList] = useState([]);
  const [selectedStaffData, setSelectedStaffData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const startDate = moment(date.from).format("YYYY-MM-DD");
  const endDate = moment(date.to).format("YYYY-MM-DD");
  const searchTerm = apiSearchText ? apiSearchText : "";

  const {
    data,
    error: isError,
    isLoading,
    isFetching,
    refetch,
  } = useStaffTimesheet(
    officeId,
    pageNumber,
    PAGE_SIZE,
    startDate,
    endDate,
    searchTerm,
    status
  );
  const { data: officeDetail } = useOfficeDetail(officeId);
  const profile = useSelector((state) => state?.userProfile?.profile);

  let totalItems = data?.pagination?.totalPages * PAGE_SIZE;

  useHandleApiError(isLoading, isFetching, isError);

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

  useEffect(() => {
    setStorage(constants.Timesheet.cache.staffMemberTimesheetlisting, {
      dateFrom: date.from,
      dateTo: date.to,
      searchText: searchText || null,
      pageNumber: pageNumber,
      status: selectedOption,
    });
  }, [date, pageNumber, searchText, selectedOption]);

  useEffect(() => {
    if (pageNumber === 1) refetch();
  }, []);

  useRemoveCache(
    [constants.routes.staff.timesheetDetail],
    constants.Timesheet.cache.staffMemberTimesheetlisting
  );

  useEffect(() => {
    //This use effect is very importent to run the column formatter on state changes.
    if (data?.data) {
      const staffListTimesheetUpdated =
        staffListTimesheet?.office_timesheet?.officeTimeSheetDto.map((val) => {
          val.counter = val.counter + 1;
          return val;
        }) || [];

      setStaffListTimesheet((prev) => ({
        ...prev,
        office_timesheet: {
          ...prev.office_timesheet,
          officeTimeSheetDto: staffListTimesheetUpdated,
        },
        counter: Math.random(),
      }));
    }
  }, [selectedTimesheetIds, selectAllStaff]);

  useEffect(() => {
    if (data?.data) {
      let prev = data.data;
      const staffListTimesheetUpdated =
        prev?.office_timesheet?.officeTimeSheetDto?.map((val) => {
          val.counter = 1;
          return val;
        }) || [];

      setStaffListTimesheet(
        structuredClone({
          ...prev,
          office_timesheet: {
            ...prev.office_timesheet,
            officeTimeSheetDto: staffListTimesheetUpdated,
          },
          counter: Math.random(),
        })
      );
    } else {
      setStaffListTimesheet({});
    }
  }, [data]);

  const toggleAllCheckbox = (e) => {
    let selectedData = e.target.checked
      ? staffListTimesheet?.office_timesheet?.officeTimeSheetDto
      : [];
    let ids = selectedData.map((val) => val.timeSheetId);

    setSelectedStaffData(selectedData);
    setSelectedTimesheetIds(ids);
    setSelectAllStaff(e.target.checked);
  };

  const toggleCheckbox = (e, row) => {
    if (!e.target.checked) {
      setSelectedTimesheetIds((prev) =>
        prev?.filter((it) => it !== e.target.value)
      );
      setSelectedStaffData((prev) =>
        prev?.filter((it) => it.timeSheetId !== e.target.value)
      );
    } else {
      setSelectedTimesheetIds((prev) => [...prev, e.target.value]);
      setSelectedStaffData((prev) => [...prev, row]);
    }
  };

  const updateStatus = async (statusId, timesheetId, reason) => {
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
    }

    setSelectedStaffData([]);
    setSelectedTimesheetIds([]);
  };

  const confirmSubmitRequest = async (statusId, reason) => {
    setConfirmModal(false);
    setIsRejectionModalOpen(false);
    await updateStatus(statusId, null, reason);
  };

  const handleAllSelectionStatus = (statusValue) => {
    let notShowInfoPopup = false;

    if (statusValue === timesheetDetailStatus[4]?.value.toString()) {
      notShowInfoPopup = selectedStaffData.some(
        (value) =>
          value.statusId.toString() === timesheetStatus[2].value.toString()
      );
    }

    if (
      statusValue === timesheetDetailStatus[2]?.value.toString() ||
      statusValue === timesheetDetailStatus[3]?.value.toString()
    ) {
      notShowInfoPopup = selectedStaffData.some(
        (value) =>
          value.statusId.toString() === timesheetStatus[1].value.toString()
      );
    }

    if (notShowInfoPopup) {
      if (statusValue === timesheetDetailStatus[4]?.value.toString()) {
        setConfirmModal(true);
        return;
      }

      if (statusValue === timesheetDetailStatus[3]?.value.toString()) {
        const nameList = selectedStaffData
          .filter(
            (item) =>
              item.statusId.toString() === timesheetStatus[1].value.toString()
          )
          .map((item) => item.name);
        setSelectedStaffNameList(nameList.join(", "));
        setIsRejectionModalOpen(true);
        return;
      }

      updateStatus(statusValue);
    } else {
      setIsInfoModalOpen(true);
    }
  };

  const handleStaffTimesheetStatus = (rowData) => (
    <>
      {rowData && rowData.statusId === timesheetStatus[1].value.toString() && (
        <span>{t("staffTimesheet.pendingForApproval")}</span>
      )}
      {rowData && rowData.statusId === timesheetStatus[2].value.toString() && (
        <span>{t("staffTimesheet.approved")}</span>
      )}
      {rowData && rowData.statusId === timesheetStatus[3].value.toString() && (
        <span>{t("rejected")}</span>
      )}
      {rowData && rowData.statusId === timesheetStatus[4].value.toString() && (
        <span>{t("staffTimesheet.partiallyPaid")}</span>
      )}
      {rowData && rowData.statusId === timesheetStatus[5].value.toString() && (
        <span>{t("staffTimesheet.paid")}</span>
      )}
      {rowData && rowData.statusId === timesheetStatus[6].value.toString() && (
        <span>{t("pending")}</span>
      )}
    </>
  );

  const columns = [
    {
      attrs: { datatitle: t("staffTimesheet.name") },
      dataField: "counter",
      text: (
        <Fragment>
          <div>
            <label className="mb-0">
              <span className="py-1"> {t("staffTimesheet.name")}</span>
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
                  value={row.timeSheetId}
                  checked={selectedTimesheetIds.includes(row.timeSheetId)}
                  onChange={(e) => toggleCheckbox(e, row)}
                />
                <span className="text-decoration-none">&nbsp;</span>
              </label>
            </div>
            <div className="custom-staff-name">
              <Link
                to={`/timeheet/${encodeId(
                  officeId
                )}/timesheet-detail/${encodeId(row.userId)}`}
              >
                <span>{row?.name}</span>
              </Link>
            </div>
          </div>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffTimesheet.logged") },
      dataField: "logged",
      text: t("staffTimesheet.logged"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span>
            {row.logged ? `${convertTimeMinuteToHour(row.logged)} Hrs` : "--"}
          </span>
        </Fragment>
      ),
    },
    {
      attrs: { datatitle: t("staffTimesheet.approved") },
      dataField: "approved",
      text: t("staffTimesheet.approved"),
      formatter: (cellContent, row, rowIndex) => {
        return (
          <Fragment>
            <span>
              {row.totalApprovedMinutes
                ? `${convertTimeMinuteToHour(row.totalApprovedMinutes)} Hrs`
                : "--"}
            </span>
          </Fragment>
        );
      },
    },
    {
      attrs: { datatitle: t("staffTimesheet.totalCost") },
      dataField: "totalCost",
      text: t("staffTimesheet.totalCost"),
      formatter: (cellContent, row, rowIndex) => {
        return (
          <Fragment>
            <span>
              {row.totalAmount ? `CAD ${row.totalAmount.toFixed(2)}` : "--"}
            </span>
          </Fragment>
        );
      },
    },
    {
      attrs: { datatitle: t("staffTimesheet.holidays") },
      dataField: "holidays",
      text: t("staffTimesheet.holidays"),
      formatter: (cellContent, row, rowIndex) => {
        return (
          <Fragment>
            <span>
              {row.totalHolidayMinutes
                ? `${convertTimeMinuteToDays(row.totalHolidayMinutes).toFixed(
                    2
                  )} Days`
                : "--"}
            </span>
          </Fragment>
        );
      },
    },
    {
      attrs: { datatitle: t("staffTimesheet.workingDays") },
      dataField: "workingDays",
      text: t("staffTimesheet.workingDays"),
      formatter: (cellContent, row, rowIndex) => {
        return (
          <Fragment>
            <span>{row.workingDays ? `${row.workingDays} Days` : "--"}</span>
          </Fragment>
        );
      },
    },
    {
      attrs: { datatitle: t("staffTimesheet.leaves") },
      dataField: "leaves",
      text: t("staffTimesheet.leaves"),
      formatter: (cellContent, row, rowIndex) => {
        return (
          <Fragment>
            <span>{row.leaves ? `${row.leaves} Days` : "--"}</span>
          </Fragment>
        );
      },
    },
    {
      attrs: { datatitle: t("staffTimesheet.overtime") },
      dataField: "overtime",
      text: t("staffTimesheet.overtime"),
      formatter: (cellContent, row, rowIndex) => {
        return (
          <Fragment>
            <span>
              {row.totalOvertimeInMins
                ? `${convertTimeMinuteToHour(row.totalOvertimeInMins)} Hrs`
                : "--"}
            </span>
          </Fragment>
        );
      },
    },
    {
      attrs: { datatitle: t("staffTimesheet.status") },
      dataField: "status",
      text: t("staffTimesheet.status"),
      formatter: (cellContent, row, rowIndex) => {
        return (
          <Fragment>
            {row && row.statusId ? handleStaffTimesheetStatus(row) : "--"}
          </Fragment>
        );
      },
    },

    {
      attrs: { datatitle: t("") },
      dataField: "",
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          {row && row.statusId === timesheetStatus[2].value.toString() && (
            <span
              title={t("markAsPaid")}
              className="cursor-pointer link-btn approve"
              onClick={() => {
                setSelectedTimesheetIds([row.timeSheetId]);
                setConfirmModal(true);
              }}
            >
              {t("staffTimesheet.markAsPaid")}
            </span>
          )}
          {row && row.statusId === timesheetStatus[1].value.toString() && (
            <>
              <span
                title={t("approve")}
                className="cursor-pointer link-btn mr-4"
                onClick={() =>
                  updateStatus(timesheetDetailStatus[2]?.value, row.timeSheetId)
                }
              >
                {t("staffTimesheet.approve")}
              </span>
              <span
                className="link-btn reject"
                style={{ color: "#e76f2a" }}
                title="Reject"
                onClick={() => {
                  setSelectedTimesheetIds([row.timeSheetId]);
                  setSelectedStaffNameList(row?.name);
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

  const updatePageNumber = (page) => {
    setPageNumber(page);
  };

  const changeDate = (obj) => {
    setDate((prev) => ({ ...prev, ...obj }));
    updatePageNumber(1);
  };

  const getHolidays = () => {
    const holidays = staffListTimesheet?.holiday_list.map(
      (val) => `${val.title}(${moment(val.date).format("ll")})`
    );

    return holidays?.join(" | ");
  };

  const downloadTimesheetExportedData = async () => {
    setShowLoader(true);
    try {
      let res = await timeSheetDataExport(
        officeId,
        startDate,
        endDate,
        null,
        selectedOption
      );
      res?.file_Url && window.open(res.file_Url, "_self");
    } catch (err) {
      handleError(err);
    } finally {
      setShowLoader(false);
    }
  };

  const handleStatus = (item) => {
    setSelectedOption(item?.value);
    updatePageNumber(1);
  };

  const renderHeader = () => (
    <>
      {officeDetail && officeDetail.name && (
        <h2 className="page-title mt-3 date-page-title">{officeDetail.name}</h2>
      )}
      <h5 className={styles["sub-head"]}>{t("staffTimesheet.timesheets")}</h5>
    </>
  );

  const renderFiltersAndSearching = () => (
    <div
      className={
        "d-flex justify-content-between align-items-center " +
        styles["left-main"]
      }
    >
      <div className={"d-flex align-items-center " + styles["left-container"]}>
        <div
          className={
            "member-filter review-rating-filter " + styles["fix-index"]
          }
        >
          <Select
            options={timesheetStatus}
            defaultValue={timesheetStatus.find(
              (item) => item.value === selectedOption
            )}
            className={["react-select-container"]}
            onChange={handleStatus}
            classNamePrefix="react-select"
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
  );

  const renderExportAndHolidayList = () => (
    <>
      {staffListTimesheet &&
        staffListTimesheet?.holiday_list &&
        staffListTimesheet?.holiday_list.length > 0 && (
          <p className={styles["holidays-description"]}>
            <span>{t("staffTimesheet.holidaysDescription")}</span>
            <span className={styles["holidays"]}>{getHolidays()}</span>
          </p>
        )}

      <button
        className={
          "button button-round button-border button-dark " +
          styles["export-timesheet-btn"]
        }
        onClick={downloadTimesheetExportedData}
        title={t("staffTimesheet.exportTimesheetData")}
      >
        {t("staffTimesheet.exportTimesheetData")}
      </button>
    </>
  );

  const renderConsolidatedData = () => (
    <>
      <Card
        className={styles["timesheet-detail-card"]}
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
        cursor="default"
      >
        <div className={styles["left-side-card"]}>
          <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
            {t("staffTimesheet.totalHours")}
          </Text>
          <div className={styles["total-hours"]}>
            <Text size="20px" marginBottom="0px" weight="500" color="#FFFFFF">
              {staffListTimesheet?.office_timesheet
                ?.totalTimeWithBreakDurationMinutes
                ? `${convertTimeMinuteToHour(
                    staffListTimesheet?.office_timesheet
                      ?.totalTimeWithBreakDurationMinutes
                  )} Hrs`
                : "--"}
            </Text>
          </div>
        </div>
        <div className={styles["right-side-card"]}>
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.loggedHours")}
            </Text>
            <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
              {staffListTimesheet?.office_timesheet?.totalLoggedMinutes
                ? `${convertTimeMinuteToHour(
                    staffListTimesheet?.office_timesheet?.totalLoggedMinutes
                  )} Hrs`
                : "--"}
            </Text>
          </div>
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.approved")}
            </Text>
            <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
              {staffListTimesheet?.office_timesheet?.totalApprovedMinutes
                ? `${convertTimeMinuteToHour(
                    staffListTimesheet?.office_timesheet?.totalApprovedMinutes
                  )} Hrs`
                : "--"}
            </Text>
          </div>
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.overtime")}
            </Text>
            <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
              {staffListTimesheet?.office_timesheet?.totalOvertimeInMins
                ? `${convertTimeMinuteToHour(
                    staffListTimesheet?.office_timesheet?.totalOvertimeInMins
                  )} Hrs`
                : "--"}
            </Text>
          </div>
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.leaves")}
            </Text>
            <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
              {staffListTimesheet?.office_timesheet?.leaves
                ? `${staffListTimesheet?.office_timesheet?.leaves} Days`
                : "--"}
            </Text>
          </div>
          <div>
            <Text size="12px" marginBottom="10px" weight="400" color="#CAD3C0">
              {t("staffTimesheet.cost")}
            </Text>
            <Text size="16px" marginBottom="0px" weight="600" color="#FFFFFF">
              {staffListTimesheet?.office_timesheet?.totalAmount
                ? `CAD ${staffListTimesheet?.office_timesheet?.totalAmount.toFixed(
                    2
                  )}`
                : "--"}
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
        {staffListTimesheet?.office_timesheet?.officeTimeSheetDto.length >
          0 && (
          <div className="d-flex">
            <div className={"ch-checkbox " + styles["ch-checkbox"]}>
              <label>
                <input
                  type="checkbox"
                  checked={
                    staffListTimesheet?.office_timesheet?.officeTimeSheetDto
                      .length > 0 &&
                    selectedTimesheetIds.length ===
                      staffListTimesheet?.office_timesheet?.officeTimeSheetDto
                        .length
                  }
                  onChange={toggleAllCheckbox}
                />
                <span>{t("staffTimesheet.selectAll")}</span>
              </label>
            </div>
            {selectedTimesheetIds?.length > 0 && (
              <span className={styles["timesheet-id"]}>
                ({selectedTimesheetIds.length})
              </span>
            )}
          </div>
        )}
        <div>
          {staffListTimesheet?.office_timesheet?.officeTimeSheetDto.length >
            0 &&
            selectedTimesheetIds.length > 1 && (
              <div>
                <span
                  title={t("markAsPaid")}
                  className="cursor-pointer link-btn mr-4"
                  onClick={() =>
                    handleAllSelectionStatus(
                      timesheetDetailStatus[4]?.value.toString()
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
                      timesheetDetailStatus[2]?.value.toString()
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
                      timesheetDetailStatus[3]?.value.toString()
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
      {!!staffListTimesheet?.office_timesheet?.officeTimeSheetDto?.length ? (
        <Table
          keyField="id"
          data={staffListTimesheet?.office_timesheet?.officeTimeSheetDto}
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
        {isLoading || (showLoader && <Loader />)}
        {renderHeader()}
        {renderFiltersAndSearching()}
        {renderExportAndHolidayList()}
        {renderConsolidatedData()}
        {renderListing()}
        {confirmModal && (
          <div className="markaspaidModal">
            <FamilyModal
              isFamilyModalOpen={confirmModal}
              setIsFamilyModalOpen={setConfirmModal}
              title={t("staffTimesheet.markAsPaid")}
              subTitle1={t("staffTimesheet.cannotUndo")}
              subTitle2={t("staffTimesheet.markAsPaidConfirmMsg")}
              leftBtnText={t("Confirm")}
              rightBtnText={t("cancel")}
              onConfirm={() =>
                confirmSubmitRequest(timesheetDetailStatus[4]?.value)
              }
            />
          </div>
        )}
        {isRejectionModalOpen && (
          <RejectionModal
            isRejectionModalOpen={isRejectionModalOpen}
            setIsRejectionModalOpen={setIsRejectionModalOpen}
            staffMemberName={selectedStaffNameList}
            onReject={(reason) =>
              confirmSubmitRequest(timesheetDetailStatus[3]?.value, reason)
            }
          />
        )}
        {isInfoModalOpen && (
          <InfoModal
            isInfoModalOpen={isInfoModalOpen}
            setIsInfoModalOpen={setIsInfoModalOpen}
          />
        )}
      </Page>
    </>
  );
};

export default withTranslation()(StaffListingTimesheet);
