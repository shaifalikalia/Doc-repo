import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Card from "components/Card";
import { Col, Row } from "reactstrap";
import styles from "./../../../ManageVendors/ManageVendors.module.scss";
import { useLocation } from "react-router-dom";
import constants from "../../../../../../constants";
import { isValueEmpty } from "utils";
import { useVendorProfileDetail } from "repositories/admin-vendor-repository";
import Loader from "components/Loader";
import useHandleApiError from "hooks/useHandleApiError";

const ViewVendorDetails = ({ history, t }) => {
  const onBack = () => {
    history.goBack();
  };

  let vendorDetail = useLocation()?.state;
  if (!vendorDetail) {
    history.push(constants.routes.superAdmin.manageVendors);
  }
  const {
    data,
    isLoading,
    error: isError,
    isFetching,
  } = useVendorProfileDetail(vendorDetail.vendorId, {
    enabled: vendorDetail?.isGetDetail,
  });
  useHandleApiError(isLoading, isFetching, isError);

  let vendorProfileDetails = data?.data;
  if (vendorProfileDetails) {
    vendorDetail = { ...vendorDetail, ...vendorProfileDetails };
  }
  const cachedfullName = `${vendorDetail?.vendorCacheDetail?.firstName} ${vendorDetail?.vendorCacheDetail?.lastName}`;
  const { contactNumber, emailId } = vendorDetail?.vendorCacheDetail || {};
  return (
    <Fragment>
      <Page onBack={onBack}>
        {isLoading && <Loader />}
        <div className="mx-auto container-smd">
          <h2 className="page-title mt-1  vendor-profile-title">
            {t("superAdminVendorManagement.vendorProfile")}
          </h2>
          <Card
            className={styles["vendor-profile-card"]}
            radius="10px"
            marginBottom="10px"
            cursor="default"
            shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
          >
            <Row>
              <Col lg="4">
                <div className={styles["profile-image-col"]}>
                  <div className={styles["profile-pic"]}>
                    <img
                      src={
                        vendorDetail?.image ||
                        require("assets/images/staff-default.svg").default
                      }
                      alt="icon"
                    />
                  </div>
                  <div className={styles["profile-name"]}>{cachedfullName}</div>
                </div>
              </Col>
              <Col lg="8">
                <div className={styles["profile-form-col"]}>
                  <DetailItem
                    title={t("form.fields.name")}
                    value={cachedfullName}
                  />
                  <DetailItem
                    title={t("form.fields.companyName")}
                    value={vendorDetail?.name}
                  />
                  <DetailItem
                    title={t("form.fields.emailAddress")}
                    value={emailId}
                  />
                  <DetailItem
                    title={t("form.fields.officeAddress")}
                    value={vendorDetail?.address}
                  />
                  <DetailItem
                    title={t("form.fields.contactNumber")}
                    value={contactNumber}
                  />
                  <DetailItem
                    title={t("form.fields.country")}
                    value={vendorDetail?.country}
                  />
                  <DetailItem
                    title={t("form.fields.province")}
                    value={vendorDetail?.state}
                  />
                  <DetailItem
                    title={t("form.fields.city")}
                    value={vendorDetail?.city}
                  />
                  <DetailItem
                    title={t("form.fields.postalCode")}
                    value={vendorDetail?.postCode}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </Page>
    </Fragment>
  );
};

function DetailItem({ title, value }) {
  return (
    <div class={"c-field " + styles["c-field"]}>
      <label>{title}</label>
      <div class={styles["field-name"]}>{isValueEmpty(value)}</div>
    </div>
  );
}

export default withTranslation()(ViewVendorDetails);
