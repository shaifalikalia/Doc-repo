import React, { useState } from "react";
import qs from "query-string";
import Page from "components/Page";
import Table from "components/table";
import { Link } from "react-router-dom";
import constants from "./../../../../constants";
import { withTranslation } from "react-i18next";
import {
  useSpecialties,
  useUpdateActiveStatusOfSpecialtyMutation,
} from "repositories/specialty-repository";
import Toast from "components/Toast/Alert";
import Empty from "components/Empty";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import toast from "react-hot-toast";
import { encodeId } from "utils";

const PAGE_SIZE = 7;

function SpecialtyList({ history, location, t }) {
  const pageNumber = getPageNumber(location.search);
  const { isLoading, error, data } = useSpecialties(pageNumber, PAGE_SIZE);
  const [modalData, setModalData] = useState(null);

  const mutation = useUpdateActiveStatusOfSpecialtyMutation();
  const onModalConfirmation = async () => {
    try {
      await mutation.mutateAsync({
        specialtyId: modalData.specialtyId,
        status: modalData.status,
      });
      toast.success(t("superAdmin.statusUpdated"));
    } catch (e) {
      toast.error(e.message);
    }
    setModalData(null);
  };

  if (!isLoading && error) {
    return (
      <Page
        titleKey="superAdmin.manageSpecialtiesOrServices"
        actionButton={
          <Link
            to={{
              pathname: constants.routes.specialtyForm,
              state: { previousPath: location.pathname + location.search },
            }}
          >
            <button className="button button-shadow button-round">
              {t("addNew")} {t("superAdmin.specialtyOrService")}
            </button>
          </Link>
        }
      >
        <Toast errorToast message={error.message} />
      </Page>
    );
  }

  const columns = [
    {
      text: t("superAdmin.specialtyOrService") + " " + t("name"),
      dataField: "title",
      formatter: (cellContent, row) => {
        if (!isLoading) return cellContent;
        return <div className="text-placeholder-150 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.status"),
      dataField: "isActive",
      formatter: (cellContent) => {
        if (!isLoading) return cellContent ? t("active") : t("inactive");
        return <div className="text-placeholder-100 shimmer-animation"></div>;
      },
    },
    {
      align: "right",
      style: { width: 100 },
      formatter: (cellContent, row) => {
        if (isLoading)
          return <div className="text-placeholder-100 shimmer-animation"></div>;

        return (
          <Link
            to={{
              pathname: `${constants.routes.specialtyForm}/${encodeId(row.id)}`,
              state: { previousPath: location.pathname + location.search },
            }}
          >
            <span
              className="pointer"
              style={{
                fontSize: "12px",
                color: "#587e85",
                marginRight: "10px",
              }}
            >
              <u>{t("superAdmin.edit")}</u>
            </span>
          </Link>
        );
      },
    },
    {
      align: "right",
      style: { width: 150 },
      formatter: (cellContent, row) => {
        if (isLoading)
          return <div className="text-placeholder-100 shimmer-animation"></div>;

        let color = "#e76f2a";
        let textKey = "deactivate";
        if (!row.isActive) {
          color = "#587e85";
          textKey = "activate";
        }

        return (
          <span
            className="pointer"
            style={{ fontSize: "12px", color, marginRight: "10px" }}
            onClick={() => {
              setModalData({
                status: !row.isActive,
                specialtyId: row.id,
                specialtyTitle: row.title,
              });
            }}
          >
            <u>{t(textKey)}</u>
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
    rows = data.data;
    totalItems = data.pagination.totalItems;
  }

  const goToPage = (newPageNumber) => {
    history.push({
      pathname: constants.routes.specialtyList,
      search: qs.stringify({ pageNumber: newPageNumber }),
    });
  };

  return (
    <Page
      titleKey="superAdmin.manageSpecialtiesOrServices"
      actionButton={
        <Link
          to={{
            pathname: constants.routes.specialtyForm,
            state: { previousPath: location.pathname + location.search },
          }}
        >
          <button className="button button-round">
            {t("addNew")} {t("superAdmin.specialtyOrService")}
          </button>
        </Link>
      }
    >
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
        <Empty Message={t("superAdmin.noSpecialtyOrServiceFound")} />
      )}

      <ConfirmationPopup
        show={modalData !== null}
        shouldActivate={modalData !== null ? modalData.status : null}
        specialtyTitle={modalData !== null ? modalData.specialtyTitle : ""}
        isSubmitting={mutation.isLoading}
        onClose={() => setModalData(null)}
        onSubmit={onModalConfirmation}
        t={t}
      />
    </Page>
  );
}

function ConfirmationPopup({
  show,
  onClose,
  isSubmitting,
  shouldActivate,
  specialtyTitle,
  onSubmit,
  t,
}) {
  return (
    <Modal
      isOpen={show}
      toggle={onClose}
      className="modal-dialog-centered"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={onClose}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <p className="mt-4">
          {t(
            shouldActivate
              ? "superAdmin.specialtyActivationText"
              : "superAdmin.specialtyDeactivationText",
            {
              specialtyTitle: specialtyTitle,
            }
          )}
        </p>

        {!shouldActivate && (
          <p>{t("superAdmin.specialtyDeactivationSubtext")}</p>
        )}

        <div className="d-flex">
          <button
            className={
              "button button-round button-shadow button-min-100 margin-right-2x" +
              (isSubmitting ? " button-loading" : "")
            }
            disabled={isSubmitting}
            onClick={onSubmit}
          >
            {t("yes")}
            {isSubmitting && <div className="loader"></div>}
          </button>
          <button
            className="button button-round button-border button-dark"
            disabled={isSubmitting}
            onClick={onClose}
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

function getPageNumber(queryString) {
  let { pageNumber } = qs.parse(queryString);

  if (pageNumber === undefined || isNaN(pageNumber) || pageNumber <= 0) {
    return 1;
  }

  return parseInt(pageNumber);
}

export default withTranslation()(SpecialtyList);
