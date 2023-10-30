import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import TabCommonCard from "../TabCommonCard";
import moment from "moment/moment";
import Empty from "components/Empty";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

const LaunchedTab = ({
  t,
  promotionList,
  pageSize,
  totalItems,
  pageNumber,
  handlePageNumber,
}) => {
  return (
    <Fragment>
      {!!promotionList.length ? (
        promotionList.map((item) => (
          <TabCommonCard
            key={item.id}
            id={item.id}
            Status={t("vendorManagement.launched")}
            statusClass="launched"
            Title={item.heading}
            promoCodeAssigned={item.vendorPromoCode?.id ? t("Yes") : t("No")}
            startDate={moment(item?.launchDate).format("MMM DD, YYYY")}
            expiryDate={moment(item?.expireDate).format("MMM DD, YYYY")}
          />
        ))
      ) : (
        <Empty Message={t("noRecordFound")} />
      )}

      <PaginationProvider
        pagination={paginationFactory({
          custom: true,
          sizePerPage: pageSize,
          totalSize: totalItems,
          page: pageNumber,
          onPageChange: handlePageNumber,
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

              <div className={"pagnation-block "}>
                {totalItems > pageSize && (
                  <PaginationListStandalone {...paginationProps} />
                )}
              </div>
            </div>
          );
        }}
      </PaginationProvider>
    </Fragment>
  );
};

export default withTranslation()(LaunchedTab);
