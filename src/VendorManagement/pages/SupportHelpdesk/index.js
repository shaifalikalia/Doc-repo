import Page from "components/Page";
import React from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import styles from "./SupportHelpdesk.module.scss";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import { Link } from "react-router-dom";
import Select from "react-select";
import HelpdeskCard from "./components/HelpdeskCard";
import constants from "../../../constants";
import { useTicketList } from "./Hooks/useTicketList";
import Loader from "components/Loader";
import Empty from "components/Empty";
import { isValueEmpty } from "utils";

const SupportHelpdesk = ({ t }) => {
  const {
    isLoading,
    PAGE_SIZE,
    pageNumber,
    totalItems,
    list,
    searchText,
    selectedOption,
    options,
    handleSearch,
    updatePageNumber,
    handleStatus,
  } = useTicketList({ t });

  return (
    <LayoutVendor>
      <Page>
        {isLoading && <Loader />}
        <Row className="align-items-center">
          <Col md="5">
            <h2 className="page-title mt-0 mb-md-0 mb-3">
              {t("vendorManagement.supportHelpdesk")}
            </h2>
          </Col>
          <Col md="7" className="text-md-right">
            <Link
              to={constants.routes.vendor.addNewTicket}
              className="button button-round button-shadow w-sm-100"
              title={t("vendorManagement.addNewTicket")}
            >
              {t("vendorManagement.addNewTicket")}
            </Link>
          </Col>
        </Row>
        <div className="d-sm-flex my-4 py-md-2 justify-content-between align-items-center">
          <div className={"search-box " + styles["helpdesk-search"]}>
            <input
              type="text"
              placeholder={t("vendorManagement.searchbyTicketNo")}
              value={searchText}
              onChange={handleSearch}
            />
            <span className="ico">
              <img
                src={require("assets/images/search-icon.svg").default}
                alt="icon"
              />
            </span>
          </div>
          <div className="member-filter review-rating-filter helpdesk-filter">
            <Select
              options={options}
              defaultValue={options.find(
                (item) => item.value === selectedOption
              )}
              className={["react-select-container"]}
              onChange={handleStatus}
              classNamePrefix="react-select"
            />
          </div>
        </div>

        {list?.length ? (
          list?.map((item) => (
            <HelpdeskCard
              creationDate={isValueEmpty(item?.createdAt)}
              key={item.id}
              id={item.id}
              ticketStatus={isValueEmpty(item?.status)}
              statusClass={isValueEmpty(item?.className)}
              ticketTitle={isValueEmpty(
                item?.supportAndHelpDeskTicketType?.ticketType
              )}
              ticketNo={isValueEmpty(item?.ticketNo)}
              orderNo={isValueEmpty(item?.orderNumber)}
            />
          ))
        ) : (
          <Empty Message={t("superAdmin.noDataAvaliable")} />
        )}

        <PaginationProvider
          pagination={paginationFactory({
            custom: true,
            sizePerPage: PAGE_SIZE,
            totalSize: totalItems,
            page: pageNumber,
            onPageChange: updatePageNumber,
          })}
        >
          {({ paginationProps, paginationTableProps }) => {
            return (
              <div className="data-table-block">
                {/* Paginator component needs table to work, this is why we have used it.  */}
                <div style={{ display: "none" }}>
                  <BootstrapTable
                    keyField="id"
                    data={[]}
                    columns={[{ text: "sometext" }]}
                    {...paginationTableProps}
                  />
                </div>

                <div
                  className={"pagnation-block " + styles["mobile-align-center"]}
                >
                  {totalItems > PAGE_SIZE && (
                    <PaginationListStandalone {...paginationProps} />
                  )}
                </div>
              </div>
            );
          }}
        </PaginationProvider>
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(SupportHelpdesk);
