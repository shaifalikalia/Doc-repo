import Page from "components/Page";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import styles from "./SupportHelpdesk.module.scss";
import "./supportHelpDesk.scss";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import Select from "react-select";
import HelpdeskCard from "./components/HelpdeskCard";

const HelpDesk = ({ t }) => {
  const PAGE_SIZE = 5;
  const [pageNumber, setPageNumber] = useState(1);
  let totalItems = 30;

  const options = [
    {
      value: 0,
      label: t("superAdminSupportHelpDesk.allTickets"),
    },
    {
      value: 1,
      label: t("superAdminSupportHelpDesk.resolved"),
    },
    {
      value: 2,
      label: t("superAdminSupportHelpDesk.inProgress"),
    },
    {
      value: 3,
      label: t("superAdminSupportHelpDesk.pending"),
    },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <Page>
      <Row className="align-items-center">
        <Col md="5">
          <h2 class="page-title mb-md-0 mb-4">
            {t("superAdminSupportHelpDesk.supportHelpdesk")}
          </h2>
        </Col>
      </Row>
      <div className="d-sm-flex my-4 py-2 justify-content-between align-items-center">
        <div className={"search-box " + styles["helpdesk-search"]}>
          <input
            type="text"
            placeholder={t("superAdminSupportHelpDesk.searchbyTicketNo")}
          />
          <span className="ico">
            <img
              src={require("assets/images/search-icon.svg").default}
              alt="icon"
            />
          </span>
        </div>
        <div className="member-filter review-rating-filter">
          <Select
            options={options}
            defaultValue={selectedOption}
            className={["react-select-container pl-2"]}
            onChange={setSelectedOption}
            classNamePrefix="react-select"
          />
        </div>
      </div>

      <HelpdeskCard
        ticketStatus={t("superAdminSupportHelpDesk.pending")}
        statusClass="pending"
        ticketTitle="Refunds"
        name="Cristian Chester"
        ticketNo="34567889"
      />
      <HelpdeskCard
        ticketStatus={t("superAdminSupportHelpDesk.inProgress")}
        statusClass="progress"
        ticketTitle="Payments"
        ticketNo="34567888"
        name="Shanae Pena"
        orderNo="#23456"
      />
      <HelpdeskCard
        ticketStatus={t("superAdminSupportHelpDesk.resolved")}
        statusClass="resolved"
        ticketTitle="Technical Issues"
        ticketNo="34567890"
        name="Kaitlin Mcphee"
      />
      <HelpdeskCard
        ticketStatus={t("superAdminSupportHelpDesk.resolved")}
        statusClass="resolved"
        ticketTitle="Order Issues"
        ticketNo="34567891"
        name="Konnor Sandoval"
      />
      <HelpdeskCard
        ticketStatus={t("superAdminSupportHelpDesk.resolved")}
        statusClass="resolved"
        ticketTitle="Payments"
        ticketNo="34567889"
        name="Clinton Webster"
        orderNo="#23456"
      />
      <PaginationProvider
        pagination={paginationFactory({
          custom: true,
          sizePerPage: PAGE_SIZE,
          totalSize: totalItems,
          page: pageNumber,
          onPageChange: setPageNumber,
        })}
      >
        {({ paginationProps, paginationTableProps }) => {
          return (
            <div className="data-table-block support-table-block">
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
  );
};

export default withTranslation()(HelpDesk);
