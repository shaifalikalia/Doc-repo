import Page from "components/Page";
import Table from "components/table";
import constants, {
  getAppTypeById,
  getDeviceTypeById,
} from "./../../../../constants";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { useAppVersions } from "repositories/app-version-repository";
import { encodeId, formatDate } from "./../../../../utils";
import { Link } from "react-router-dom";
import Toast from "components/Toast";
import Empty from "components/Empty";

const PAGE_SIZE = 10;

function AppVersionList({ t }) {
  const [pageNumber, setPageNumber] = useState(1);

  const {
    isLoading,
    error,
    data: apiRes,
  } = useAppVersions(pageNumber, PAGE_SIZE);

  if (error || (!isLoading && apiRes.statusCode !== 200))
    return errorView(error, apiRes, t);

  const columns = [
    {
      text: t("superAdmin.appVersion"),
      dataField: "version",
      formatter: (cellContent, row) => {
        if (!isLoading) return cellContent;
        return <div className="text-placeholder-50 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.deviceType"),
      dataField: "deviceType",
      formatter: (cellContent) => {
        if (!isLoading) return getDeviceTypeById(cellContent).title;
        return <div className="text-placeholder-100 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.appType"),
      dataField: "appType",
      formatter: (cellContent) => {
        if (!isLoading) return getAppTypeById(cellContent).title;
        return <div className="text-placeholder-100 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.isMandatory"),
      dataField: "isMandatory",
      formatter: (cellContent) => {
        if (!isLoading)
          return cellContent ? t("superAdmin.yes") : t("superAdmin.no");
        return <div className="text-placeholder-50 shimmer-animation"></div>;
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
        return <div className="text-placeholder-100 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.createdAt"),
      dataField: "createdAt",
      formatter: (cellContent) => {
        if (!isLoading) return formatDate(cellContent);
        return <div className="text-placeholder-100 shimmer-animation"></div>;
      },
    },
    {
      text: t("superAdmin.actions"),
      formatter: (cellContent, row) => {
        if (isLoading)
          return <div className="text-placeholder-100 shimmer-animation"></div>;

        return (
          <Link to={`${constants.routes.appVersionForm}/${encodeId(row.id)}`}>
            <span
              className="pointer"
              style={{
                fontSize: "12px",
                color: "#587e85",
                marginRight: "10px",
              }}
            >
              <u>
                {t("superAdmin.edit")} {t("superAdmin.appVersion")}
              </u>
            </span>
          </Link>
        );
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
    <Page
      titleKey="superAdmin.appVersions"
      actionButton={
        <Link to={constants.routes.appVersionForm}>
          <button className="button button-shadow button-round">
            {t("superAdmin.addAppVersion")}
          </button>
        </Link>
      }
    >
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
        <Empty Message={t("superAdmin.noAppVersionFound")} />
      )}
    </Page>
  );
}

function errorView(error, apiRes, t) {
  return (
    <Page
      titleKey="superAdmin.appVersions"
      actionButton={
        <Link to={constants.routes.appVersionForm}>
          <button className="button button-round">
            {t("superAdmin.addAppVersion")}
          </button>
        </Link>
      }
    >
      <Toast
        errorToast={true}
        message={error ? error.message : apiRes.message}
      />
    </Page>
  );
}

export default withTranslation()(AppVersionList);
