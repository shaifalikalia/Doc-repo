import React, { Fragment, useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Card from "components/Card";
import { Col, Row } from "reactstrap";
import styles from "../../../../../VendorManagement/pages/Dashboard/Dashboard.module.scss";

import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";
import Loader from "components/Loader";
import constants, { getKeyValueFromList } from "../../../../../constants";
import { getSingleMemberDetails } from "repositories/family-member-repository";
import { decodeId } from "utils";

/**
 * @method: [DetailItem]
 * @param {string} title
 * @param {string} value
 * @description: use display the details of selected member
 */
function DetailItem({ title, value }) {
  return (
    <div className={"c-field " + styles["c-field"]}>
      <label>{title}</label>
      <div className={styles["field-name"]}>{value}</div>
    </div>
  );
}

const ViewMemberDetail = ({ t }) => {
  /* Initializations & Declarations  */
  const goBack = () => history.push(`/family-members`);
  const history = useHistory();
  let { memberId } = useParams();
  memberId = decodeId(memberId);

  const [singleMemberDetail, setSingleMemberDetail] = useState({});
  const [showLoader, setShowLoader] = useState(false);

  /**
   * @event: [useEffect]
   * @description: use to call the single member details function
   */
  useEffect(() => {
    getMemberDetails();
  }, []);

  /**
   * @event: [getMemberDetails]
   * @description: use to get the single member details
   */
  const getMemberDetails = async () => {
    setShowLoader(true);
    try {
      let response = await getSingleMemberDetails(memberId);
      const memberData = response?.data;
      setSingleMemberDetail(memberData);
    } catch (error) {
      toast.error(error.message);
    }

    setShowLoader(false);
  };

  return (
    <Fragment>
      <Page onBack={goBack}>
        {showLoader && <Loader />}
        <div className={"mx-auto container-smd"}>
          <h2 className="page-title mb-2 common-back-margin">
            {t("familyMembers.viewDetails")}
          </h2>
          <span className={styles["sub-title"]}>
            {t("familyMembers.viewDetailSubTitle")}
          </span>
          <Card
            className={
              styles["vendor-profile-card"] + " " + styles["view-detail"]
            }
            radius="10px"
            marginBottom="10px"
            cursor="default"
            shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
          >
            <Row>
              <Col lg="4">
                <div className={styles["profile-image-col"]}>
                  <div className={styles["profile-pic"]}>
                    {singleMemberDetail.image ? (
                      <img src={singleMemberDetail.image} alt="icon" />
                    ) : (
                      <img
                        src={require("assets/images/staff-default.svg").default}
                        alt="icon"
                      />
                    )}
                  </div>
                  <div className={styles["profile-name"]}>
                    {`${singleMemberDetail.firstName || ""} ${
                      singleMemberDetail.lastName || ""
                    }`}
                  </div>
                </div>
                <hr className="d-block d-md-none" />
              </Col>

              <Col lg="8">
                <div className={styles["profile-form-col"]}>
                  <DetailItem
                    title={t("familyMembers.relation")}
                    value={getKeyValueFromList(
                      constants.relationOptions,
                      singleMemberDetail.relation,
                      "name"
                    )}
                  />
                  <DetailItem
                    title={t("familyMembers.dateOfBirth")}
                    value={moment(singleMemberDetail.dateOfBirth).format("ll")}
                  />
                  <DetailItem
                    title={t("familyMembers.gender")}
                    value={getKeyValueFromList(
                      constants.genderOptions,
                      singleMemberDetail.gender,
                      "name"
                    )}
                  />
                  {singleMemberDetail.email && (
                    <DetailItem
                      title={t("familyMembers.emailAddress")}
                      value={singleMemberDetail.email}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </Page>
    </Fragment>
  );
};

export default withTranslation()(ViewMemberDetail);
