import React, { useState } from "react";
import Page from "components/Page";
import { withTranslation } from "react-i18next";
import styles from "./TimesheetViewDetails.module.scss";
import DatePicker from "react-datepicker";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import arrowIcon from "./../../../assets/images/down-arrow-white.svg";

function TimesheetViewDetails({ t }) {
  const PAGE_SIZE = 5;
  const [pageNumber, setPageNumber] = useState(1);
  let totalItems = 10;

  const [showHeader, toggleHeader] = useState(false);
  const handleToggle = () => {
    toggleHeader(!showHeader);
  };
  return (
    <Page onBack={() => {}} titleKey="staff.timesheet">
      <div className={styles["timesheet-view-wrapper"]}>
        <div className={styles["page-sub-heading"]}>Well Being Clinic 2</div>
        <div className={styles["calendar-box"]}>
          <div className="c-field">
            <label>{t("staff.dateFrom")}</label>
            <div className="d-flex inputdate">
              <DatePicker dateFormat="dd-MM-yyyy" className="c-form-control" />
            </div>
          </div>
          <div className="c-field ml-3">
            <label>{t("staff.dateTo")}</label>
            <div className="d-flex inputdate">
              <DatePicker
                dateFormat="dd-MM-yyyy"
                className="c-form-control"
                popperPlacement="bottom-end"
              />
            </div>
          </div>
        </div>
        <div className={styles["timesheet-table"]}>
          <div
            className={`${styles["table-header-row"]}   ${
              showHeader ? styles["show"] : ""
            }`}
          >
            <div className={styles["icon-arrow"]} onClick={handleToggle}>
              <img src={arrowIcon} alt="icon" />
            </div>
            <div className={styles["header-left"]}>
              <div className={styles["label-text"]}>
                {" "}
                {t("staff.totalHoursOfPayment")}{" "}
              </div>
              <div className={styles["main-text"]}>60 Hours</div>
            </div>
            <ul className={styles["header-right"]}>
              <li>
                <div className={styles["label-text"]}>{t("staff.logged")} </div>
                <div className={styles["main-text"]}>48 Hrs</div>
              </li>
              <li>
                <div className={styles["label-text"]}>
                  {" "}
                  {t("staff.approved")}{" "}
                </div>
                <div className={styles["main-text"]}>36 Hrs</div>
              </li>
              <li>
                <div className={styles["label-text"]}>
                  {t("staff.holiday")}{" "}
                </div>
                <div className={styles["main-text"]}>12 Hrs </div>
              </li>
              <li>
                <div className={styles["label-text"]}>
                  {" "}
                  {t("staff.workingDays")}{" "}
                </div>
                <div className={styles["main-text"]}>10 Days</div>
              </li>
              <li>
                <div className={styles["label-text"]}>{t("staff.leaves")} </div>
                <div className={styles["main-text"]}>1 Day</div>
              </li>
              <li>
                <div className={styles["label-text"]}>
                  {t("staff.overtime")}{" "}
                </div>
                <div className={styles["main-text"]}>13 Hrs</div>
              </li>
            </ul>
          </div>
          <div className={styles["table-body"]}>
            <div className={styles["table-body-row"]}>
              <div className={styles["body-left"]}>
                <div className={styles["main-text"]}>May 1, Friday</div>
              </div>
              <ul className={styles["body-right"]}>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.timesheetType")}{" "}
                  </div>
                  <div className={styles["main-text"]}>All Day </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.hourlyRate")}{" "}
                  </div>
                  <div className={styles["main-text"]}>CAD 13.00</div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.totalHours")}{" "}
                  </div>
                  <div className={styles["main-text"]}>11 Hours </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.totalAmount")}{" "}
                  </div>
                  <div className={styles["main-text"]}>CAD 143.00</div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.total")}{" "}
                  </div>
                  <div className={styles["main-text"]}>10 Hours </div>
                </li>
              </ul>
            </div>
            <div className={styles["table-body-row"]}>
              <div className={styles["body-left"]}>
                <div className={styles["main-text"]}>May 2, Saturday</div>
              </div>
              <ul className={styles["body-right"]}>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.timesheetType")}{" "}
                  </div>
                  <div className={styles["main-text"]}>All Day </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.hourlyRate")}{" "}
                  </div>
                  <div className={styles["main-text"]}>CAD 13.00</div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.totalHours")}{" "}
                  </div>
                  <div className={styles["main-text"]}>11 Hours </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.totalAmount")}{" "}
                  </div>
                  <div className={styles["main-text"]}>CAD 143.00</div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.total")}{" "}
                  </div>
                  <div className={styles["main-text"]}>10 Hours </div>
                </li>
              </ul>
            </div>
            <div className={styles["table-body-row"]}>
              <div className={styles["body-left"]}>
                <div className={styles["main-text"]}>May 2, Sunday</div>
              </div>
              <ul className={styles["body-right"]}>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.timesheetType")}{" "}
                  </div>
                  <div className={styles["main-text"]}>All Day </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.hourlyRate")}{" "}
                  </div>
                  <div className={styles["main-text"]}>CAD 13.00</div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.totalHours")}{" "}
                  </div>
                  <div className={styles["main-text"]}>11 Hours </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.totalAmount")}{" "}
                  </div>
                  <div className={styles["main-text"]}>CAD 143.00</div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.total")}{" "}
                  </div>
                  <div className={styles["main-text"]}>10 Hours </div>
                </li>
              </ul>
            </div>
            <div className={styles["table-body-row"]}>
              <div className={styles["body-left"]}>
                <div className={styles["main-text"]}>May 4, Monday</div>
              </div>
              <ul className={styles["body-right"]}>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.timesheetType")}{" "}
                  </div>
                  <div className={styles["main-text"]}>All Day </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.hourlyRate")}{" "}
                  </div>
                  <div className={styles["main-text"]}>CAD 13.00</div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.totalHours")}{" "}
                  </div>
                  <div className={styles["main-text"]}>11 Hours </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.totalAmount")}{" "}
                  </div>
                  <div className={styles["main-text"]}>CAD 143.00</div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.total")}{" "}
                  </div>
                  <div className={styles["main-text"]}>10 Hours </div>
                </li>
              </ul>
            </div>
            <div className={styles["table-body-row"]}>
              <div className={styles["body-left"]}>
                <div className={styles["main-text"]}>May 5, Tuesday</div>
              </div>
              <ul className={styles["body-right"]}>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.timesheetType")}{" "}
                  </div>
                  <div className={styles["main-text"]}>All Day </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.hourlyRate")}{" "}
                  </div>
                  <div className={styles["main-text"]}>CAD 13.00</div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.totalHours")}{" "}
                  </div>
                  <div className={styles["main-text"]}>11 Hours </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.totalAmount")}{" "}
                  </div>
                  <div className={styles["main-text"]}>CAD 143.00</div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.total")}{" "}
                  </div>
                  <div className={styles["main-text"]}>10 Hours </div>
                </li>
              </ul>
            </div>
            <div className={styles["table-body-row"]}>
              <div className={styles["body-left"]}>
                <div className={styles["main-text"]}>May 6, Wednesday</div>
              </div>
              <ul className={styles["body-right"]}>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.timesheetType")}{" "}
                  </div>
                  <div className={styles["main-text"]}>All Day </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.hourlyRate")}{" "}
                  </div>
                  <div className={styles["main-text"]}>CAD 13.00</div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {t("staff.totalHours")}{" "}
                  </div>
                  <div className={styles["main-text"]}>11 Hours </div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.totalAmount")}{" "}
                  </div>
                  <div className={styles["main-text"]}>CAD 143.00</div>
                </li>
                <li>
                  <div className={styles["label-text"]}>
                    {" "}
                    {t("staff.total")}{" "}
                  </div>
                  <div className={styles["main-text"]}>10 Hours </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
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

                <div className="pagnation-block">
                  {totalItems > PAGE_SIZE && (
                    <PaginationListStandalone {...paginationProps} />
                  )}
                </div>
              </div>
            );
          }}
        </PaginationProvider>
      </div>
    </Page>
  );
}

export default withTranslation()(TimesheetViewDetails);
