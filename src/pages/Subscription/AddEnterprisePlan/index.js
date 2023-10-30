import React, { useState, useMemo, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

/*components*/
import Input from "components/Input";
import Text from "components/Text";
import Loader from "components/Loader";
import { Col } from "reactstrap/lib";
import { withTranslation } from "react-i18next";
import { handleError, handleSuccess, testRegexCheck } from "utils";
import {
  updateEnterPrice,
  addEnterPrice,
} from "repositories/subscription-repository";
import styles from "./EditEnterpriceSubscription.module.scss";

let priceInputMaxLenght = 6;
const formFields = {
  name: "",
  SetupFeeChargeChargeInCad: "",
  perOfficeChargeInCad: "",
  perPermanentMemberChargeInCad: "",
  perTemporaryMemberChargeInCad: "",
  perPlacementChargeInCad: "",
  SetupFeeChargeChargeInUsd: "",
  perOfficeChargeInUsd: "",
  perPermanentMemberChargeInUsd: "",
  perTemporaryMemberChargeInUsd: "",
  perPlacementChargeInUsd: "",
};
function AddEnterPrisePlan({ t }) {
  const location = useLocation();
  const isEditForm = useMemo(
    () => location.pathname === "/edit-enterprise-plan",
    [location]
  );
  const [error, setError] = useState({});
  const [isLoader, setIsLoader] = useState(false);
  const [officeCharges, setOfficeCharges] = useState(formFields);
  const history = useHistory();

  useEffect(() => {
    if (isEditForm && location?.state) {
      setOfficeCharges((pre) => ({
        ...pre,
        name: location.state?.name,
        SetupFeeChargeChargeInCad: location.state?.setupFeeChargeInCad,
        perOfficeChargeInCad: location.state?.perOfficeChargeInCad,
        perPermanentMemberChargeInCad:
          location.state?.perPermanentStaffMemberChargeInCad,
        perTemporaryMemberChargeInCad:
          location.state?.perTemporaryStaffMemberChargeInCad,
        perPlacementChargeInCad: location.state?.perPlacementChangeInCad,
        SetupFeeChargeChargeInUsd: location.state?.setupFeeChargeInUsd,
        perOfficeChargeInUsd: location.state?.perOfficeChargeInUsd,
        perPermanentMemberChargeInUsd:
          location.state?.perPermanentStaffMemberChargeInUsd,
        perTemporaryMemberChargeInUsd:
          location.state?.perTemporaryStaffMemberChargeInUsd,
        perPlacementChargeInUsd: location.state?.perPlacementChangeInUsd,
      }));
    }
  }, location);

  const contvertIntoDec = (newValue, oldValue) => {
    if (!newValue) return "";
    let acceptNumberWithDecimal = new RegExp(/^\d*\.?\d*$/);
    if (acceptNumberWithDecimal.test(newValue)) return newValue;
    return oldValue;
  };

  const handleChange = (event, key) => {
    const { value, name } = event.target;
    let price = contvertIntoDec(value, officeCharges[name]);

    if (price || price === 0) {
      setError((pre) => {
        delete pre[name];
        return pre;
      });
    } else {
      setError((pre) => {
        pre[name] = t("fieldNotEmpty");
        return pre;
      });
    }
    setOfficeCharges((prev) => ({ ...prev, [name]: price }));
  };

  const isValueExist = (value) => {
    if (value || value === 0) return null;
    return t("fieldNotEmpty");
  };

  const isValid = () => {
    let errorMessage = {
      name: officeCharges?.name?.trim()?.length ? null : t("fieldNotEmpty"),
      SetupFeeChargeChargeInCad: isValueExist(
        officeCharges.SetupFeeChargeChargeInCad
      ),
      perOfficeChargeInCad: isValueExist(officeCharges.perOfficeChargeInCad),
      perPermanentMemberChargeInCad: isValueExist(
        officeCharges.perPermanentMemberChargeInCad
      ),
      perTemporaryMemberChargeInCad: isValueExist(
        officeCharges.perTemporaryMemberChargeInCad
      ),
      perPlacementChargeInCad: isValueExist(
        officeCharges.perPlacementChargeInCad
      ),
      SetupFeeChargeChargeInUsd: isValueExist(
        officeCharges.SetupFeeChargeChargeInUsd
      ),
      perOfficeChargeInUsd: isValueExist(officeCharges.perOfficeChargeInUsd),
      perPermanentMemberChargeInUsd: isValueExist(
        officeCharges.perPermanentMemberChargeInUsd
      ),
      perTemporaryMemberChargeInUsd: isValueExist(
        officeCharges.perTemporaryMemberChargeInUsd
      ),
      perPlacementChargeInUsd: isValueExist(
        officeCharges.perPlacementChargeInUsd
      ),
    };

    setError(errorMessage);
    return !Object.values(errorMessage).filter(Boolean)?.length;
  };

  const handleSubmit = async () => {
    try {
      if (!isValid()) return null;
      setIsLoader(true);
      let response = {};
      if (isEditForm) {
        let payload = [
          {
            packageId: location.state.id,
            name: officeCharges.name,
            SetupFeeChargeChargeInCad: parseFloat(
              officeCharges.SetupFeeChargeChargeInCad
            ),
            perOfficeChargeInCad: parseFloat(
              officeCharges.perOfficeChargeInCad
            ),
            perPermanentMemberChargeInCad: parseFloat(
              officeCharges.perPermanentMemberChargeInCad
            ),
            perTemporaryMemberChargeInCad: parseFloat(
              officeCharges.perTemporaryMemberChargeInCad
            ),
            perPlacementChargeInCad: parseFloat(
              officeCharges.perPlacementChargeInCad
            ),

            SetupFeeChargeChargeInUsd: parseFloat(
              officeCharges?.SetupFeeChargeChargeInUsd
            ),
            perOfficeChargeInUsd: parseFloat(
              officeCharges?.perOfficeChargeInUsd
            ),
            perPermanentMemberChargeInUsd: parseFloat(
              officeCharges?.perPermanentMemberChargeInUsd
            ),
            perTemporaryMemberChargeInUsd: parseFloat(
              officeCharges?.perTemporaryMemberChargeInUsd
            ),
            perPlacementChargeInUsd: parseFloat(
              officeCharges?.perPlacementChargeInUsd
            ),
          },
        ];
        response = await updateEnterPrice(payload);
      } else {
        let payload = {
          packageName: officeCharges.name,
          officeUnitPrice: parseFloat(officeCharges.perOfficeChargeInCad),
          permanentStaffUnitPrice: parseFloat(
            officeCharges?.perPermanentMemberChargeInCad
          ),
          temporaryStaffUnitPrice: parseFloat(
            officeCharges?.perTemporaryMemberChargeInCad
          ),
          placementUnitPrice: parseFloat(officeCharges.perPlacementChargeInCad),
          SetupFeeUnitPrice: parseFloat(
            officeCharges?.SetupFeeChargeChargeInCad
          ),

          officeUnitPriceInUsd: parseFloat(officeCharges.perOfficeChargeInUsd),
          permanentStaffUnitPriceInUsd: parseFloat(
            officeCharges?.perPermanentMemberChargeInUsd
          ),
          temporaryStaffUnitPriceInUsd: parseFloat(
            officeCharges?.perTemporaryMemberChargeInUsd
          ),
          placementUnitPriceInUsd: parseFloat(
            officeCharges?.perPlacementChargeInUsd
          ),
          SetupFeeUnitPriceInUsd: parseFloat(
            officeCharges?.SetupFeeChargeChargeInUsd
          ),
        };
        response = await addEnterPrice(payload);
      }

      response?.message && handleSuccess(response.message);
      history.goBack();
    } catch (err) {
      handleError(err);
    }
    setIsLoader(false);
  };

  const handler = (event) => {
    let value = event.target.value;
    if (!testRegexCheck(value)) return;

    setError((pre) => ({
      ...pre,
      name: !value?.trim()?.length ? t("fieldNotEmpty") : null,
    }));

    setOfficeCharges((prev) => ({ ...prev, name: value }));
  };

  return (
    <div
      className={
        "edit-pan-block edit-account-basic " + styles["edit-pan-block"]
      }
    >
      {isLoader && <Loader />}
      <div className={"container container-smd " + styles["container"]}>
        <button className="back-btn">
          <Link to="/enterprise-plans">
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
          {t("superAdmin.enterprisePlanSubscription")}
        </h2>
        <div className={"form-wrapper"}>
          <div className="edit-plan-form">
            <div className="d-flex">
              <Text
                size="14px"
                marginRight="13.5%"
                weight="600"
                color="#102C42"
              >
                {t("form.fields.packageName")}
              </Text>
              <Input
                className="abc"
                Title={t("form.fields.packageName")}
                Type="text"
                Placeholder={t("form.fields.packageName")}
                Name={"name"}
                HandleChange={handler}
                MaxLength={200}
                Error={error.name}
                Value={officeCharges.name}
              />
            </div>

            <div className="d-flex flex-wrap">
              <div className={styles["left-edit"]}>
                <LeftDawer t={t} />
              </div>

              {/* CAD */}
              <div className={styles["middle-edit"]}>
                <div className={styles["middle-edit-inner"]}>
                  <h3> {t("CAD")}</h3>
                  <div className="row">
                    <div className="col-md-12">
                      <Input
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("superAdmin.setUpFree"),
                        })}
                        Value={officeCharges.SetupFeeChargeChargeInCad}
                        Name={"SetupFeeChargeChargeInCad"}
                        HandleChange={handleChange}
                        Error={error?.SetupFeeChargeChargeInCad}
                        MaxLength={priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-12">
                      <Input
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("superAdmin.officeCharges"),
                        })}
                        Value={officeCharges.perOfficeChargeInCad}
                        Name={"perOfficeChargeInCad"}
                        HandleChange={handleChange}
                        Error={error?.perOfficeChargeInCad}
                        MaxLength={priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-12">
                      <Input
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.permanentStaffCharges"),
                        })}
                        Value={officeCharges.perPermanentMemberChargeInCad}
                        Name={"perPermanentMemberChargeInCad"}
                        HandleChange={handleChange}
                        Error={error?.perPermanentMemberChargeInCad}
                        MaxLength={priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-12">
                      <Input
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.temporaryStaffCharges"),
                        })}
                        Value={officeCharges.perTemporaryMemberChargeInCad}
                        Name={"perTemporaryMemberChargeInCad"}
                        HandleChange={handleChange}
                        Error={error?.perTemporaryMemberChargeInCad}
                        MaxLength={priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-12">
                      <Input
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.perEachPlacement"),
                        })}
                        Name={"perPlacementChargeInCad"}
                        Value={officeCharges.perPlacementChargeInCad}
                        HandleChange={handleChange}
                        Error={error?.perPlacementChargeInCad}
                        MaxLength={priceInputMaxLenght}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* USD */}
              <div className={styles["right-edit"]}>
                <div className={styles["right-edit-inner"]}>
                  <h3> {t("USD")}</h3>
                  <div className="row">
                    <div className="col-md-12">
                      <Input
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("superAdmin.setUpFree"),
                        })}
                        Value={officeCharges.SetupFeeChargeChargeInUsd}
                        Name={"SetupFeeChargeChargeInUsd"}
                        HandleChange={handleChange}
                        Error={error?.SetupFeeChargeChargeInUsd}
                        MaxLength={priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-12">
                      <Input
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("superAdmin.officeCharges"),
                        })}
                        Value={officeCharges.perOfficeChargeInUsd}
                        Name={"perOfficeChargeInUsd"}
                        HandleChange={handleChange}
                        Error={error?.perOfficeChargeInUsd}
                        MaxLength={priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-12">
                      <Input
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.permanentStaffCharges"),
                        })}
                        Value={officeCharges.perPermanentMemberChargeInUsd}
                        Name={"perPermanentMemberChargeInUsd"}
                        HandleChange={handleChange}
                        Error={error?.perPermanentMemberChargeInUsd}
                        MaxLength={priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-12">
                      <Input
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.temporaryStaffCharges"),
                        })}
                        Value={officeCharges.perTemporaryMemberChargeInUsd}
                        Name={"perTemporaryMemberChargeInUsd"}
                        HandleChange={handleChange}
                        Error={error?.perTemporaryMemberChargeInUsd}
                        MaxLength={priceInputMaxLenght}
                      />
                    </div>

                    <div className="col-md-12">
                      <Input
                        Type="text"
                        Placeholder={t("form.placeholder1", {
                          field: t("form.fields.perEachPlacement"),
                        })}
                        Name={"perPlacementChargeInUsd"}
                        Value={officeCharges.perPlacementChargeInUsd}
                        HandleChange={handleChange}
                        Error={error?.perPlacementChargeInUsd}
                        MaxLength={priceInputMaxLenght}
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
                        onClick={handleSubmit}
                      >
                        {t("save")}
                      </button>
                    </div>
                    <div className="col-md-auto">
                      <Link to="/enterprise-plans">
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
}

export default withTranslation()(AddEnterPrisePlan);

function LeftDawer({ t }) {
  return (
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
  );
}
