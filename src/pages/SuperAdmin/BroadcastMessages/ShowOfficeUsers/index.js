import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./index.module.scss";
import Toast from "components/Toast/Alert";
import Table from "components/table";
import { useAllSelectedOwners } from "repositories/broadcast-repository";
function ShowOfficeUsers({ t, setShowUsers, broadcastDetailId }) {
  const pageSize = 10;
  let totalItems = 0;
  const [pageNumber, setPageNumber] = useState(1);
  const { isLoading, error, data } = useAllSelectedOwners(
    pageNumber,
    pageSize,
    broadcastDetailId
  );

  if (!isLoading && error) {
    return <Toast errorToast message={error.message} />;
  }

  const columns = [
    {
      dataField: "messageName",
      text: t("superAdmin.AccountOwnerName"),
      formatter: (cellContent, row) => {
        if (!isLoading) return `${row.owner.firstName} ${row.owner.lastName}`;
        return <div className="text-placeholder-50 shimmer-animation"></div>;
      },
    },
    {
      dataField: "createdAt",
      text: "Sent to",
      formatter: (cellContent, row) => {
        if (!isLoading)
          return row.sendToStaff
            ? t("superAdmin.sentToOwnerAndStaff")
            : row.sendToOwner
            ? t("superAdmin.sentToOwner")
            : "";
        return <div className="text-placeholder-50 shimmer-animation"></div>;
      },
    },
  ];

  let rows = [];
  if (!isLoading && data.items) {
    rows = data.items;
    totalItems = data.totalCount;
  } else {
    rows = new Array(pageSize).fill({});
    totalItems = pageSize;
  }
  return (
    <Page onBack={() => setShowUsers(false)}>
      <div className={styles["broadcast-message-detail"]}>
        <h2 className="page-title mt-2 mb-4">
          {t("superAdmin.broadcastMessageDetails")}{" "}
        </h2>
        <div className="data-list">
          <Table
            columns={columns}
            data={rows}
            keyField="id"
            handlePagination={setPageNumber}
            pageNumber={pageNumber}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </div>
      </div>
    </Page>
  );
}
export default withTranslation()(ShowOfficeUsers);
