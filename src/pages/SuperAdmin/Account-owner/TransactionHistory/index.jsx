import Empty from "components/Empty";
import Page from "components/Page";
import Table from "components/table";
import Toast from "components/Toast";
import moment from "moment";
import React from "react";
import { useState } from "react";
import { withTranslation } from "react-i18next";
import { useTransactions } from "repositories/transaction-repository";
import { decodeId, encodeId } from "utils";

function AccountOwnerTransactionHistory({ history, match, t }) {
  const accountOwnerId = decodeId(match.params.accountOwnerId);
  const PAGE_SIZE = 4;
  const [transactionId, setTransactionId] = useState(null);

  // Is used to disable previous button when it's value is 1.
  const [currentPage, setCurrentPage] = useState(1);

  // Tells if the user is moving forwards or backwards in paging.
  const [movingForward, setMovingForward] = useState(true);

  const {
    isLoading,
    data: apiRes,
    error,
  } = useTransactions(accountOwnerId, PAGE_SIZE, movingForward, transactionId);

  const titleKey = "superAdmin.accountOwnersTransactionHistory";
  const onBack = () =>
    history.push(`/account-owner/${encodeId(accountOwnerId)}`);
  if (error || (!isLoading && apiRes.statusCode !== 200)) {
    return (
      <Page titleKey={titleKey} onBack={onBack}>
        <Toast
          errorToast={true}
          message={error ? error.message : apiRes.message}
        />
      </Page>
    );
  }

  const columns = [
    {
      text: t("superAdmin.description"),
      dataField: "description",
      formatter: (cellContent) => {
        if (isLoading)
          return <div className="text-placeholder-150 shimmer-animation"></div>;

        return cellContent || "-";
      },
    },
    {
      text: t("superAdmin.dateAndTime"),
      dataField: "createdAt",
      formatter: (cellContent) => {
        if (isLoading)
          return <div className="text-placeholder-150 shimmer-animation"></div>;

        return moment(cellContent).format("MMM DD, YYYY - h:mm A");
      },
    },
    {
      text: t("superAdmin.status"),
      dataField: "status",
      formatter: (cellContent, row) => {
        if (isLoading)
          return <div className="text-placeholder-150 shimmer-animation"></div>;

        cellContent =
          cellContent.charAt(0).toUpperCase() + cellContent.slice(1);

        if (row.refundAmount === row.amount) {
          return t("superAdmin.refund");
        } else if (row.refundAmount > 0) {
          return (
            <div className="app-tooltip">
              {t("superAdmin.partialRefund")}
              <span className="app-tooltip-text">
                {t("superAdmin.refundAmountIs")}:{" "}
                {toCurrencyString(row.refundAmount, row.currency)}
              </span>
            </div>
          );
        } else if (cellContent === "Failed") {
          return (
            <div className="app-tooltip">
              {cellContent}
              <span className="app-tooltip-text">{row.failureMessage}</span>
            </div>
          );
        } else {
          return cellContent;
        }
      },
    },
    {
      text: t("superAdmin.amount"),
      dataField: "amount",
      formatter: (cellContent, row) => {
        if (isLoading)
          return <div className="text-placeholder-150 shimmer-animation"></div>;
        return toCurrencyString(cellContent, row.currency);
      },
    },
  ];

  let rows = [];
  let hasMore = false;
  if (!isLoading) {
    rows = apiRes.data.transactions;
    hasMore = apiRes.data.hasMore;
  } else {
    rows = new Array(PAGE_SIZE).fill({});
  }

  return (
    <Page titleKey={titleKey} onBack={onBack}>
      <Table
        columns={columns}
        data={rows}
        keyField="id"
        totalItems={rows.length}
        pageSize={PAGE_SIZE}
      />

      {!isLoading && rows.length === 0 && (
        <Empty Message={t("superAdmin.noTransactionsYet")} />
      )}

      <PagingButtons
        hide={rows.length === 0}
        isLoading={isLoading}
        currentPage={currentPage}
        hasMore={hasMore}
        movingForward={movingForward}
        onNext={() => {
          setCurrentPage((p) => p + 1);
          setMovingForward(true);
          setTransactionId(apiRes.data.transactions[PAGE_SIZE - 1].id);
        }}
        onPrevious={() => {
          setCurrentPage((p) => p - 1);
          setMovingForward(false);
          setTransactionId(apiRes.data.transactions[0].id);
        }}
        t={t}
      />
    </Page>
  );
}

function PagingButtons({
  hide,
  isLoading,
  currentPage,
  hasMore,
  movingForward,
  onNext,
  onPrevious,
  t,
}) {
  if (hide) return null;

  return (
    <div className="d-flex flex-row justify-content-end">
      <button
        className="button button-round button-border button-dark mr-2"
        disabled={isLoading || currentPage === 1}
        onClick={onPrevious}
      >
        {t("previous")}
      </button>
      <button
        className="button button-round button-shadow"
        disabled={isLoading || (movingForward && !hasMore)}
        onClick={onNext}
      >
        {t("next")}
      </button>
    </div>
  );
}

function toCurrencyString(amount, currency) {
  return currency.toUpperCase() + " " + (amount / 100).toFixed(2);
}

export default withTranslation()(AccountOwnerTransactionHistory);
