import Page from "components/Page";
import React, { useState } from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import styles from "./ManageCatalogue.module.scss";
import ManageCatalogueCard from "./components/ManageCatalogueCard";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import { Link } from "react-router-dom";
import useProductList from "./hooks/useProductList";
import Loader from "components/Loader";
import Empty from "components/Empty";
import constants from "../../../constants";
import ErrorImages from "./components/Modals/ErrorImages";
import ImportCatalogueModal from "./ImportCatalogueModal";

const ManageCatalogue = ({ t }) => {
  const { state, otherData, methods } = useProductList({ t });
  const [isImportCatalogueModalOpen, setIsImportCatalogueModalOpen] =
    useState(false);
  return (
    <LayoutVendor>
      <Page>
        {otherData.loading && <Loader />}
        <div className={styles["manage-catalogue"]}>
          <div
            className={
              styles["left-part"] + " d-flex d-md-block justify-content-between"
            }
          >
            <h2 className="page-title mt-0 mb-0 mr-2">
              {t("vendorManagement.manageCatalogue")}
            </h2>
            <span
              className="mr-md-4 d-flex d-md-none pointer"
              onClick={() => {
                setIsImportCatalogueModalOpen(true);
              }}
            >
              <img
                src={require("assets/images/alert-circle-black.svg").default}
                alt="icon"
              />
            </span>
          </div>
          <div className={styles["right-part"]}>
            <button
              className="button button-round button-dark button-border  mr-lg-2 mr-md-1 w-sm-100"
              onClick={methods.downloadExampleCsv}
              title={t("vendorManagement.exportSampleCSV")}
            >
              {t("vendorManagement.exportSampleCSV")}
            </button>

            {/* image upload */}
            <span
              className={
                "button button-round button-dark button-border  mr-lg-2 mr-md-1  mt-md-0 mt-3 " +
                styles["catalogue-btn"]
              }
            >
              {t("vendorManagement.uploadImages")}
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                multiple
                onChange={methods.uploadImages}
                onClick={(event) => {
                  event.target.value = null;
                }}
              />
            </span>
            {/* image upload delivery */}

            <span
              className={
                "button button-round button-dark button-border  mr-lg-2 mr-md-1 mt-md-0 mt-3 " +
                styles["catalogue-btn"]
              }
            >
              {t("vendorManagement.importCatalogue")}
              <input
                type="file"
                onChange={methods.uploadCsv}
                accept=".xlsx, .xls, .csv"
                onClick={(event) => {
                  event.target.value = null;
                }}
              />{" "}
            </span>
            <span
              className="mr-lg-4 mr-md-2 d-none d-md-inline-block pointer"
              onClick={() => {
                setIsImportCatalogueModalOpen(true);
              }}
            >
              <img
                src={require("assets/images/alert-circle-black.svg").default}
                alt="icon"
              />
            </span>

            <Link
              to={constants.routes.vendor.addNewItem}
              className={
                "button button-round button-shadow  mt-md-0 mt-3 w-sm-100 mt-sm-3" +
                styles["green-button"]
              }
              title={t("vendorManagement.addNewItem")}
            >
              {t("vendorManagement.addNewItem")}
            </Link>
          </div>
        </div>
        <div className={"search-box " + styles["vendor-search"]}>
          <input
            type="text"
            value={state.searchTerm}
            onChange={methods.handleSearchTerm}
            placeholder={t("vendorManagement.searchByItemNoName")}
          />
          <span className="ico">
            <img
              src={require("assets/images/search-icon.svg").default}
              alt="icon"
            />
          </span>
        </div>
        {!!state.productList.length &&
          state.productList.map((product) => (
            <ManageCatalogueCard
              key={product.id}
              product={product}
              refetch={methods.refetch}
            />
          ))}
        {state.totalPages > 1 && (
          <div className="mt-md-0 mt-4">
            <PaginationProvider
              pagination={paginationFactory({
                custom: true,
                sizePerPage: otherData.pageSize,
                totalSize: state.totalProducts,
                page: state.currentPage,
                onPageChange: methods.handlePageNumber,
              })}
            >
              {({ paginationProps, paginationTableProps }) => {
                return (
                  <div className="data-table-block">
                    {/* Paginator component needs table to work, this is why we have used it.  */}
                    <div style={{ display: "none" }}>
                      <BootstrapTable
                        keyField={"id"}
                        data={[]}
                        columns={[{ dataField: "sometext", text: "sometext" }]}
                        {...paginationTableProps}
                      />
                    </div>

                    <div
                      className={
                        "pagnation-block " + styles["mobile-align-center"]
                      }
                    >
                      {state.totalPages > 1 && (
                        <PaginationListStandalone {...paginationProps} />
                      )}
                    </div>
                  </div>
                );
              }}
            </PaginationProvider>
          </div>
        )}

        {state.imageFiles.isOpen && (
          <ErrorImages
            closeModel={methods.closeModel}
            details={state.arrayOfUnUploadedImages || []}
          />
        )}

        {!state.productList.length && (
          <div className={styles["empty-list"]}>
            <Empty Message={t("vendorManagement.noItemAvailable")} />
          </div>
        )}

        {isImportCatalogueModalOpen && (
          <ImportCatalogueModal
            closeImportCatalogueModal={() => {
              setIsImportCatalogueModalOpen(false);
            }}
            isImportCatalogueModalOpen={isImportCatalogueModalOpen}
            setIsImportCatalogueModalOpen={setIsImportCatalogueModalOpen}
          />
        )}
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(ManageCatalogue);
