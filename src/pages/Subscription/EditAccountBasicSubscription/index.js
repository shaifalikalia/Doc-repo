import React from "react";
import Input from "components/Input";
import styles from "./EditBasicSubscription.module.scss";
import "./EditBasicSubscription.scss";

import { withTranslation } from "react-i18next";
import { Col } from "reactstrap/lib";
import useEditSubscription from "../Hooks/useEditSubscription";
import constants from "../../../constants";
import { useHistory, useParams, Link } from "react-router-dom";
import Loader from "components/Loader";

const EditAccountBasicSubscription = ({ t }) => {
  const history = useHistory();
  let { subscriptionType } = useParams();
  subscriptionType = +subscriptionType;
  const goBack = () => {
    history.push("/subscription-management");
  };

  if (
    !subscriptionType ||
    !constants.subscriptionTypesArray.includes(subscriptionType)
  ) {
    goBack();
  }

  const { data, methods } = useEditSubscription({ t, subscriptionType });
  const { officeCharges, error } = data;

  return (
    <div
      className={
        "edit-pan-block edit-account-basic " + styles["edit-pan-block"]
      }
    >
      {data.isLoading && <Loader />}
      <div className={"container container-smd " + styles["container"]}>
        <button className="back-btn">
          <Link
            to={constants.routes.superAdmin.accountBasicSubscription.replace(
              ":subscriptionType",
              subscriptionType
            )}
          >
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
          {methods.printSubscriptionType()}
        </h2>
        <div className={"form-wrapper"}>
          <div className="edit-plan-form">
            <div className="d-flex flex-wrap">
              <div className={styles["left-edit"]}>
                {" "}
                <ul>
                  <li>
                    <label>{t("superAdmin.setUpFree")}</label>
                  </li>
                  <li>
                    <label>{t("superAdmin.officeCharges")}</label>
                  </li>
                  <li>
                    <label>{t("superAdmin.permanentStaffCharges")}</label>
                  </li>
                  <li>
                    <label>{t("superAdmin.temporaryStaffCharges")}</label>
                  </li>
                  <li className={styles["last-child"]}>
                    <label>{t("superAdmin.perEachPlacement")}</label>
                  </li>
                </ul>
              </div>

              <div className={styles["middle-edit"]}>
                <div className={styles["middle-edit-inner"]}>
                  <h3> {t("superAdmin.singleOffice")}</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.cad")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.cad"),
                        })}
                        Value={officeCharges.singleSetUpFeeCad}
                        Name={"singleSetUpFeeCad"}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.singleSetUpFeeCad}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.usd")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.usd"),
                        })}
                        Value={officeCharges.singleSetUpFeeUsd}
                        Name={"singleSetUpFeeUsd"}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.singleSetUpFeeUsd}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.cad")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.cad"),
                        })}
                        Value={officeCharges.singleOfficeChargesCad}
                        Name={"singleOfficeChargesCad"}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.singleOfficeChargesCad}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.usd")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.usd"),
                        })}
                        Value={officeCharges.singleOfficeChargesUsd}
                        Name={"singleOfficeChargesUsd"}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.singleOfficeChargesUsd}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.cad")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.usd"),
                        })}
                        Name={"singlePermanentStaffChargesCad"}
                        Value={officeCharges.singlePermanentStaffChargesCad}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.singlePermanentStaffChargesCad}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>
                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.usd")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.cad"),
                        })}
                        Name={"singlePermanentStaffChargesUsd"}
                        Value={officeCharges.singlePermanentStaffChargesUsd}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.singlePermanentStaffChargesUsd}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.cad")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.cad"),
                        })}
                        Name={"singleTemporaryStaffChargesCad"}
                        Value={officeCharges.singleTemporaryStaffChargesCad}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.singleTemporaryStaffChargesCad}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>
                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.usd")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.usd"),
                        })}
                        Name={"singleTemporaryStaffChargesUsd"}
                        Value={officeCharges.singleTemporaryStaffChargesUsd}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.singleTemporaryStaffChargesUsd}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.cad")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.usd"),
                        })}
                        Name={"singlePerEachPlacmentCad"}
                        Value={officeCharges.singlePerEachPlacmentCad}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.singlePerEachPlacmentCad}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.usd")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.cad"),
                        })}
                        Name={"singlePerEachPlacmentUsd"}
                        Value={officeCharges.singlePerEachPlacmentUsd}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.singlePerEachPlacmentUsd}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles["right-edit"]}>
                <div className={styles["right-edit-inner"]}>
                  <h3> {t("accountOwner.multipleOffice")}</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.cad")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.cad"),
                        })}
                        Value={officeCharges.multipleSetUpFeeCad}
                        Name={"multipleSetUpFeeCad"}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.multipleSetUpFeeCad}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.usd")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.usd"),
                        })}
                        Value={officeCharges.multipleSetUpFeeUsd}
                        Name={"multipleSetUpFeeUsd"}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.multipleSetUpFeeUsd}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.cad")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.cad"),
                        })}
                        Value={officeCharges.multipleOfficeChargesCad}
                        Name={"multipleOfficeChargesCad"}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.multipleOfficeChargesCad}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.usd")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.usd"),
                        })}
                        Value={officeCharges.multipleOfficeChargesUsd}
                        Name={"multipleOfficeChargesUsd"}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.multipleOfficeChargesUsd}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.cad")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.usd"),
                        })}
                        Name={"multiplePermanentStaffChargesCad"}
                        Value={officeCharges.multiplePermanentStaffChargesCad}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.multiplePermanentStaffChargesCad}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>
                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.usd")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.cad"),
                        })}
                        Name={"multiplePermanentStaffChargesUsd"}
                        Value={officeCharges.multiplePermanentStaffChargesUsd}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.multiplePermanentStaffChargesUsd}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.cad")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.usd"),
                        })}
                        Name={"multipleTemporaryStaffChargesCad"}
                        Value={officeCharges.multipleTemporaryStaffChargesCad}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.multipleTemporaryStaffChargesCad}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>
                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.usd")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.cad"),
                        })}
                        Name={"multipleTemporaryStaffChargesUsd"}
                        Value={officeCharges.multipleTemporaryStaffChargesUsd}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.multipleTemporaryStaffChargesUsd}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.cad")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.usd"),
                        })}
                        Name={"multiplePerEachPlacmentCad"}
                        Value={officeCharges.multiplePerEachPlacmentCad}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.multiplePerEachPlacmentCad}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-6">
                      <Input
                        Title={t("form.fields.usd")}
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.cad"),
                        })}
                        Name={"multiplePerEachPlacmentUsd"}
                        Value={officeCharges.multiplePerEachPlacmentUsd}
                        HandleChange={(e) => methods.handleChange(e)}
                        Error={error?.multiplePerEachPlacmentUsd}
                        MaxLength={data.priceInputMaxLenght}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Col md="12">
                <div className={styles["btn-field"]}>
                  <div className="row gutters-12">
                    <div className="col-md-auto">
                      <button
                        className="button button-round button-shadow button-width-large"
                        title={t("save")}
                        onClick={methods.handleSave}
                      >
                        {t("save")}
                      </button>
                    </div>
                    <div className="col-md-auto">
                      <Link
                        to={constants.routes.superAdmin.accountBasicSubscription.replace(
                          ":subscriptionType",
                          subscriptionType
                        )}
                      >
                        <button
                          className="button button-round button-border button-dark"
                          title={t("cancel")}
                        >
                          {t("cancel")}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(EditAccountBasicSubscription);
