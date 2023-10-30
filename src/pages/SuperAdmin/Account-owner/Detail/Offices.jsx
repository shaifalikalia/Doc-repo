import Empty from "components/Empty";
import Table from "components/table";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useOfficesByUserId } from "repositories/office-repository";
import "./Detail.scss";

const Offices = ({ accountOwnerId, t }) => {
  const PAGE_SIZE = 3;
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  let { isLoading, data: apiRes } = useOfficesByUserId(
    accountOwnerId,
    pageNumber,
    PAGE_SIZE,
    searchTerm
  );

  const columns = [
    {
      text: t("superAdmin.officeName"),
      dataField: "name",
      formatter: (cellContent) => {
        if (!isLoading) return cellContent;

        return <div className="shimmer-animation aod-o-placeholder1"></div>;
      },
    },
    {
      text: t("superAdmin.address"),
      dataField: "address",
      formatter: (cellContent) => {
        if (!isLoading) return cellContent;

        return <div className="shimmer-animation aod-o-placeholder2"></div>;
      },
    },
    {
      text: t("superAdmin.contactNo"),
      dataField: "contactNumber",
      formatter: (cellContent) => {
        if (!isLoading) return cellContent;

        return <div className="shimmer-animation aod-o-placeholder1"></div>;
      },
    },
    {
      align: "right",
      formatter: (cellContent, row) => {
        if (!isLoading)
          return (
            <Link
              to={{
                pathname: `/office/${row.id}/staff`,
                state: {
                  officeId: row.id,
                  officeName: row.name,
                  accountOwnerName: `${row.accountOwner.firstName} ${row.accountOwner.lastName}`,
                },
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
                <u>{t("superAdmin.viewStaffMembers")}</u>
              </span>
            </Link>
          );

        return <div className="shimmer-animation aod-o-placeholder1"></div>;
      },
    },
  ];

  let rows = [];
  let totalItems = 0;
  if (!isLoading && apiRes.statusCode === 200) {
    rows = apiRes.data;
    totalItems = apiRes.pagination.totalItems;
  } else {
    for (let i = 0; i < PAGE_SIZE; i++) rows.push({});
  }

  return (
    <>
      <div className="d-flex flex-row justify-content-end mb-4">
        <div className="search-box">
          <span className="ico">
            <img
              src={require("assets/images/search-icon.svg").default}
              alt="icon"
            />
          </span>
          <input
            placeholder={t("superAdmin.searchByName")}
            onChange={(e) => {
              setPageNumber(1);
              setSearchTerm(e.target.value);
            }}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={rows}
        keyField="id"
        handlePagination={setPageNumber}
        pageNumber={pageNumber}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
      />

      {!isLoading && totalItems === 0 && (
        <Empty Message={t("superAdmin.noActiveOffices")} />
      )}
    </>
  );
};

export default withTranslation()(Offices);
