import Empty from "components/Empty";
import Table from "components/table";
import constants from "./../../../../constants";
import usePageNumber from "hooks/usePageNumber";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useReviews } from "repositories/review-repository";
import styles from "./../Reviews.module.scss";
import qs from "query-string";
import Toast from "components/Toast/Alert";
import ReviewConfirmationPopup from "pages/SuperAdmin/ReviewConfirmationPopup";
import ReviewDetailPopup from "./ReviewDetailPopup";
import useStatus from "../../useStatus";

const pageSize = 4;

function AllReviews({ t }) {
  const history = useHistory();
  const location = useLocation();
  const pageNumber = usePageNumber();
  const status = useStatus();
  const { isLoading, data, error } = useReviews(pageNumber, pageSize, status);
  const [selectedReviewForStatusUpdate, setSelectedReviewForStatusUpdate] =
    useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  if (!isLoading && error) {
    return <Toast errorToast message={error.message} />;
  }

  let rows = [];
  let totalItems = 0;

  if (isLoading) {
    rows = new Array(pageSize).fill({});
    totalItems = pageSize;
  } else {
    rows = data.items;
    totalItems = data.totalCount;
  }

  const onPageNumberChanged = (_pageNumber) => {
    let query = qs.parse(location.search);
    if (!query) {
      query = {};
    }

    query.tab = 1;
    query.pageNumber = _pageNumber;

    history.push({
      pathname: constants.routes.superAdmin.reviews,
      search: qs.stringify(query),
    });
  };

  const columns = [
    {
      text: t("superAdmin.patientsName"),
      formatter: (cellContent, row) => {
        if (!isLoading)
          return `${row.patient.firstName} ${row.patient.lastName}`;
        return <div className="text-placeholder-50 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.doctorsName"),
      formatter: (cellContent, row) => {
        if (!isLoading) return `${row.doctor.firstName} ${row.doctor.lastName}`;
        return <div className="text-placeholder-50 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.officeName"),
      formatter: (cellContent, row) => {
        if (!isLoading) return row.office.name;
        return <div className="text-placeholder-50 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.accountOwner"),
      formatter: (cellContent, row) => {
        if (!isLoading)
          return row.isDoctorAccountOwner ? (
            <Link
              className={styles["table-action-btn"]}
              to={`account-owner/${row.doctor.id}`}
            >
              {t("Yes")}
            </Link>
          ) : (
            <div className={styles["table-non-action-btn"]}>{t("No")}</div>
          );
        return <div className="text-placeholder-50 shimmer-animation"></div>;
      },
    },
    {
      text: t("status"),
      formatter: (cellContent, row) => {
        if (!isLoading)
          return row.isFeedbackApproved ? t("active") : t("inactive");
        return <div className="text-placeholder-50 shimmer-animation"></div>;
      },
    },
    {
      formatter: (cellContent, row) => {
        if (!isLoading)
          return row.isFeedbackApproved ? (
            <div
              className={styles["table-action-btn"] + " " + styles["orange"]}
              onClick={() => setSelectedReviewForStatusUpdate(row)}
            >
              {t("deactivate")}
            </div>
          ) : (
            <div
              className={styles["table-action-btn"]}
              onClick={() => setSelectedReviewForStatusUpdate(row)}
            >
              {t("activate")}
            </div>
          );
        return <div className="text-placeholder-50 shimmer-animation"></div>;
      },
    },
    {
      formatter: (cellContent, row) => {
        if (!isLoading)
          return (
            <div
              className={styles["table-action-btn"]}
              onClick={() => setSelectedReview(row)}
            >
              {t("superAdmin.viewReviewAndRating")}
            </div>
          );
        return <div className="text-placeholder-50 shimmer-animation"></div>;
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={rows}
        keyField="id"
        handlePagination={onPageNumberChanged}
        pageNumber={pageNumber}
        totalItems={totalItems}
        pageSize={pageSize}
      />

      {!isLoading && totalItems === 0 && (
        <Empty Message={t("superAdmin.noReviewsAddedYet")} />
      )}

      {selectedReviewForStatusUpdate !== null && (
        <ReviewConfirmationPopup
          onClose={() => setSelectedReviewForStatusUpdate(null)}
          onActionComplete={() => setSelectedReviewForStatusUpdate(null)}
          review={selectedReviewForStatusUpdate}
        />
      )}

      {selectedReview !== null && (
        <ReviewDetailPopup
          onClose={() => setSelectedReview(null)}
          review={selectedReview}
        />
      )}
    </>
  );
}

export default withTranslation()(AllReviews);
