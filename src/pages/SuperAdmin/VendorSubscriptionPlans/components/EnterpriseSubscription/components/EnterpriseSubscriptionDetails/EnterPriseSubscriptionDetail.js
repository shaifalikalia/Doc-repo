import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Table from "components/table";
import Empty from "components/Empty";
import { Col, Row } from "reactstrap";
import Loader from "components/Loader";

import { useVendorAssignees } from "repositories/subscription-repository";
import useHandleApiError from "hooks/useHandleApiError";
import { Link, useLocation } from "react-router-dom";
import constants from "../../../../../../../constants";
import { setStorage, getStorage, removeStorage } from "utils";
import "./../../../../VendorsubscriptionPlans.scss";

const pageSize = 8;
const { vendorEnterPriceAssignCache } = constants.vendor.cache;

const EnterpriseSubscriptionDetails = ({ t, history }) => {
  const onBack = () => {
    history.push(constants.routes.superAdmin.enterpriseSubscription);
  };
  const cacheValue = getStorage(vendorEnterPriceAssignCache) || {};
  const location = useLocation();
  const packageId = location?.state?.id;
  const [pageNumber, setPageNumber] = useState(cacheValue?.pageNumber || 1);
  const { data, isLoading, isFetching, error } = useVendorAssignees(
    pageSize,
    pageNumber,
    packageId,
    {
      enabled: !!packageId,
    }
  );
  useHandleApiError(isLoading, isFetching, error);
  useEffect(() => {
    return () => {
      removeStorage([vendorEnterPriceAssignCache]);
    };
  }, []);

  const handlePagination = (number) => {
    setPageNumber(number);
    setStorage(vendorEnterPriceAssignCache, { pageNumber: number });
  };

  const columns = [
    {
      attrs: { datatitle: t("superAdminVendorSubscription.name") },
      dataField: "userName",
      text: t("superAdminVendorSubscription.name"),
    },
    {
      attrs: { datatitle: t("superAdminVendorSubscription.emailAddress") },
      dataField: "userEmail",
      text: t("superAdminVendorSubscription.emailAddress"),
    },

    {
      attrs: { datatitle: "" },
      dataField: "userName",
      text: "",
      formatter: (cellContent, row, rowIndex) => (
        <Link
          className="table-row-main-link"
          to={{
            pathname: constants.routes.superAdmin.editAssignedVendor,
            state: row,
          }}
        >
          <span>
            <u>{t("edit")}</u>{" "}
          </span>
        </Link>
      ),
    },
  ];

  return (
    <Page onBack={onBack}>
      {isLoading && <Loader />}
      <Row>
        <Col md="7">
          <h2 class="page-title mb-md-0 mb-4">
            {t("superAdminVendorSubscription.enterpriseExclusiveForVendors")}
          </h2>
        </Col>
        <Col md="5" className="text-md-right add-tax">
          <Link
            to={{
              pathname: constants.routes.superAdmin.addNewVendor,
              state: { id: packageId },
            }}
          >
            <button
              className="button button-round button-shadow addNewVendor"
              title={t("superAdminVendorSubscription.addNewVendor")}
            >
              {t("superAdminVendorSubscription.addNewVendor")}
            </button>
          </Link>
        </Col>
      </Row>

      <div className="enterprise-subscription enterprise-subscription-details">
        {data?.data?.length > 0 ? (
          <Table
            keyField="id"
            data={data?.data}
            columns={columns}
            handlePagination={handlePagination}
            pageNumber={pageNumber}
            totalItems={data.pagination.totalItems}
            pageSize={pageSize}
          />
        ) : (
          <Empty Message={t("noRecordFound")} />
        )}
      </div>
    </Page>
  );
};

export default withTranslation()(EnterpriseSubscriptionDetails);
