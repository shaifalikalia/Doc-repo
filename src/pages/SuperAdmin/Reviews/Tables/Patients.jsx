import Empty from "components/Empty";
import Table from "components/table";
import Toast from "components/Toast/Alert";
import constants from "./../../../../constants";
import usePageNumber from "hooks/usePageNumber";
import React from "react";
import qs from "query-string";
import { withTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import { usePatients } from "repositories/review-repository";
import styles from "./../Reviews.module.scss";
import useQueryParam from "hooks/useQueryParam";
import { Link } from "react-router-dom";
import { encodeId } from "utils";

const pageSize = 4;

function Patients({ t }) {
  const history = useHistory();
  const location = useLocation();
  const pageNumber = usePageNumber();
  const searchTerm = useQueryParam("search", null);
  const { isLoading, data, error } = usePatients(
    pageNumber,
    pageSize,
    searchTerm !== null ? decodeURIComponent(searchTerm) : null
  );

  if (!isLoading && error) {
    return <Toast errorToast message={error.message} />;
  }

  let rows = [];
  let totalItems = 0;

  if (!isLoading) {
    rows = data.items;
    totalItems = data.totalCount;
  } else {
    rows = new Array(pageSize).fill({});
    totalItems = pageSize;
  }

  const columns = [
    {
      text: t("superAdmin.patientsName"),
      formatter: (cellContent, row) => {
        if (!isLoading) return `${row.firstName} ${row.lastName}`;
        return <div className="text-placeholder-50 shimmer-animation"></div>;
      },
    },
    {
      style: { width: 250 },
      align: "right",
      formatter: (cellContent, row) => {
        if (!isLoading)
          return (
            <Link
              to={{
                pathname: constants.routes.superAdmin.patientReviews.replace(
                  ":patientId",
                  encodeId(row.id)
                ),
                state: { query: qs.parse(location.search) },
              }}
            >
              <div className={styles["table-action-btn"]}>
                {t("superAdmin.viewReviewAndRating")}
              </div>
            </Link>
          );
        return <div className="text-placeholder-150 shimmer-animation"></div>;
      },
    },
  ];

  const onPageNumberChanged = (_pageNumber) => {
    let query = qs.parse(location.search);
    if (!query) {
      query = {};
    }

    query.tab = 2;
    query.pageNumber = _pageNumber;

    history.push({
      pathname: constants.routes.superAdmin.reviews,
      search: qs.stringify(query),
    });
  };

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
        <Empty Message={t("superAdmin.noPatientFound")} />
      )}
    </>
  );
}

export default withTranslation()(Patients);
