import React, { useState, useEffect, useCallback } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Table from "components/table";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Empty from "components/Empty";
import constants from "../../../../../constants";
import { getStorage, setStorage, convertIntoTwoDecimal } from "utils";
import Loader from "components/Loader";
import { debounce } from "lodash";
import { useVendorEnterPriseList } from "repositories/subscription-repository";
import useHandleApiError from "hooks/useHandleApiError";
import "./../../VendorsubscriptionPlans.scss";
import useRemoveCache from "hooks/useRemoveCache";

const PAGE_SIZE = 10;
const { vendorEnterpriceCache } = constants.vendor.cache;

const EnterpriseSubscription = ({ t, history }) => {
  const onBack = () => history.push("/vendor-subscription-plans");
  const cacheValue = getStorage(vendorEnterpriceCache) || {};
  const [pageNumber, setPageNumber] = useState(cacheValue.pageNumber || 1);
  const [searchText, setSearchText] = useState(cacheValue.searchText);
  const [apiSearchText, setApiSearchText] = useState(
    cacheValue?.searchText || null
  );

  const {
    data: enterpriseList,
    isLoading,
    isFetching,
    error,
  } = useVendorEnterPriseList(apiSearchText, pageNumber, PAGE_SIZE);
  useHandleApiError(isLoading, isFetching, error);
  useRemoveCache(
    [constants.routes.superAdmin.enterpriseSubscriptionDetails],
    vendorEnterpriceCache
  );

  useEffect(() => {
    setStorage(vendorEnterpriceCache, {
      pageNumber,
      searchText,
    });
  }, [pageNumber, searchText]);

  const columns = [
    {
      attrs: { datatitle: t("superAdminVendorSubscription.packageName") },
      dataField: "name",
      text: t("superAdminVendorSubscription.packageName"),
      formatter: (cellContent, row, rowIndex) => (
        <Link
          to={{
            pathname: constants.routes.superAdmin.enterpriseSubscriptionDetails,
            state: row,
          }}
        >
          {" "}
          {row.name}{" "}
        </Link>
      ),
    },
    {
      attrs: { datatitle: t("superAdminVendorSubscription.vendorCharges") },
      dataField: "vendorChargeUnitPrice",
      text: t("superAdminVendorSubscription.vendorCharges"),
      formatter: (cellContent, row, rowIndex) => (
        <span>{`CAD ${convertIntoTwoDecimal(row.vendorChargeUnitPrice)}`}</span>
      ),
    },
    {
      attrs: { datatitle: t("superAdminVendorSubscription.salesRepCharges") },
      dataField: "perSalesRepresentativeUnitPrice",
      text: t("superAdminVendorSubscription.salesRepCharges"),
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {`CAD ${convertIntoTwoDecimal(row.perSalesRepresentativeUnitPrice)}`}
        </span>
      ),
    },
    {
      attrs: { datatitle: "" },
      dataField: "id",
      text: "",
      formatter: (cellContent, row, rowIndex) => (
        <Link
          className="table-row-main-link"
          to={{
            pathname: constants.routes.superAdmin.editEnterPricePlan,
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

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
    searchHandle(value);
  };

  const searchHandle = useCallback(
    debounce((searchValue) => {
      setPageNumber(1);
      setApiSearchText(searchValue);
    }, 1000),
    []
  );

  return (
    <Page onBack={onBack}>
      <Row className="align-items-center">
        {isLoading && <Loader />}
        <Col md="7">
          <h2 class="page-title mb-md-0 mb-4">
            {t("superAdminVendorSubscription.enterpriseSubscriptionForVendors")}
          </h2>
        </Col>
        <Col md="5" className="text-md-right add-tax">
          <Link to={constants.routes.superAdmin.addNewPlan}>
            <button
              className="button button-round button-shadow"
              title={t("superAdminVendorSubscription.addNewPlan")}
            >
              {t("superAdminVendorSubscription.addNewPlan")}
            </button>
          </Link>
        </Col>
      </Row>

      <div className="d-sm-flex my-4 py-2 justify-content-between align-items-center">
        <div className={"search-box "}>
          <input
            type="text"
            value={searchText}
            onChange={handleSearch}
            placeholder={t("superAdminVendorSubscription.searchPlans")}
          />
          <span className="ico">
            <img
              src={require("assets/images/search-icon.svg").default}
              alt="icon"
            />
          </span>
        </div>
      </div>
      <div className="enterprise-subscription">
        {enterpriseList?.data?.length > 0 ? (
          <Table
            keyField="id"
            data={enterpriseList?.data}
            columns={columns}
            handlePagination={(e) => setPageNumber(e)}
            pageNumber={pageNumber}
            totalItems={enterpriseList?.pagination?.totalItems}
            pageSize={PAGE_SIZE}
          />
        ) : (
          <Empty Message={t("noRecordFound")} />
        )}
      </div>
    </Page>
  );
};

export default withTranslation()(EnterpriseSubscription);
