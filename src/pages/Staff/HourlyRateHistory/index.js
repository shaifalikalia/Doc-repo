import React, { useState } from "react";
import Page from "components/Page";
import Table from "components/table";
import { withTranslation } from "react-i18next";
import Toast from "components/Toast/Alert";
import Empty from "components/Empty";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import { useHourlyRates } from "repositories/performance-repository";
import Text from "components/Text";
import moment from "moment";
import "./HourlyRate.scss";
const PAGE_SIZE = 10;

function HourlyRateHistory({ history, location, match, t }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [viewInfoModal, setViewInfoModal] = useState(false);
  const { isLoading, error, data } = useHourlyRates(
    location.state.detail.staffMemberId,
    location.state.OfficeId,
    pageNumber,
    PAGE_SIZE
  );

  const goBack = () =>
    history.push({
      pathname: "/staff-detail",
      state: location.state,
    });

  if (!isLoading && error) {
    return (
      <Page titleKey={t("staff.hourlyRateHistory")} onBack={goBack}>
        <Toast errorToast message={error.message} />
      </Page>
    );
  }

  if (!isLoading && data && data.data.length === 0) {
    return (
      <Page titleKey={t("staff.hourlyRateHistory")} onBack={goBack}>
        <Empty Message={t("noRecordFound")} />
      </Page>
    );
  }
  const columns = [
    {
      text: t("staff.duration"),
      dataField: "applicableFrom",
      attrs: { datatitle: t("staff.duration") },
      formatter: (cellContent, row) => {
        if (!isLoading)
          return (
            moment(row.applicableFrom).format("MMMM DD, YYYY") +
            " - " +
            (row.applicableTo
              ? moment(row.applicableTo).format("MMMM DD, YYYY")
              : "Present")
          );
        return <div className="text-placeholder-150 shimmer-animation"></div>;
      },
    },
    {
      text: t("staff.hourlyRate"),
      attrs: { datatitle: t("staff.hourlyRate") },
      dataField: "hourlyRate",
      formatter: (cellContent) => {
        if (!isLoading)
          return cellContent
            ? t("cad") + " " + cellContent.toFixed(2)
            : t("cad") + " " + "0.00"; // eslint-disable-line
        return <div className="text-placeholder-100 shimmer-animation"></div>;
      },
    },
    {
      align: "right",
      style: { width: 200 },
      formatter: (cellContent, row) => {
        if (isLoading)
          return <div className="text-placeholder-100 shimmer-animation"></div>;

        return (
          <a onClick={() => setViewInfoModal(true)}>
            {" "}
            {/* eslint-disable-line */}
            <span
              className="pointer"
              style={{
                fontSize: "12px",
                color: "#587e85",
                marginRight: "10px",
              }}
            >
              <u>{t("staff.viewReview")}</u>
            </span>
          </a>
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

  const infoModal = (
    <Modal
      isOpen={viewInfoModal}
      className="modal-dialog-centered  delete-modal"
      modalClassName="custom-modal"
      toggle={() => setViewInfoModal(false)}
    >
      <span className="close-btn" onClick={() => setViewInfoModal(false)}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <div className="change-modal-content text-center">
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {" "}
              {t("accountOwner.switchToMobileApp")}
            </span>{" "}
          </Text>
          <Text size="16px" marginBottom="35px" weight="300" color=" #535b5f">
            {t("accountOwner.switchToMobileAppDesc")}
          </Text>
          <div className="btn-box">
            <button
              className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
              title={t("accountOwner.okayGotIt")}
              onClick={() => setViewInfoModal(false)}
            >
              {t("accountOwner.okayGotIt")}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
  return (
    <Page titleKey={t("staff.hourlyRateHistory")} onBack={goBack}>
      {viewInfoModal && infoModal}
      <div className="hour-rate-table">
        <Table
          columns={columns}
          data={rows}
          keyField="id"
          handlePagination={(e) => setPageNumber(e)}
          pageNumber={pageNumber}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
        />

        {!isLoading && totalItems === 0 && (
          <Empty Message={t("superAdmin.noSpecialtyOrServiceFound")} />
        )}
      </div>
    </Page>
  );
}

export default withTranslation()(HourlyRateHistory);
