import React from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import "./tax.scss";
import AddTaxDetailsModal from "./components/AddTaxDetails";
import ViewTaxDetailsModal from "./components/ViewTaxDetails";
import Table from "components/table";
import { Col, Row } from "reactstrap";
import useTaxmanagment from "../Hooks/useTaxManagment";
import Loader from "components/Loader";
import Empty from "components/Empty";

const TaxManagement = ({ t }) => {
  const {
    showTaxManagmentPopup,
    toogleAddTaxPopUp,
    provienceList,
    showLoader,
    taxListing,
    setPageNumber,
    pageNumber,
    pageSize,
    totalItems,
    getTaxDetails,
    taxDetails,
    optimisedSearch,
    isRefetch,
    isEditTaxDetails,
    setisEditTaxDetails,
    closePopUp,
    searchTextInput,
  } = useTaxmanagment({ t });

  const columns = [
    {
      attrs: { datatitle: t("superAdminTax.taxName") },
      dataField: "name",
      text: t("superAdminTax.taxName"),
    },
    {
      attrs: { datatitle: t("superAdminTax.taxType") },
      text: t("superAdminTax.taxType"),
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {" "}
          {row.isSameForAllState
            ? t("superAdminTax.oneTax")
            : t("superAdminTax.provinceWiseTax")}{" "}
        </span>
      ),
    },
    {
      dataField: "contactNumber",
      text: "",
      formatter: (cellContent, row, rowIndex) => (
        <span
          onClick={() => {
            getTaxDetails(row);
          }}
          className=" link-btn"
        >
          {" "}
          {t("superAdminTax.viewDetails")}{" "}
        </span>
      ),
    },

    {
      attrs: { datatitle: "" },
      text: "",
      formatter: (cellContent, row, rowIndex) => (
        <span
          className=" link-btn"
          onClick={() => {
            setisEditTaxDetails(row);
          }}
        >
          {" "}
          {t("superAdminTax.edit")}{" "}
        </span>
      ),
    },
  ];

  return (
    <Page>
      {showLoader && <Loader />}
      <Row className="align-items-center">
        <Col md="7">
          <h2 class="page-title mb-md-0 mb-4">
            {t("superAdminTax.taxManagement")}
          </h2>
        </Col>
        <Col md="5" className="text-md-right add-tax">
          <button
            onClick={toogleAddTaxPopUp}
            className="button button-round button-shadow"
            title={t("superAdminTax.addTaxDetails")}
          >
            {t("superAdminTax.addTaxDetails")}
          </button>
        </Col>
      </Row>
      <div className="d-sm-flex my-4 py-2 justify-content-between align-items-center">
        <div className={"search-box "}>
          <input
            type="text"
            placeholder={t("superAdminTax.searchByName")}
            onChange={optimisedSearch}
            value={searchTextInput}
          />
          <span className="ico">
            <img
              src={require("assets/images/search-icon.svg").default}
              alt="icon"
            />
          </span>
        </div>
      </div>
      <div className="tax-table">
        {taxListing?.length > 0 ? (
          <Table
            className="vendor-table"
            keyField="id"
            data={taxListing}
            columns={columns}
            handlePagination={(e) => setPageNumber(e)}
            pageNumber={pageNumber}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        ) : (
          <Empty Message={t("superAdmin.noDataAvaliable")} />
        )}
      </div>

      {(showTaxManagmentPopup || isEditTaxDetails?.id) && (
        <AddTaxDetailsModal
          toogleAddTaxPopUp={closePopUp}
          provienceListing={provienceList}
          isEditTaxDetails={isEditTaxDetails}
          isRefetch={isRefetch}
        />
      )}

      {taxDetails?.id && (
        <ViewTaxDetailsModal
          taxDetails={taxDetails}
          closeModal={() => getTaxDetails({})}
          setisEditTaxDetails={setisEditTaxDetails}
        />
      )}
    </Page>
  );
};

export default withTranslation()(TaxManagement);
