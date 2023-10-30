import React from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import "./category.scss";
import AddNewCategoryModal from "./components/AddNewCategory";
import Table from "components/table";
import { Fragment } from "react";
import { Col, Row } from "reactstrap";
import { useCategories } from "../Hooks/useCategories";
import Loader from "components/Loader";
import Empty from "components/Empty";
import ActDecCategories from "./components/ActDecCategories";

const categoryMaxLength = 120;
const ManageCategories = ({ t }) => {
  const {
    showCategoryPopup,
    submitCategory,
    showLoader,
    pageNumber,
    setPageNumber,
    pageSize,
    totalItems,
    categoryListing,
    optimisedSearch,
    closePopUp,
    openPopUp,
    editCategoryDetails,
    searchTextInput,
    changeCategory,
    setChangeCategory,
    actiDecCategory,
  } = useCategories();

  const columns = [
    {
      attrs: { datatitle: t("superAdminCategories.name") },
      dataField: "name",
      text: t("superAdminCategories.name"),
    },
    {
      attrs: { datatitle: t("superAdminCategories.status") },
      dataField: "status",
      text: t("superAdminCategories.status"),
      formatter: (cellContent, row, rowIndex) => (
        <span>{row.isActive ? "Active" : "Deactivate"} </span>
      ),
    },

    {
      text: "",
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <span className="link-btn" onClick={() => openPopUp(row)}>
            <u>Edit</u>{" "}
          </span>
          {!row.isActive ? (
            <span
              className="pointer"
              style={{ color: "#587E85" }}
              title="Activate"
              onClick={() => setChangeCategory({ open: true, ...row })}
            >
              <u>Activate</u>
            </span>
          ) : (
            <span
              className="pointer"
              style={{ color: "#e76f2a" }}
              title="Deactivate"
              onClick={() => setChangeCategory({ open: true, ...row })}
            >
              <u>Deactivate</u>
            </span>
          )}
        </Fragment>
      ),
    },
  ];

  return (
    <Page>
      {showLoader && <Loader />}
      <Row className="align-items-center">
        <Col md="7">
          <h2 class="page-title mb-md-0 mb-4">
            {t("superAdminCategories.manageCategories")}
          </h2>
        </Col>
        <Col md="5" className="text-md-right add-category">
          <button
            onClick={() => openPopUp()}
            className="button button-round button-shadow"
            title={t("superAdminCategories.addNewCategory")}
          >
            {t("superAdminCategories.addNewCategory")}
          </button>
        </Col>
      </Row>
      <div className="d-sm-flex my-4 py-2 justify-content-between align-items-center">
        <div className={"search-box "}>
          <input
            type="text"
            placeholder={t("superAdminCategories.searchByName")}
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

      <div className="category-table">
        {categoryListing.length > 0 ? (
          <Table
            className="vendor-table"
            keyField="id"
            data={categoryListing}
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

      {showCategoryPopup && (
        <AddNewCategoryModal
          submitCategory={submitCategory}
          showCategoryPopup={showCategoryPopup}
          toogleAddCategoryPopUp={closePopUp}
          showLoader={showLoader}
          categoryMaxLength={categoryMaxLength}
          editCategoryDetails={editCategoryDetails}
        />
      )}

      <ActDecCategories
        t={t}
        changeCategory={changeCategory}
        setChangeCategory={setChangeCategory}
        actiDecCategory={actiDecCategory}
      />
    </Page>
  );
};

export default withTranslation()(ManageCategories);
