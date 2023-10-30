import Empty from "components/Empty";
import React, { Fragment, useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import styles from "./../TopUp.module.scss";
import InfiniteScroll from "react-infinite-scroll-component";
import { convertIntoTwoDecimal } from "utils";
import useHandleApiError from "hooks/useHandleApiError";
import { useToGetTopUpPromotion } from "repositories/admin-vendor-repository";
import Loader from "components/Loader";
import { uniqBy } from "lodash";
import StripCard from "../Components/StripCard";
import { toast } from "react-hot-toast";
import constants from "../../../../constants";
import ModuleDisabled from "components/ModuleDisabled";
import { useSelector } from "react-redux";

const TopUpPromotionsTab = ({ t }) => {
  const getAllActiveTopUp = "";
  const pageSize = 10;
  const [pageNumber, setPageNumber] = useState(1);
  const [promotionList, setPromotionList] = useState([]);
  const [showPaymentModel, setShowPaymentModel] = useState(false);
  const [selectedTop, setSelectedTop] = useState("");
  const [showDisableModel, setShowDisableModel] = useState(false);
  const profile = useSelector((e) => e.userProfile.profile);
  const isAccountTerminated = profile?.profileSetupStep === constants.subscriptionTerminated
  const disabledClass = isAccountTerminated ? 'disabled-element': ''

  const { data, isLoading, isFetching, error } = useToGetTopUpPromotion(
    pageSize,
    pageNumber,
    getAllActiveTopUp,
    getAllActiveTopUp
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

  const closeModel = () => {
    setShowPaymentModel(false);
  };

  const openStripePop = () => {
    if (isAccountTerminated) {
      setShowDisableModel(true);
      return false;
    }

    if (selectedTop) {
      setShowPaymentModel(true);
    } else {
      toast.error(t("vendorManagement.errors.selectOneItems"));
    }
  };

  return (
    <Fragment>
      <ModuleDisabled
        isOpen={showDisableModel}
        closeModal={() => setShowDisableModel(false)}
        content={t("vendorManagement.promotionDisabled")}
      />
      {isLoading && <Loader />}
      <div className={"mb-3 " + styles["topup-list"]} id={"Promotion-list-id"}>
        <InfiniteScroll
          dataLength={topUpLength}
          hasMore={topUpHasMore}
          next={hasNextTopUp}
          scrollableTarget={"Promotion-list-id"}
        >
          {!!promotionList.length ? (
            promotionList.map((item, index) => (
              <div className={"ch-radio"} key={index}>
                <label>
                  <input
                    type="radio"
                    onChange={(e) => {
                      setSelectedTop(+e.target.value);
                    }}
                    value={item.id}
                    checked={selectedTop === item.id}
                    name="Promotions"
                  />
                  <span>
                    {item.numberOfPromotions} Promotions{" "}
                    <small>CAD {convertIntoTwoDecimal(item.price)}</small>
                  </span>
                </label>
              </div>
            ))
          ) : (
            <Empty Message={t("noRecordFound")} />
          )}
        </InfiniteScroll>
      </div>
      {!!promotionList.length && (
        <button
          className={`button button-round button-shadow btn-height-40 mb-4 w-sm-100 ${disabledClass}`}
          title={t("vendorManagement.topUpPromotion")}
          onClick={openStripePop}
        >
          {t("vendorManagement.topUpPromotion")}
        </button>
      )}
      {showPaymentModel && selectedTop && (
        <StripCard
          amount={
            promotionList.find((item) => item.id === selectedTop)
              ?.numberOfPromotions
          }
          selectedTop={selectedTop}
          closeModel={closeModel}
        />
      )}
    </Fragment>
  );
};

export default withTranslation()(TopUpPromotionsTab);
