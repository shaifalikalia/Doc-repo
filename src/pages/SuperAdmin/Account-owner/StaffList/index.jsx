import Empty from "components/Empty";
import Page from "components/Page";
import Table from "components/table";
import Toast from "components/Toast";
import React from "react";
import Select from "react-select";
import { useState } from "react";
import { withTranslation } from "react-i18next";
import { useStaff } from "repositories/office-repository";

function StaffList({ history, match, t }) {
  if (history.location.state === undefined) {
    history.goBack();
  }

  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState(null);
  const PAGE_SIZE = 4;

  const {
    isLoading,
    data: apiRes,
    error,
  } = useStaff(
    match.params.officeId,
    pageNumber,
    PAGE_SIZE,
    searchTerm,
    activeStatusFilter
  );

  const { officeName, accountOwnerName } = history.location.state;

  if (error || (!isLoading && apiRes.statusCode !== 200)) {
    return (
      <Page titleKey="staffMembers" onBack={history.goBack}>
        <div>
          {accountOwnerName} - {officeName}
        </div>

        <Toast
          errorToast={true}
          message={error ? error.message : apiRes.message}
        />
      </Page>
    );
  }

  const columns = [
    {
      text: t("superAdmin.staffName"),
      formatter: (cellContent, row) => {
        if (!isLoading) return `${row.firstName} ${row.lastName}`;

        return <div className="text-placeholder-150 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.role"),
      dataField: "designation.title",
      formatter: (cellContent) => {
        if (!isLoading) return cellContent;

        return <div className="text-placeholder-150 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.contactNo"),
      dataField: "contactNumber",
      formatter: (cellContent) => {
        if (!isLoading) return cellContent;

        return <div className="text-placeholder-150 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.status"),
      dataField: "isActive",
      formatter: (cellContent) => {
        if (!isLoading)
          return cellContent
            ? t("superAdmin.active")
            : t("superAdmin.inactive");

        return <div className="text-placeholder-150 shimmer-animation"></div>;
      },
    },
  ];

  let rows = [];
  let totalItems = 0;

  if (!isLoading) {
    rows = apiRes.data;
    totalItems = apiRes.pagination.totalItems;
  } else {
    rows = new Array(PAGE_SIZE).fill({});
  }

  return (
    <Page titleKey="staffMembers" onBack={history.goBack}>
      <div>
        {accountOwnerName} - {officeName}
      </div>

      <div className="d-flex flex-row justify-content-between my-4">
        <StatusDropdown
          value={activeStatusFilter}
          onChange={(value) => {
            setPageNumber(1);
            setActiveStatusFilter(value);
          }}
        />
        <SearchInput
          value={searchTerm}
          onChange={(value) => {
            setPageNumber(1);
            setSearchTerm(value);
          }}
          t={t}
        />
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
        <Empty Message={t("noStaffMemberFound")} />
      )}
    </Page>
  );
}

const options = [
  { value: true, label: "Active Members" },
  { value: false, label: "Inactive Members" },
  { value: null, label: "All Members" },
];

function StatusDropdown({ value, onChange }) {
  value = options.find((it) => it.value === value);

  return (
    <div className="app-select">
      <span className="ico">
        <img src={require("assets/images/user-icon.svg").default} alt="icon" />
      </span>
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={options}
        value={value}
        onChange={(option) => onChange(option.value)}
        isSearchable={false}
      />
    </div>
  );
}

function SearchInput({ value, onChange, t }) {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder={t("superAdmin.searchByName")}
        onInput={(e) => onChange(e.target.value)}
        value={value}
      />
      <span className="ico">
        <img
          src={require("assets/images/search-icon.svg").default}
          alt="icon"
        />
      </span>
    </div>
  );
}

export default withTranslation()(StaffList);
