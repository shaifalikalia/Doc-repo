import React, { Fragment, useState } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Card from "components/Card";
import {
  Col,
  Row,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import styles from "./Dashboard.module.scss";
import { Link, useHistory } from "react-router-dom";
import LayoutVendor from "VendorManagement/components/LayoutVendor";
import { useSelector } from "react-redux";
import constants from "../../../constants";

function DetailItem({ title, value }) {
  return (
    <div class={"c-field " + styles["c-field"]}>
      <label>{title}</label>
      <div class={styles["field-name"]}>{value}</div>
    </div>
  );
}

const VendorProfile = ({ t }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const profileDetails = useSelector((e) => e.userProfile.profile);
  const history = useHistory();
  if (!profileDetails) return null;
  let fullName = `${profileDetails.firstName} ${profileDetails.lastName}`;
  let {
    businessName,
    emailId,
    address,
    contactNumber,
    country,
    postCode,
    city,
    state,
    businessImage,
  } = profileDetails;

  const goBack = () => {
    history.push(constants.routes.vendor.dashboard);
  };

  return (
    <Fragment>
      <LayoutVendor>
        <Page onBack={goBack}>
          <div className="mx-auto container-smd">
            <h2 className="page-title mt-3 mb-4">{t("navbar.myProfile")}</h2>
            <Card
              className={styles["vendor-profile-card"]}
              radius="10px"
              marginBottom="10px"
              cursor="default"
              shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            >
              <div className={styles["profile-dropdown"]}>
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle
                    caret={false}
                    tag="div"
                    className={styles["dropdown-btn"]}
                  >
                    <img
                      src={require("assets/images/dots-icon.svg").default}
                      alt="icon"
                    />
                  </DropdownToggle>
                  <DropdownMenu
                    right
                    className={styles["dropdown-menu"] + " " + "border-0"}
                  >
                    <DropdownItem className={styles["dropdown-item"]}>
                      <Link to={constants.routes.vendor.editProfile}>
                        {t("accountOwner.editProfile")}
                      </Link>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <Row>
                <Col lg="4">
                  <div className={styles["profile-image-col"]}>
                    <div className={styles["profile-pic"]}>
                      {businessImage ? (
                        <img src={businessImage} alt="icon" />
                      ) : (
                        <img
                          src={
                            require("assets/images/staff-default.svg").default
                          }
                          alt="icon"
                        />
                      )}
                    </div>
                    <div className={styles["profile-name"]}>{fullName}</div>
                  </div>
                </Col>
                <Col lg="8">
                  <div className={styles["profile-form-col"]}>
                    <DetailItem
                      title={t("form.fields.name")}
                      value={fullName}
                    />
                    <DetailItem
                      title={t("form.fields.companyName")}
                      value={businessName}
                    />
                    <DetailItem
                      title={t("form.fields.emailAddress")}
                      value={emailId}
                    />
                    <DetailItem
                      title={t("form.fields.officeAddress")}
                      value={address}
                    />
                    <DetailItem
                      title={t("form.fields.contactNumber")}
                      value={contactNumber}
                    />
                    <DetailItem
                      title={t("form.fields.country")}
                      value={country}
                    />
                    <DetailItem
                      title={t("form.fields.province")}
                      value={state}
                    />
                    <DetailItem title={t("form.fields.city")} value={city} />
                    <DetailItem
                      title={t("form.fields.postalCode")}
                      value={postCode}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </Page>
      </LayoutVendor>
    </Fragment>
  );
};

export default withTranslation()(VendorProfile);
