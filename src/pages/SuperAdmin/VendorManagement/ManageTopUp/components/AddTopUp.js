import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import "../topUp.scss";
import Input from "components/Input";
import Loader from "components/Loader";

const formModel = {
  name: "",
  noofPromotions: "",
  price: "",
};

function AddTopUpModal({
  t,
  addTopUpModalOpen,
  setAddTopUpModalOpen,
  methods,
  details,
  isLoading,
}) {
  const [formFields, setFormFields] = useState(formModel);
  const [error, setError] = useState({});
  const { name, noofPromotions, price } = formFields;

  useEffect(() => {
    if (details?.id) {
      setFormFields({
        name: details.name,
        noofPromotions: details.numberOfPromotions.toString(),
        price: details.price.toString(),
      });
    } else {
      setFormFields(formModel);
    }
  }, [details]);

  const handleChangeNumberofPromtions = (event) => {
    const { value } = event.target;
    let regex = new RegExp(/^(0?[1-9]|[1-9][0-9])$/);
    if (regex.test(value) || value === "") {
      setFormFields((prev) => ({ ...prev, noofPromotions: value }));
      setError((pre) => {
        delete pre["noofPromotions"];
        return pre;
      });
    }
  };

  const handlePrice = (event) => {
    const { value } = event.target;
    let regex = new RegExp(/^\d{0,3}(\.\d{0,2})?$/);
    if (regex.test(value) || value === "") {
      setFormFields((prev) => ({ ...prev, price: value }));
      setError((pre) => {
        delete pre["price"];
        return pre;
      });
    }
  };

  const handleChangeName = (event) => {
    const { value } = event.target;
    setFormFields((prev) => ({ ...prev, name: value }));
    value?.trim()?.length &&
      setError((pre) => {
        delete pre["name"];
        return pre;
      });
  };

  const isValid = () => {
    let formValid = true;

    if (!name?.trim().length) {
      error["name"] = t("fieldNotEmpty");
      formValid = false;
    }
    if (!noofPromotions?.trim().length) {
      error["noofPromotions"] = t("fieldNotEmpty");
      formValid = false;
    }
    if (!price?.trim().length) {
      error["price"] = t("fieldNotEmpty");
      formValid = false;
    }

    setError({ ...error });
    return formValid;
  };

  const handleSubmit = () => {
    if (!isValid()) return;
    let id = details?.id;
    methods.submitPromotions(formFields, id);
  };

  const closeModel = () => {
    setAddTopUpModalOpen({ isOpen: false, type: null });
  };

  return (
    <>
      <Modal
        isOpen={addTopUpModalOpen}
        toggle={closeModel}
        className={"modal-dialog-centered modal-width-660 topup-modal"}
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={closeModel}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        <ModalBody>
          {isLoading && <Loader />}
          <Text size="25px" marginBottom="25px" weight="500" color="#111b45">
            {!details?.id
              ? t("superAdminTopUp.addTopUpPromotions")
              : t("superAdminTopUp.editTopUpPromotions")}
          </Text>

          <Input
            Title={t("superAdminTopUp.topUpPromotionsName")}
            Type="text"
            Value={name}
            HandleChange={handleChangeName}
            Name={"Elite Promotion Pack"}
            maxLength={120}
            Placeholder={t("form.placeholder1", {
              field: t("superAdminTopUp.topUpPromotionsName"),
            })}
            Error={error.name}
          />
          <Input
            Title={t("superAdminTopUp.noOfPromotions")}
            Type="text"
            Name={"noofPromotions"}
            Error={error.noofPromotions}
            Value={noofPromotions}
            Placeholder={t("form.placeholder1", {
              field: t("superAdminTopUp.noOfPromotions"),
            })}
            handleChangeNumberofPromtions
            HandleChange={handleChangeNumberofPromtions}
          />
          <Input
            Title={t("superAdminTopUp.price")}
            Type="text"
            HandleChange={handlePrice}
            Error={error.price}
            Value={price}
            Name={"price"}
            Placeholder={t("form.placeholder1", {
              field: t("superAdminTopUp.price"),
            })}
          />
          <div className="last-field">
            <button
              className="button button-round button-shadow mr-4"
              title={t("superAdminTopUp.save")}
              onClick={handleSubmit}
            >
              {t("superAdminTopUp.save")}
            </button>
            <button
              className="button button-round button-border button-dark "
              onClick={closeModel}
              title={t("cancel")}
            >
              {t("cancel")}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(AddTopUpModal);
