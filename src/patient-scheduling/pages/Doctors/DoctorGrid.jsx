import React from "react";
import { Link } from "react-router-dom";
import DoctorCard from "./DoctorCard";
import styles from "./Home.module.scss";
import constants from "../../../constants";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import Empty from "components/Empty";
import qs from "query-string";

function DoctorGrid({
  items,
  pageNumber,
  onPageChange,
  total,
  pageSize,
  searchTerm,
  t,
}) {
  let content = null;
  if (items.length > 0) {
    content = items.map((it, i) => {
      let state = {};
      if (pageNumber > 1) {
        state.pageNumber = pageNumber;
      }

      if (searchTerm) {
        state.search = searchTerm;
      }

      return (
        <Link
          to={{
            pathname: constants.routes.doctor,
            search: qs.stringify({ doctorId: it.id, officeId: it.office.id }),
            state,
          }}
          key={i}
          className={`col-xl-3 col-lg-4 col-md-6 no-underline`}
        >
          <DoctorCard doctor={it} />
        </Link>
      );
    });
  } else {
    content = (
      <div className="col-md-12">
        <Empty Message={t("noDoctorFound")} />
      </div>
    );
  }

  return (
    <>
      <div className={`row ${styles["doctor-grid"]}`}>{content}</div>
      <PaginationProvider
        pagination={paginationFactory({
          custom: true,
          sizePerPage: pageSize,
          totalSize: total,
          page: pageNumber,
          onPageChange: onPageChange,
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

              <div className="pagnation-block">
                {total > pageSize && (
                  <PaginationListStandalone {...paginationProps} />
                )}
              </div>
            </div>
          );
        }}
      </PaginationProvider>
    </>
  );
}

export default DoctorGrid;
