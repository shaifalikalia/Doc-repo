import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Col, Modal, Row } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import Input from "components/Input";
import constants from "../../../../../constants";
import Loader from "components/Loader";
import { useAddTaxManagment } from "../../Hooks/useAddTaxManagment";

function AddTaxDetailsModal({
  t,
  toogleAddTaxPopUp,
  provienceListing,
  isRefetch,
  isEditTaxDetails,
}) {
  const {
    formFields,
    provienceList,
    isError,
    handleChanged,
    radioHandler,
    showLoader,
    taxType,
    handleProvience,
    submitTaxes,
    isEdit,
  } = useAddTaxManagment({ provienceListing, t, isRefetch, isEditTaxDetails });
  const { taxName, taxPercentage } = formFields;

  return (
    <>
      <Modal
        isOpen={true}
        toggle={toogleAddTaxPopUp}
        className={"modal-dialog-centered modal-width-660 tax-detail-modal"}
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={toogleAddTaxPopUp}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        {showLoader && <Loader />}
        <ModalBody>
          <Text size="25px" marginBottom="25px" weight="500" color="#111b45">
            {isEdit ? t("superAdminTax.editTax") : t("superAdminTax.addNewTax")}
          </Text>
          <Input
            Title={t("superAdminTax.taxName")}
            Type="text"
            Value={taxName}
            Name={"taxName"}
            Placeholder={t("form.placeholder1", {
              field: t("superAdminTax.taxName"),
            })}
            HandleChange={handleChanged}
            MaxLength={120}
            Error={isError?.taxName}
          />
          <Text size="13px" weight="400" color="#79869a">
            {" "}
            {t("superAdminTax.taxType")}
          </Text>
          <div className="ch-radio ">
            <label className="mr-5">
              <input
                type="radio"
                name="setPercent"
                onChange={(e) => radioHandler(constants.taxType.oneTax)}
                checked={taxType === constants.taxType.oneTax}
              />
              <span> {t("superAdminTax.oneTax")} </span>
            </label>

            <label>
              <input
                type="radio"
                onChange={(e) => radioHandler(constants.taxType.ProvienceTax)}
                name="setPercent"
                checked={taxType === constants.taxType.ProvienceTax}
              />
              <span>{t("superAdminTax.provinceWiseTax")}</span>
            </label>
          </div>

          {taxType === 1 && (
            <div className="last-field">
              <Input
                Title={t("superAdminTax.taxPercentage")}
                Name={"taxPercentage"}
                Type="text"
                HandleChange={handleChanged}
                Placeholder={t("form.placeholder1", {
                  field: t("superAdminTax.taxPercentage"),
                })}
                Value={taxPercentage}
                Error={isError?.taxPercentage}
              />
            </div>
          )}
          {taxType === 2 && (
            <div className="last-field">
              <Col md="12">
                <Text size="13px" weight="400" color="#79869a">
                  {" "}
                  {t("superAdminTax.provinceStates")}
                </Text>
              </Col>

              {provienceList.length > 0 &&
                provienceList?.map((item) => (
                  <Row className="align-items-center" key={item.id}>
                    <Col sm="5">
                      <Text
                        size="14px"
                        marginBottom="25px"
                        weight="600"
                        color="#102C42"
                      >
                        {item.name}
                      </Text>
                    </Col>
                    <Col sm="7">
                      <Input
                        Title={t("superAdminTax.setPercent")}
                        Type="text"
                        Name={"Alberta"}
                        Value={item.Percentage}
                        Placeholder={t("form.placeholder1", {
                          field: t("superAdminTax.percent"),
                        })}
                        HandleChange={(e) =>
                          handleProvience(e.target.value, item.id)
                        }
                        Error={item.error}
                      />
                    </Col>
                  </Row>
                ))}
            </div>
          )}
          <button
            className="button button-round button-shadow mr-4"
            title={t("save")}
            onClick={submitTaxes}
          >
            {t("save")}
          </button>
          <button
            className="button button-round button-border button-dark "
            onClick={toogleAddTaxPopUp}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(AddTaxDetailsModal);
