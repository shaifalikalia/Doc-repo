import React, { Fragment, useState, useEffect } from "react";
import styles from "./../TopUp.module.scss";
import "./../TopUp.scss";
import { withTranslation } from "react-i18next";
import Table from "components/table";
import useHandleApiError from "hooks/useHandleApiError";
import { useToGetTopUpHistory } from "repositories/admin-vendor-repository";
import InfiniteScroll from "react-infinite-scroll-component";
import { uniqBy } from "lodash";
import Loader from "components/Loader";
import moment from "moment/moment";
import { convertIntoTwoDecimal } from "utils";
import Empty from "components/Empty";

const TopUpHistoryTab = ({ t }) => {
  const pageSize = 4;
  const [pageNumber, setPageNumber] = useState(1);
  const [promotionList, setPromotionList] = useState([]);

  const { data, isLoading, isFetching, error } = useToGetTopUpHistory(
    pageSize,
    pageNumber
  );
  useHandleApiError(isLoading, isFetching, error);
  useEffect(() => {
    if (Array.isArray(data?.data) && data?.data?.length) {
      setPromotionList((prev) => uniqBy([...prev, ...data?.data], "id"));
    }
  }, [data?.data]);

  const hasNextTopUp = () => {
    setPageNumber((prev) => prev + 1);
  };

  const topUpHasMore = data?.pagination?.totalItems > promotionList?.length;
  const topUpLength = promotionList?.length;
  const modifedData = promotionList?.map((item) => {
    item.date = moment(item.createdAt).format("MMM DD, yyy");
    item.plan = `${
      item?.numberOfPromotionPurchased
    } Promotions - CAD ${convertIntoTwoDecimal(item?.price)}`;
    item.updatePrice = `CAD ${convertIntoTwoDecimal(item?.price)}`;

    return item;
  });

  const columns = [
    {
      attrs: { datatitle: t("vendorManagement.date") },
      dataField: "date",
      text: t("vendorManagement.date"),
    },
    {
      attrs: { datatitle: t("vendorManagement.plan") },
      dataField: "plan",
      text: t("vendorManagement.plan"),
    },
    {
      attrs: { datatitle: t("vendorManagement.price") },
      dataField: "updatePrice",
      text: t("vendorManagement.price"),
    },
  ];

  return (
    <Fragment>
      <div
        className={
          "table-td-last-50 table-td-last-50-invoices common-fw-400 topup-table-list " +
          styles["topup-table-list"] +
          " " +
          styles["table-td-last-50-invoices"]
        }
      >
        {isLoading && <Loader />}
        {!!promotionList?.length ? (
          <InfiniteScroll
            dataLength={topUpLength}
            hasMore={topUpHasMore}
            next={hasNextTopUp}
            scrollableTarget={"Promotion-HISTORY-id"}
          >
            <Table
              keyField="Promotion-HISTORY-id"
              data={modifedData}
              columns={columns}
            />
          </InfiniteScroll>
        ) : (
          <Empty Message={t("noRecordFound")} />
        )}
      </div>
    </Fragment>
  );
};

export default withTranslation()(TopUpHistoryTab);
