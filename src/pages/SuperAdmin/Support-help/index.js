import Page from "components/Page";
import React, { useState, useEffect, useCallback } from "react";
import { withTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import styles from "./SupportHelpdesk.module.scss";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import Select from "react-select";
import HelpdeskCard from "./components/HelpdeskCard";
import { useTickets } from "repositories/support-helpdesk-repository";
import Loader from "components/Loader";
import Empty from "components/Empty";
import toast from "react-hot-toast";
import { isValueEmpty } from "utils";

const SupportHelpdesk = ({ t }) => {
  const PAGE_SIZE = 5;
  const [pageNumber, setPageNumber] = useState(1);
  const [statuses, setStatuses] = useState([]);
  const [ticketNo, setTicketNo] = useState("");
  const [ticketList, setTicketList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const { isLoading, error, data } = useTickets(
    pageNumber,
    PAGE_SIZE,
    statuses,
    ticketNo
  );

  const options = [
    {
      value: 0,
      label: t("vendorManagement.allTickets"),
      class: "",
    },
    {
      value: 1,
      label: t("vendorManagement.pending"),
      class: "pending",
    },
    {
      value: 2,
      label: t("vendorManagement.inProgress"),
      class: "inProgress",
    },
    {
      value: 3,
      label: t("vendorManagement.resolved"),
      class: "resolved",
    },
  ];

  const [
    selectedOption,
    //setSelectedOption
  ] = useState(options[0]);

  const debounce = (func, delayTime) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, delayTime);
    };
  };

  useEffect(() => {
    if (data) {
      setTicketList(data.data);
      setTotalItems(data.pagination.totalItems);
    } else {
      setTicketList([]);
      setTotalItems(0);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message);
      setPageNumber(1);
      setTotalItems(0);
    }
  }, [error]);

  let ticketListComponent;
  if (ticketList) {
    ticketListComponent =
      ticketList?.length > 0 &&
      ticketList?.map((eachTicket, index) => {
        return (
          <HelpdeskCard
            orderNo={isValueEmpty(eachTicket?.vendorOrder?.orderNo)}
            key={index}
            ticketStatus={
              options.filter(
                (eachItem) => eachItem.value == eachTicket.ticketStatus
              )[0].label
            }
            creationDate={eachTicket.createdAt}
            statusClass={
              options.filter(
                (eachItem) => eachItem.value == eachTicket.ticketStatus
              )[0].class
            }
            ticketTitle={eachTicket?.supportAndHelpDeskTicketType.ticketType}
            ticketNo={eachTicket.ticketNo}
            ticketId={eachTicket.id}
            createdBy={`${eachTicket?.createdBy.firstName} ${eachTicket?.createdBy.lastName}`}
          />
        );
      });
  }

  const handleSearchFilter = (event) => {
    if (event.target.value?.trim()) {
      setTicketNo(event.target.value);
    } else {
      setTicketNo("");
    }
  };

  const optimisedSearch = useCallback(debounce(handleSearchFilter, 1000));
  const selectFilterHandler = (e) => {
    if (e.value) {
      setStatuses([e.value]);
    } else {
      setStatuses([]);
    }
  };
  return (
    <div>
      <Page>
        <Row className="align-items-center">
          <Col md="5">
            <h2 class="page-title mb-md-0 mb-4">
              {t("vendorManagement.supportHelpdesk")}
            </h2>
          </Col>
        </Row>
        <div className="d-sm-flex my-4 py-2 justify-content-between align-items-center">
          <div className={"search-box " + styles["helpdesk-search"]}>
            <input
              type="text"
              placeholder={t("vendorManagement.searchbyTicketNo")}
              onInput={optimisedSearch}
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
              onChange={selectFilterHandler}
              classNamePrefix="react-select"
            />
          </div>
        </div>

        {isLoading && <Loader />}
        {ticketList?.length ? (
          ticketListComponent
        ) : (
          <Empty Message={t("superAdmin.noTicketFound")} />
        )}

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
    </div>
  );
};

export default withTranslation()(SupportHelpdesk);
