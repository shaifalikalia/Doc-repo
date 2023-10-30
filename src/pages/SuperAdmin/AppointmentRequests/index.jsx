import Page from "components/Page";
import React, { useState, useEffect, useMemo } from "react";
import { withTranslation } from "react-i18next";
import styles from "./AppointmentRequest.module.scss";
import Table from "components/table";
import Select from "react-select";
import produce from "immer";
import DeleteAppointmentModal from "./DeleteAppointmentModal";
import { encodeId } from "utils";
import constants from "../../../constants.js";
import usePageNumber from "hooks/usePageNumber";
import useQueryParam from "hooks/useQueryParam";
import qs from "query-string";
import {
  useCompleteRequestDoctorAppointment,
  useDeleteRequestDoctorAppointment,
  useGetRequestAppointmentList,
} from "repositories/appointment-repository";
import Loader from "components/Loader";
import toast from "react-hot-toast";
import moment from "moment/moment";
import { findKey, uniqBy } from "lodash";
import CompleteRequestModal from "../components/CompleteRequestModal";
import { getPropsForCSV } from "./dataExportHelper";
import { CSVLink } from "react-csv";

let refreshCounter = 0;
const PAGE_SIZE = 5;

function AppointmentRequests({ t, history, location }) {
  const onBack = () => history.push("/");
  const pageNumber = usePageNumber();
  const statusFilter = useQueryParam(
    "status",
    constants.googleDoctorsStatusFilter.All
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const [customData, setCustomData] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [id, setId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);

  const resetIds = () => {
    setId(null);
    setSelectedIds([]);
    setSelectedAll(false);
  };
  //Get api reqeusts
  const {
    isLoading,
    isFetching,
    error,
    data: requestList,
    refetch,
  } = useGetRequestAppointmentList(pageNumber, statusFilter, PAGE_SIZE, {
    cacheTime: 0,
  });
  const totalItems = useMemo(
    () => requestList?.pagination?.totalItems || 0,
    [requestList?.pagination?.totalItems]
  );
  const {
    isLoading: isLoadingAllData,
    isFetching: isFetchingAllData,
    error: allDataError,
    data: allRequests,
  } = useGetRequestAppointmentList(1, statusFilter, totalItems, {
    enabled: selectedAll && !!totalItems,
  });

  //Mutations
  const deleteMutation = useDeleteRequestDoctorAppointment();
  const { isLoading: requestingDeletion } = deleteMutation;
  const completeMutation = useCompleteRequestDoctorAppointment();
  const { isLoading: requestingCompletion } = completeMutation;

  //Use-effects
  useEffect(() => {
    if (!isLoading && !isFetching && error && error.message) {
      toast.error(error.message);
    }
    if (
      !isLoadingAllData &&
      !isFetchingAllData &&
      allDataError &&
      allDataError.message
    ) {
      toast.error(allDataError.message);
    }
  }, [error, allDataError]);

  useEffect(() => {
    if (requestList) {
      setCustomData(convertToCustomList(requestList.data));
    }
  }, [requestList]);

  useEffect(() => {
    setSelectedData((prev) => uniqBy([...prev, ...customData], "id"));
  }, [customData]);

  useEffect(() => {
    //This use effect is very importent to run the column formatter on state changes.
    setCustomData(
      produce((draft) => {
        draft.forEach((_, idx) => {
          draft[idx].dummy = refreshCounter;
          refreshCounter++;
        });
      })
    );
  }, [selectedIds, selectedAll]);

  useEffect(() => {
    if (pageNumber > 1 && requestList && !requestList.data?.length) {
      handlePageChange(pageNumber - 1);
    }
  }, [pageNumber, requestList]);

  //Methods
  function convertToCustomList(list) {
    if (!list) return [];
    return list.map((request) => {
      const {
        id: requestId,
        requestedOn,
        googleDoctor,
        requestAppointmentStatus,
        appointmentDate,
        patientContactNumber,
        reasonForVisit,
        appointmentTime,
        patient,
      } = request;
      const translationKeyForFilter = findKey(
        constants.googleDoctorsStatusFilter,
        (filterId) => filterId === requestAppointmentStatus
      );
      const translationKeyForTime = findKey(
        constants.appointmentTimeTypes,
        (timeId) => timeId === appointmentTime
      );
      const originalPatientName = `${patient?.firstName} ${patient?.lastName}`;
      const originalPatientEmail = patient?.emailId;
      return {
        requestedOn: moment(requestedOn).format("MMM DD, YYYY"),
        patientName: originalPatientName,
        patientID: originalPatientEmail,
        providerDoctorName: googleDoctor?.businessName || "",
        statusTitle: t(
          `superAdmin.appointmentRequestList.status.${translationKeyForFilter}`
        ),
        statusId: requestAppointmentStatus,
        id: requestId,
        //Below data for csv file
        appointmentDate: moment(appointmentDate).format("MMM DD, YYYY"),
        patientContactNumber,
        reasonForVisit,
        doctorAddress: googleDoctor?.address || "",
        appointmentTime: t(`patient.${translationKeyForTime?.toLowerCase()}`),
      };
    });
  }

  const toggleAllCheckbox = (e) => {
    setSelectedIds([]);
    setSelectedAll(e.target.checked);
  };

  const toggleCheckbox = (e) => {
    if (!e.target.checked) {
      setSelectedIds((prev) => prev.filter((it) => it !== +e.target.value));
    } else {
      setSelectedIds((prev) => [...prev, +e.target.value]);
    }
  };

  const disableActionBtns = () =>
    !!selectedIds.length ? styles["disable-btns"] : "";

  const confirmMarkComplete = async () => {
    setCompleteModal(false);
    let completeIds = [];
    if (id !== null) {
      completeIds = [id];
    } else if (selectedIds.length) {
      completeIds = selectedIds;
    } else if (selectedAll) {
      completeIds = allRequests?.data?.map(({ id: _id }) => _id) || [];
    }
    try {
      await completeMutation.mutateAsync(completeIds);
      toast.success(t("patient.Requestascompleted"));
      refetch();
      resetIds();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMarkComplete = (_id) => {
    setId(_id);
    setSelectedIds([]);
    setCompleteModal(true);
  };

  const handleMarkCompleteMany = () => {
    setId(null);
    setCompleteModal(true);
  };

  const handleViewDetail = (__id) => {
    const encodedId = encodeId(__id);
    let state = {};
    if (location.search) {
      state.search = location.search;
    }
    history.push({
      pathname: constants.routes.superAdmin.appointmentRequestDetail.replace(
        ":requestId",
        encodedId
      ),
      state,
    });
  };

  const confirmDelete = async () => {
    setDeleteModal(false);
    let deleteIds = [];
    if (id !== null) {
      deleteIds = [id];
    } else if (selectedIds.length) {
      deleteIds = selectedIds;
    } else if (selectedAll) {
      deleteIds = allRequests?.data?.map(({ id: _id }) => _id) || [];
    }
    try {
      await deleteMutation.mutateAsync(deleteIds);
      refetch();
      resetIds();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = (_id) => {
    setId(_id);
    setSelectedIds([]);
    setDeleteModal(true);
  };

  const handleDeleteMany = () => {
    setId(null);
    setDeleteModal(true);
  };

  function handlePageChange(_pageNumber) {
    let query = qs.parse(location.search);
    if (!query) {
      query = {};
    }
    query.pageNumber = _pageNumber;
    history.push({
      pathname: constants.routes.superAdmin.appointmentRequestList,
      search: qs.stringify(query),
    });
  }

  const handleRequestStatusFilter = (e) => {
    const { value } = e;
    let query = qs.parse(location.search);
    if (!query) {
      query = {};
    }
    query.status = value;
    resetIds();
    history.push({
      pathname: constants.routes.superAdmin.appointmentRequestList,
      search: qs.stringify(query),
    });
  };

  const columns = [
    {
      attrs: { datatitle: t("superAdmin.requestedOn") },
      dataField: "requestedOn",
      text: t("superAdmin.requestedOn"),
      headerFormatter: () => (
        <div className="ch-checkbox">
          <label
            className={`${
              !requestList?.data?.length
                ? styles["disable-cursor"]
                : styles["cursor"]
            }`}
          >
            <input
              type="checkbox"
              checked={selectedAll}
              onChange={toggleAllCheckbox}
              disabled={!requestList?.data?.length}
            />
            <span>{t("superAdmin.requestedOn")}</span>
          </label>
        </div>
      ),
      formatter: (cellContent, row) => {
        return (
          <div className="ch-checkbox">
            <label className={`${styles["cursor"]}`}>
              <input
                type="checkbox"
                value={row.id}
                checked={selectedAll || selectedIds.includes(+row.id)}
                onChange={toggleCheckbox}
              />
              <span>{cellContent}</span>
            </label>
          </div>
        );
      },
    },
    {
      attrs: { datatitle: t("superAdmin.patientName") },
      dataField: "patientName",
      text: t("superAdmin.patientName"),
    },
    {
      attrs: { datatitle: t("superAdmin.patientID") },
      dataField: "patientID",
      text: t("superAdmin.patientID"),
    },
    {
      attrs: { datatitle: t("superAdmin.providerDoctorName") },
      dataField: "providerDoctorName",
      text: t("superAdmin.providerDoctorName"),
    },
    {
      attrs: { datatitle: t("status") },
      dataField: "statusTitle",
      text: t("status"),
    },
    {
      dataField: "",
      text: t("actions"),
      formatter: (cellContent, row) => {
        return (
          <div className={`${styles["appoint-actions"]}`}>
            {row.statusId === constants.googleDoctorsStatusFilter.Pending ? (
              <span
                className={`link-btn ${disableActionBtns()}`}
                onClick={() => handleMarkComplete(row.id)}
              >
                {t("superAdmin.markComplete")}
              </span>
            ) : (
              <span className={`${styles["empty-span"]}`} />
            )}
            <span
              className={`link-btn ${disableActionBtns()}`}
              onClick={() => handleViewDetail(row.id)}
            >
              {t("superAdmin.view")}
            </span>
            <button
              className={`${styles["delete-btn"]} ${disableActionBtns()}`}
              onClick={() => handleDelete(row.id)}
            >
              {t("delete")}
            </button>
          </div>
        );
      },
    },
  ];
  const options = [
    {
      value: constants.googleDoctorsStatusFilter.All,
      label: t("superAdmin.appointmentRequestList.status.All"),
    },
    {
      value: constants.googleDoctorsStatusFilter.Pending,
      label: t("superAdmin.appointmentRequestList.status.Pending"),
    },
    {
      value: constants.googleDoctorsStatusFilter.Completed,
      label: t("superAdmin.appointmentRequestList.status.Completed"),
    },
  ];

  const csvProps = getPropsForCSV(
    selectedIds,
    selectedAll ? convertToCustomList(allRequests?.data) : selectedData,
    selectedAll
  );

  return (
    <Page onBack={onBack} title={t("superAdmin.appointmentRequest")}>
      {(isLoading ||
        requestingDeletion ||
        requestingCompletion ||
        isLoadingAllData) && <Loader />}
      <div className={styles["appoint-table-header"]}>
        <Select
          className={styles["react-select-container"]}
          classNamePrefix="react-select"
          options={options}
          defaultValue={options.find((item) => item.value === +statusFilter)}
          onChange={handleRequestStatusFilter}
        />
        {(!!selectedIds.length || selectedAll) && (
          <div className="">
            <button
              className="button button-round button-border button-dark "
              title={t("delete")}
              onClick={handleDeleteMany}
            >
              {t("delete")}
            </button>
            <CSVLink
              className="button ml-3 button-round button-border button-dark d-inline "
              title={t("appointmentRequestsList")}
              {...csvProps}
            >
              {t("appointmentRequestsList")}
            </CSVLink>
            <button
              className="button button-round button-shadow ml-3"
              title={t("superAdmin.markAsCompleted")}
              onClick={handleMarkCompleteMany}
            >
              {t("superAdmin.markAsCompleted")}
            </button>
          </div>
        )}
      </div>
      <div className="mb-5 request-appointment-table">
        <Table
          keyField="id"
          data={customData}
          columns={columns}
          handlePagination={handlePageChange}
          pageNumber={pageNumber}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
        />
      </div>
      <DeleteAppointmentModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        confirmDelete={confirmDelete}
      />
      <CompleteRequestModal
        completeModal={completeModal}
        setCompleteModal={setCompleteModal}
        confirmMarkComplete={confirmMarkComplete}
      />
    </Page>
  );
}

export default withTranslation()(AppointmentRequests);
