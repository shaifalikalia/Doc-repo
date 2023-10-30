import { withTranslation } from "react-i18next";
import Page from "components/Page";
import LayoutVendor from "VendorManagement/components/LayoutVendor";
import { useToGetManageCards } from "repositories/utility-repository";
import useHandleApiError from "hooks/useHandleApiError";
import Loader from "components/Loader";
import Empty from "components/Empty";
import styles from "./../../ManageVendorSubscription/VendorSubscription.module.scss";
import { Link } from "react-router-dom";
import { encodeId } from "utils";
import constants from "../../../../constants";

let pageSize = 10;
let pageNumber = 1;

const ManageVendorCard = ({ t, history }) => {
  const onBack = () => history.push(`/manage-subscription`);
  const { data, isLoading, isFetching, error } = useToGetManageCards(
    pageSize,
    pageNumber
  );
  useHandleApiError(isLoading, isFetching, error);
  const arrayOfCards = data || [];

  return (
    <LayoutVendor>
      {isLoading && <Loader />}
      <Page
        onBack={onBack}
        className={"vendor-card-custom " + styles["manage-vendor-card"]}
        title={t("vendorManagement.creditCards")}
      >
        <div className="card app-card custom-table ">
          {arrayOfCards.length > 0 ? (
            arrayOfCards.map((item) => (
              <div className="card-body app-card-body" key={item?.id}>
                <label className={styles["credit-card-details"]}>
                  {t("accountOwner.creditCardDetails")}
                </label>
                <div className={"row no-gutters " + styles[""]}>
                  <div className="col-md-8">
                    <div>
                      <span
                        className={styles["card-type"]}
                      >{`**** **** **** ${item?.last4Digit}`}</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <Link
                      to={{
                        pathname: constants.routes.vendor.editVendorCards,
                        state: { cardId: encodeId(item.id) },
                      }}
                      className="_link"
                    >
                      <span className={"_link " + styles["change-card"]}>
                        {t("vendorManagement.changeCard")}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Empty Message={t("noRecordFound")} />
          )}
        </div>
      </Page>
    </LayoutVendor>
  );
};
export default withTranslation()(ManageVendorCard);
