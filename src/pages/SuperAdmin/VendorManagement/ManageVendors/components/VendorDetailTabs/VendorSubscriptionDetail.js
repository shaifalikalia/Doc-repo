import Table from "components/table";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import styles from "./../../../ManageVendors/ManageVendors.module.scss";
import "./../../Detail/Detail.scss";

import Page from "components/Page";
import { Link } from "react-router-dom";
import { useGetVendorSubDetails } from "repositories/subscription-repository";
import Loader from "components/Loader";
import useHandleApiError from "hooks/useHandleApiError";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { convertIntoTwoDecimal } from "utils";
import Empty from "components/Empty";
import constants from "../../../../../../constants";
import { useInvoiceEntries } from "repositories/invoice-repository";
import moment from "moment";

const PAGE_SIZE = 10;
const ViewVendorDetails = ({ t, history }) => {
  const [pageNumber, setPageNumber] = useState(1);
  let location = useLocation();
  let vendorId = location.state?.vendorId;
  const { data, isLoading, isFetching, error } = useGetVendorSubDetails(
    vendorId,
    {
      enabled: vendorId ? true : false,
    }
  );

  const onBack = () => history.goBack();
  let vendorDetails = data?.data || {};

  useHandleApiError(isLoading, isFetching, error);

  const {
    data: dataInvoice,
    isLoading: isLoadingInvoice,
    isFetching: isFetchingInvoice,
    error: errorInvoice,
  } = useInvoiceEntries(vendorId, pageNumber, PAGE_SIZE);

  useHandleApiError(isLoadingInvoice, isFetchingInvoice, errorInvoice);

  let totalItems = dataInvoice?.pagination?.totalItems || 0;

  const columns = [
    {
      text: t("superAdmin.subscriptionName"),
      dataField: "packageName",
      formatter: (cellContent, row) => {
        if (isLoading)
          return <div className="text-placeholder-150 shimmer-animation"></div>;

        return (
          <div style={{ cursor: "pointer" }}>
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

  return (
    <>
      <Page
        className={styles["vendor-subscription-details"]}
        title={t("superAdminVendorManagement.vendorSubscriptionDetails")}
        onBack={onBack}
      >
        {(isLoading || isLoadingInvoice) && <Loader />}
        <div className="card app-card manage-vendor-card">
          <div className="card-body app-card-body">
            <div className="d-flex flex-row justify-content-between">
              <div className="aod-dc-head">
                {t("superAdminVendorSubscription.currentSubscription")}
              </div>
              <div>
                <Link
                  to={{
                    pathname:
                      constants.routes.superAdmin.editSubscriptionForVendors,
                    state: { ...vendorDetails, ...location?.state },
                  }}
                >
                  <span>
                    {" "}
                    <img
                      src={require("assets/images/edit-icon.svg").default}
                      alt="icon"
                    />
                  </span>
                </Link>{" "}
              </div>
            </div>
            <hr />
            <div className="d-flex flex-row justify-content-between">
              <div className="aod-dc-title">
                {t("superAdminVendorSubscription.vendorCharges")}
              </div>
              <div class="aod-dc-value">
                {" "}
                {`CAD ${convertIntoTwoDecimal(vendorDetails?.vendorCharge)}`}
              </div>
            </div>
            <hr />
            <div className="d-flex flex-row justify-content-between">
              <div className="aod-dc-title">
                {t("superAdminVendorSubscription.salesRepCharges")}
              </div>
              <div class="aod-dc-value">{`CAD ${convertIntoTwoDecimal(
                vendorDetails?.perSalesRepCharge
              )}/sales rep`}</div>
            </div>
          </div>
        </div>

        <div className="vendor-table">
          <h2 class={"page-title " + styles["previousInvoices"]}>
            {t("superAdminVendorManagement.previousInvoices")}
          </h2>

          {dataInvoice?.data?.length > 0 ? (
            <Table
              columns={columns}
              data={dataInvoice?.data}
              keyField="id"
              handlePagination={setPageNumber}
              pageNumber={pageNumber}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
            />
          ) : (
            <Empty Message={t("superAdmin.noInvoicesYet")} />
          )}
        </div>
      </Page>
    </>
  );
};

export default withTranslation()(ViewVendorDetails);
