import Empty from "components/Empty";
import Table from "components/table";
import moment from "moment";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { useInvoiceEntries } from "repositories/invoice-repository";

function Invoices({ accountOwnerId, onItemClick, t }) {
  const PAGE_SIZE = 5;
  const [pageNumber, setPageNumber] = useState(1);

  const {
    isLoading,
    data: apiRes,
    error,
  } = useInvoiceEntries(accountOwnerId, pageNumber, PAGE_SIZE);

  if (error || (!isLoading && apiRes.statusCode !== 200)) {
    return null;
  }

  const columns = [
    {
      text: t("superAdmin.subscriptionName"),
      dataField: "packageName",
      formatter: (cellContent, row) => {
        if (isLoading)
          return <div className="text-placeholder-150 shimmer-animation"></div>;

        return (
          <div onClick={() => onItemClick(row)} style={{ cursor: "pointer" }}>
            {cellContent + " " + t("subscription")}
          </div>
        );
      },
    },
    {
      text: t("superAdmin.totalSubscriptionPrice"),
      dataField: "totalChargeAmountInCents",
      formatter: (cellContent) => {
        if (isLoading)
          return <div className="text-placeholder-100 shimmer-animation"></div>;

        return `${t("cad")} ${(cellContent / 100).toFixed(2)}`;
      },
    },
    {
      text: t("superAdmin.startDate"),
      dataField: "periodStart",
      formatter: (cellContent) => {
        if (isLoading)
          return <div className="text-placeholder-100 shimmer-animation"></div>;

        return moment(cellContent).format("MMM DD, YYYY");
      },
    },
    {
      text: t("superAdmin.expireDate"),
      dataField: "periodEnd",
      formatter: (cellContent) => {
        if (isLoading)
          return <div className="text-placeholder-100 shimmer-animation"></div>;

        return moment(cellContent).format("MMM DD, YYYY");
      },
    },
  ];

  let totalItems = 0;
  let rows;
  if (!isLoading) {
    totalItems = apiRes.pagination.totalItems;
    rows = apiRes.data;
  } else {
    rows = new Array(PAGE_SIZE).fill({});
  }

  return (
    <>
      <h2 className="page-title mb-4 mt-5">
        {t("superAdmin.previousInvoices")}
      </h2>
      <Table
        columns={columns}
        data={rows}
        keyField="id"
        handlePagination={setPageNumber}
        pageNumber={pageNumber}
        pageSize={PAGE_SIZE}
        totalItems={totalItems}
      />

      {!isLoading && totalItems === 0 && (
        <Empty Message={t("superAdmin.noInvoicesYet")} />
      )}
    </>
  );
}

export default withTranslation()(Invoices);
