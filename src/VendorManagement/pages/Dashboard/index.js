import React, { useState, useEffect } from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Card from "components/Card";
import { Col, Row } from "reactstrap";
import styles from "./Dashboard.module.scss";
import DatePicker from "react-datepicker";
import { getStorage, setStorage, removeStorage } from "utils";
import constants from "../../../constants";
import moment from "moment";
import { useToGetDashBoardData } from "repositories/vendor-repository";
import Loader from "components/Loader";
import useHandleApiError from "hooks/useHandleApiError";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import VendorTerminated from "components/VendorTerminated";

const Dashboard = ({ t }) => {
  const cacheValue =
    getStorage(constants.vendor.cache.vendorDashBoardDateCache) || {};
  const dateFormat = (date) => moment(date).format("YYYY-MM-DD");
  const profile = useSelector((e) => e.userProfile.profile);
  const history = useHistory();
  const [openModel, setOpenModel] = useState(false);

  useEffect(() => {
    if (
      profile &&
      profile.profileSetupStep === constants.subscriptionTerminated
    ) {
      setOpenModel(true);
    }
  }, [profile]);

  const [dates, setDates] = useState({
    from: cacheValue?.from
      ? new Date(cacheValue?.from)
      : new Date(moment().startOf("year").format("YYYY-MM-DD")),
    to: cacheValue?.to ? new Date(cacheValue?.to) : new Date(),
  });

  const { data, error, isLoading, isFetching } = useToGetDashBoardData(
    dateFormat(dates.from),
    dateFormat(dates.to)
  );
  useHandleApiError(isLoading, isFetching, error);
  const detail = data?.data;
  const tabName = constants.orderStatus;

  const updateDatesValues = (dateObj) => {
    setDates((prev) => ({ ...prev, ...dateObj }));
  };

  useEffect(() => {
    setStorage(constants.vendor.cache.vendorDashBoardDateCache, dates);
    return () => {
      removeStorage([constants.vendor.cache.vendorDashBoardDateCache]);
    };
  }, [dates]);

  const redirectToManageOrders = (name) => {
    setStorage(constants.vendor.cache.manageOrderslisting, { activeTab: name });
    history.push(constants.routes.vendor.manageOrders);
  };

  return (
    <LayoutVendor>
      {isLoading && <Loader />}
      <VendorTerminated
        isOpen={openModel}
        closeModal={() => {
          setOpenModel(false);
        }}
      />
      <Page title={profile?.businessName}>
        <div className={styles["dashboard-header"]}>
          <div className={styles["heading-title"]}>
            {t("vendorManagement.analytics")}
          </div>
          <div className={styles["calendar-box"]}>
            <div className="c-field">
              <label>{t("from")}</label>
              <div className="d-flex inputdate">
                <DatePicker
                  dateFormat="dd-MM-yyyy"
                  className="c-form-control"
                  selected={dates.from}
                  onChange={(date) => updateDatesValues({ from: date })}
                  maxDate={dates.to}
                />
              </div>
            </div>
            <div className="c-field">
              <label>{t("to")}</label>
              <div className="d-flex inputdate">
                <DatePicker
                  dateFormat="dd-MM-yyyy"
                  className="c-form-control"
                  popperPlacement="top-end"
                  selected={dates.to}
                  minDate={dates.from}
                  onChange={(date) => updateDatesValues({ to: date })}
                />
              </div>
            </div>
          </div>
        </div>
        <Row>
          <Col xl="3" md="4" sm="6">
            <Card
              className={styles["dashboard-card"]}
              radius="10px"
              marginBottom="10px"
              cursor="default"
              shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            >
              <div
                className={styles["col-left"] + " " + "pointer"}
                onClick={() => redirectToManageOrders(tabName.all)}
              >
                <h4 className={styles["card-heading"]}>
                  {t("vendorManagement.totalOrders")}
                </h4>
                <div className={styles["card-count"]}>
                  {detail?.totalOrders}
                </div>
              </div>
              <div className={styles["img-col"]}>
                <span className={styles["icon-box"]}>
                  <img
                    src={require("assets/images/total-order.svg").default}
                    alt="icon"
                  />
                </span>
              </div>
            </Card>
          </Col>
          <Col xl="3" md="4" sm="6">
            <Card
              className={styles["dashboard-card"]}
              radius="10px"
              marginBottom="10px"
              cursor="default"
              shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            >
              <div
                className={styles["col-left"] + " " + "pointer"}
                onClick={() => redirectToManageOrders(tabName.Pending)}
              >
                <h4 className={styles["card-heading"]}>
                  {t("vendorManagement.pendingOrders")}
                </h4>
                <div className={styles["card-count"]}>
                  {detail?.pendingOrders}
                </div>
              </div>
              <div className={styles["img-col"]}>
                <span className={styles["icon-box"]}>
                  <img
                    src={require("assets/images/Pending-order.svg").default}
                    alt="icon"
                  />
                </span>
              </div>
            </Card>
          </Col>
          <Col xl="3" md="4" sm="6">
            <Card
              className={styles["dashboard-card"]}
              radius="10px"
              marginBottom="10px"
              cursor="default"
              shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            >
              <div
                className={styles["col-left"] + " " + "pointer"}
                onClick={() => redirectToManageOrders(tabName.Accepted)}
              >
                <h4
                  className={
                    styles["card-heading"] + " " + styles["width-heading"]
                  }
                >
                  {t("vendorManagement.acceptedNotShippedOrders")}
                </h4>
                <div className={styles["card-count"]}>
                  {detail?.acceptedOrders}
                </div>
              </div>
              <div className={styles["img-col"]}>
                <span className={styles["icon-box"]}>
                  <img
                    src={require("assets/images/Accepted-order.svg").default}
                    alt="icon"
                  />
                </span>
              </div>
            </Card>
          </Col>
          <Col xl="3" md="4" sm="6">
            <Card
              className={styles["dashboard-card"]}
              radius="10px"
              marginBottom="10px"
              cursor="default"
              shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            >
              <div
                className={styles["col-left"] + " " + "pointer"}
                onClick={() => redirectToManageOrders(tabName.Shipped)}
              >
                <h4 className={styles["card-heading"]}>
                  {t("vendorManagement.shippedOrders")}
                </h4>
                <div className={styles["card-count"]}>
                  {detail?.shippedOrders}
                </div>
              </div>
              <div className={styles["img-col"]}>
                <span className={styles["icon-box"]}>
                  <img
                    src={require("assets/images/Shipped-order.svg").default}
                    alt="icon"
                  />
                </span>
              </div>
            </Card>
          </Col>
          <Col xl="3" md="4" sm="6">
            <Card
              className={styles["dashboard-card"]}
              radius="10px"
              marginBottom="10px"
              cursor="default"
              shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            >
              <div
                className={styles["col-left"] + " " + "pointer"}
                onClick={() => redirectToManageOrders(tabName.Delivered)}
              >
                <h4 className={styles["card-heading"]}>
                  {t("vendorManagement.deliveredOrders")}
                </h4>
                <div className={styles["card-count"]}>
                  {detail?.deliveredOrders}
                </div>
              </div>
              <div className={styles["img-col"]}>
                <span className={styles["icon-box"]}>
                  <img
                    src={require("assets/images/Delivered-order.svg").default}
                    alt="icon"
                  />
                </span>
              </div>
            </Card>
          </Col>
          <Col xl="3" md="4" sm="6">
            <Card
              className={styles["dashboard-card"]}
              radius="10px"
              marginBottom="10px"
              cursor="default"
              shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            >
              <div
                className={styles["col-left"] + " " + "pointer"}
                onClick={() => redirectToManageOrders(tabName.Cancelled)}
              >
                <h4 className={styles["card-heading"]}>
                  {t("vendorManagement.cancelledOrders")}
                </h4>
                <div className={styles["card-count"]}>
                  {detail?.cancelledOrders}
                </div>
              </div>
              <div className={styles["img-col"]}>
                <span className={styles["icon-box"]}>
                  <img
                    src={require("assets/images/Cancelled-order.svg").default}
                    alt="icon"
                  />
                </span>
              </div>
            </Card>
          </Col>
          <Col xl="3" md="4" sm="6">
            <Card
              className={styles["dashboard-card"]}
              radius="10px"
              marginBottom="10px"
              cursor="default"
              shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            >
              <div
                className={styles["col-left"] + " " + "pointer"}
                onClick={() => redirectToManageOrders(tabName.UnPaid)}
              >
                <h4
                  className={
                    styles["card-heading"] + " " + styles["card-heading-two"]
                  }
                >
                  {t("vendorManagement.billMeLaterAndUnPaidOrders")}
                </h4>
                <div className={styles["card-count"]}>
                  {detail?.billMeLaterAndUnPaidOrders}
                </div>
              </div>
              <div className={styles["img-col"]}>
                <span className={styles["icon-box"]}>
                  <img
                    src={require("assets/images/Pending-order.svg").default}
                    alt="icon"
                  />
                </span>
              </div>
            </Card>
          </Col>
        </Row>
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(Dashboard);
