import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import styles from "./../../PromoCodes.module.scss";
import PromoCodeCard from "../PromoCodeCard";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import moment from "moment";
import Empty from "components/Empty";

const ExpiredTab = ({ t, hookData }) => {
  const { expiredList, totalExpiredItems, currentExpiredPage, pageSize } =
    hookData.data;

  return (
    <Fragment>
      {!expiredList?.length && (
        <Empty Message={t("vendorManagement.promoCodesModule.noDataFound")} />
      )}
      {!!expiredList?.length &&
        expiredList.map((item) => {
          const {
            id: promoCodeId,
            promoCode,
            discountAllowed,
            expiryDate,
          } = item;
          return (
            <PromoCodeCard
              key={promoCodeId}
              promoCodeId={promoCodeId}
              codeStatus={t("vendorManagement.expired")}
              statusClass="expired"
              promoCodeTitle={promoCode}
              discountAllowed={`${discountAllowed}%`}
              expiryDate={moment(expiryDate).format("MMM DD, YYYY")}
              expiryText={t("vendorManagement.expiredOn")}
              customerBtnActive={false}
            />
          );
        })}

      <div className="mt-3 mt-md-0">
        <PaginationProvider
          pagination={paginationFactory({
            custom: true,
            sizePerPage: pageSize,
            totalSize: totalExpiredItems,
            page: currentExpiredPage,
            onPageChange: hookData.methods.setCurrentExpiredPage,
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
                    columns={[{ dataField: "sometext", text: "sometext" }]}
                    {...paginationTableProps}
                  />
                </div>

                <div
                  className={"pagnation-block " + styles["mobile-align-center"]}
                >
                  {totalExpiredItems > pageSize && (
                    <PaginationListStandalone {...paginationProps} />
                  )}
                </div>
              </div>
            );
          }}
        </PaginationProvider>
      </div>
    </Fragment>
  );
};

export default withTranslation()(ExpiredTab);
