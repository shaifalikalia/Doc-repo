import React from "react";

/*components*/
import Input from "components/Input";
import styles from "./../../../Subscription/EditAccountBasicSubscription/EditBasicSubscription.module.scss";
import "./../../../Subscription/EditAccountBasicSubscription/EditBasicSubscription.scss";

import { withTranslation } from "react-i18next";
import { Col, Row } from "reactstrap/lib";
import { Link } from "react-router-dom";

const EditBasicSubscription = ({ t }) => {
  return (
    <div
      className={
        "edit-pan-block edit-account-basic " + styles["edit-pan-block"]
      }
    >
      <div className={"container container-smd " + styles["container"]}>
        <button className="back-btn">
          <Link>
            <span className="ico">
              <img
                src={require("assets/images/arrow-back-icon.svg").default}
                alt="arrow"
              />
            </span>
            {t("back")}
          </Link>
        </button>
        <h2 className={"title " + styles["title"]}>
          {t("superAdmin.basicSubscription")}
        </h2>
        <div className="form-wrapper">
          <div className="edit-plan-form">
            <Row>
              <Col md="5" className="pr-1">
                <Input
                  Title={t("form.fields.setUpFree")}
                  Type="text"
                  Placeholder={t("form.placeholder1", {
                    field: t("form.fields.setUpFree"),
                  })}
                  Name={"OfficeUnitPrice"}
                />
                <Input
                  Title={t("form.fields.officeCharges")}
                  Type="text"
                  Placeholder={t("form.placeholder1", {
                    field: t("form.fields.officeCharges"),
                  })}
                  Name={"OfficeUnitPrice"}
                />
                <Input
                  Title={t("form.fields.temporaryStaffCharges")}
                  Type="text"
                  Placeholder={t("form.placeholder1", {
                    field: t("form.fields.temporaryStaffCharges"),
                  })}
                  Name={"TemporaryStaffUnitPrice"}
                />
                <Input
                  Title={t("form.fields.permanentStaffCharges")}
                  Type="text"
                  Placeholder={t("form.placeholder1", {
                    field: t("form.fields.permanentStaffCharges"),
                  })}
                  Name={"PermanentStaffUnitPrice"}
                />

                <Input
                  Title={t("form.fields.placementCharges")}
                  Type="text"
                  Placeholder={t("form.placeholder1", {
                    field: t("form.fields.placementCharges"),
                  })}
                  Name={"PlacementUnitPrice"}
                />
              </Col>

              <Col md="12">
                <div className={"mt-2"}>
                  <div className="row gutters-12">
                    <div className="col-md-auto">
                      <button
                        className="button button-round button-shadow button-width-large"
                        title={t("save")}
                      >
                        {t("save")}
                      </button>
                    </div>
                    <div className="col-md-auto">
                      <button
                        className="button button-round button-border button-dark"
                        title={t("cancel")}
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(EditBasicSubscription);
