import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "../../assets/images/cross.svg";
import Text from "components/Text";
import Input from "components/Input";
import Helper from "utils/helper";
import { sendFaqEmail } from "repositories/contract-repository";
import toast from "react-hot-toast";
import Loader from "components/Loader";
import constants from "../../constants";

function DownloadModal({
  t,
  isDownloadModalOpen,
  setIsDownloadModalOpen,
  type,
}) {
  let formsField = {
    name: "",
    email: "",
    receiveInformation: false,
  };
  const [formFields, setFormFields] = useState(formsField);
  const [isLoader, setIsLoader] = useState(false);
  const { name, email, receiveInformation } = formFields;
  const [error, setError] = useState({});
  const heading =
    type === constants.faqRequestType.HelpGuideRequest
      ? t("faq.downloadOurGuide")
      : t("faq.downloadOurCheckList");

  const isValid = () => {
    if (!receiveInformation) return false;
    let formValid = true;
    let err = {};

    if (!name?.trim()?.length) {
      err.name = t("form.errors.emptyField", { field: t("form.fields.name") });
      formValid = false;
    }

    if (!email?.trim()?.length) {
      err.email = t("form.errors.emptyField", {
        field: t("form.fields.emailAddress"),
      });
      formValid = false;
    }

    if (!Helper.validateEmail(email)) {
      err.email = t("form.errors.invalidValue", {
        field: t("form.fields.emailAddress"),
      });
      formValid = false;
    }

    setError({ ...err });
    return formValid;
  };

  const handleChange = (event) => {
    const { name: currentName, value } = event.target;
    let isErrorDeleted = false;
    if (currentName === "name" && value?.trim()?.length) {
      delete error[currentName];
      isErrorDeleted = true;
    }
    if (
      currentName === "email" &&
      value?.trim()?.length &&
      Helper.validateEmail(email)
    ) {
      delete error[currentName];
      isErrorDeleted = true;
    }

    if (isErrorDeleted) {
      setError({ ...error });
    }

    setFormFields((e) => ({ ...e, [currentName]: value }));
  };

  const handleSubmit = async () => {
    if (!isValid()) return false;
    setIsLoader(true);
    try {
      let params = {
        Name: name,
        EmailId: email,
        Type: type,
      };
      let res = await sendFaqEmail(params);
      toast.success(res.message);
      setFormFields(formsField);
      setIsDownloadModalOpen();
    } catch (err) {
      toast.error(err.message);
    }
    setIsLoader(false);
  };

  return (
    <>
      <Modal
        isOpen={isDownloadModalOpen}
        toggle={() => setIsDownloadModalOpen()}
        className={"modal-dialog-centered modal-width-660"}
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={() => setIsDownloadModalOpen()}>
          <img src={crossIcon} alt="close" />
        </span>

        {isLoader && <Loader />}

        <ModalBody>
          <Text size="25px" marginBottom="40px" weight="500" color="#111b45">
            <span className="modal-title-25"> {heading}</span>
          </Text>
          <Input
            Title={t("faq.name")}
            Type="text"
            Placeholder={t("form.placeholder1", {
              field: t("vendorManagement.name"),
            })}
            Name={"name"}
            MaxLength={40}
            Value={name}
            HandleChange={handleChange}
            Error={error?.name}
          />
          <Input
            Title={t("faq.emailAddress")}
            Type="email"
            Placeholder={t("form.placeholder1", { field: t("emailAddress") })}
            Name={"email"}
            Value={email}
            MaxLength={70}
            HandleChange={handleChange}
            Error={error?.email}
          />
          <div className={`ch-checkbox mb-4 pb-3`}>
            <label>
              <input
                type="checkbox"
                checked={receiveInformation}
                onChange={(event) =>
                  setFormFields((e) => ({
                    ...e,
                    receiveInformation: event.target.checked,
                  }))
                }
              />
              <span>{t("faq.iAgreeToReceiveTheInformations")}</span>
            </label>
          </div>
          <button
            className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            title={t("send")}
            disabled={!receiveInformation}
            onClick={handleSubmit}
          >
            {" "}
            {t("send")}
          </button>
          <button
            className="button btn-mobile-link button-round button-border button-dark "
            onClick={() => setIsDownloadModalOpen()}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(DownloadModal);
