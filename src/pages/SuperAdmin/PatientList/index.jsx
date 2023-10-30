import React, { useEffect, useState } from "react";
import qs from "query-string";
import Page from "components/Page";
import Table from "components/table";
import constants from "./../../../constants";
import { withTranslation } from "react-i18next";
import Toast from "components/Toast/Alert";
import Empty from "components/Empty";
import {
  usePatients,
  usePatientStatusUpdateMutation,
} from "repositories/patient-repository";
import { Modal, ModalBody } from "reactstrap";
import crossIcon from "./../../../assets/images/cross.svg";
import toast from "react-hot-toast";
import Loader from "components/Loader";

const PAGE_SIZE = 10;

function PatientList({ history, location, t }) {
  const pageNumber = getPageNumber(location.search);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { isLoading, error, data } = usePatients(
    pageNumber,
    PAGE_SIZE,
    searchTerm
  );
  const updatePatientStatusMutation = usePatientStatusUpdateMutation();

  const updateStatus = async () => {
    try {
      await updatePatientStatusMutation.mutateAsync({
        patientId: selectedPatient.id,
        newStatus: !selectedPatient.isActive,
      });
      toast.success(t("superAdmin.patientStatusUpdated"));
      setSelectedPatient(null);
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    if (selectedPatient !== null && !selectedPatient.isActive) {
      updateStatus();
    }
    // eslint-disable-next-line
  }, [selectedPatient]);

  if (!isLoading && error) {
    return (
      <Page titleKey={t("superAdmin.managePatients")}>
        <Toast errorToast message={error.message} />
      </Page>
    );
  }

  const closeModal = () => {
    setSelectedPatient(null);
  };

  const columns = [
    {
      text: t("superAdmin.patientName"),
      formatter: (cellContent, row) => {
        if (!isLoading) return `${row.firstName} ${row.lastName}`;
        return <div className="text-placeholder-150 shimmer-animation"></div>;
      },
    },
    {
      text: t("emailAddress"),
      dataField: "emailId",
      formatter: (cellContent) => {
        if (!isLoading) return cellContent;
        return <div className="text-placeholder-100 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.contactNo"),
      dataField: "contactNumber",
      formatter: (cellContent) => {
        if (!isLoading) return cellContent ? cellContent : "-";
        return <div className="text-placeholder-100 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.status"),
      dataField: "isActive",
      formatter: (cellContent) => {
        if (isLoading)
          return <div className="text-placeholder-100 shimmer-animation"></div>;

        return cellContent ? t("active") : t("inactive");
      },
    },
    {
      formatter: (cellContent, row) => {
        if (isLoading)
          return <div className="text-placeholder-100 shimmer-animation"></div>;

        return (
          <span
            className="pointer d-flex"
            onClick={() => setSelectedPatient(row)}
            style={{
              fontSize: "12px",
              color: row.isActive ? "rgb(231, 111, 42)" : "#587e85",
              marginRight: "10px",
            }}
          >
            <u>{t(row.isActive ? "deactivate" : "activate")}</u>
          </span>
        );
      },
    },
  ];

  let rows = [];
  let totalItems = 0;
  if (isLoading) {
    rows = new Array(PAGE_SIZE).fill({});
    totalItems = PAGE_SIZE;
  } else {
    rows = data.items;
    totalItems = data.totalCount;
  }

  const goToPage = (newPageNumber) => {
    history.push({
      pathname: constants.routes.superAdmin.patientList,
      search: qs.stringify({ pageNumber: newPageNumber }),
    });
  };

  return (
    <>
      <Page titleKey={"superAdmin.managePatients"}>
        <div className="d-flex align-items-center justify-content-end mb-4">
          <div className="search-box">
            <input
              type="text"
              placeholder={t("superAdmin.searchPatient")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="ico">
              <img
                src={require("assets/images/search-icon.svg").default}
                alt="icon"
              />
            </span>
          </div>
        </div>

        <Table
          columns={columns}
          data={rows}
          keyField="id"
          handlePagination={goToPage}
          pageNumber={pageNumber}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
        />

        {!isLoading && totalItems === 0 && (
          <Empty Message={t("superAdmin.noPatientFound")} />
        )}
      </Page>

      {/* Modal */}
      <Modal
        isOpen={selectedPatient !== null && selectedPatient.isActive}
        toggle={closeModal}
        className="modal-dialog-centered"
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={closeModal}>
          <img src={crossIcon} alt="close" />
        </span>

        <ModalBody>
          <div className="content-block mt-4">
            <p>{t("superAdmin.patientDeactivationWarningMessage")}</p>
            <button
              disabled={updatePatientStatusMutation.isLoading}
              className="button button-round button-shadow  button-min-100 margin-right-2x"
              onClick={async () => await updateStatus()}
            >
              {t("ok")}
            </button>
            <button
              disabled={updatePatientStatusMutation.isLoading}
              class="button button-round button-border button-dark"
              onClick={closeModal}
            >
              {t("cancel")}
            </button>
          </div>
        </ModalBody>
      </Modal>
      {/* Modal */}

      {updatePatientStatusMutation.isLoading &&
        selectedPatient &&
        !selectedPatient.isActive && <Loader />}
    </>
  );
}

function getPageNumber(queryString) {
  let { pageNumber } = qs.parse(queryString);

  if (pageNumber === undefined || isNaN(pageNumber) || pageNumber <= 0) {
    return 1;
  }

  return parseInt(pageNumber);
}

export default withTranslation()(PatientList);
