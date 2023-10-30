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

const LaunchedTab = ({ t, hookData , disabledClass }) => {
  const { launchedList, totalLaunchedItems, currentLaunchedPage, pageSize } =
    hookData.data;

  const { handleCustomerBtn } = hookData.methods;

  return (
    <Fragment>
      {!launchedList?.length && (
        <div className={styles["empty-wrapper"]}>
          <Empty Message={t("vendorManagement.promoCodesModule.noDataFound")} />
        </div>
      )}
      {!!launchedList?.length &&
        launchedList.map((item) => {
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
              handleCustomerBtn={handleCustomerBtn}
              codeStatus={t("vendorManagement.launched")}
              statusClass="launched"
              promoCodeTitle={promoCode}
              discountAllowed={`${discountAllowed}%`}
              expiryDate={moment(expiryDate).format("MMM DD, YYYY")}
              expiryText={t("vendorManagement.expireOn")}
              customerBtnActive={true}
              disabledClass={disabledClass}
            />
          );
        })}
      <div className="mt-3 mt-md-0">
        <PaginationProvider
          pagination={paginationFactory({
            custom: true,
            sizePerPage: pageSize,
            totalSize: totalLaunchedItems,
            page: currentLaunchedPage,
            onPageChange: hookData.methods.setCurrentLaunchedPage,
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
                    columns={[{ dataField: "someText", text: "sometext" }]}
                    {...paginationTableProps}
                  />
                </div>

                <div
                  className={"pagnation-block " + styles["mobile-align-center"]}
                >
                  {totalLaunchedItems > pageSize && (
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

export default withTranslation()(LaunchedTab);
