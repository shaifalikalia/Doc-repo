import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import { testRegexCheck } from "utils";
import "./../category.scss";
import Input from "components/Input";
import constants from "../../../../../constants";
import Loader from "components/Loader";

function AddNewCategoryModal({
  t,
  showCategoryPopup,
  toogleAddCategoryPopUp,
  categoryMaxLength,
  submitCategory,
  showLoader,
  editCategoryDetails,
}) {
  const [categoryValue, setCategoryValue] = useState("");
  const [error, setError] = useState("");
  const isEdit = editCategoryDetails?.id ? true : false;

  useEffect(() => {
    if (editCategoryDetails?.id) {
      setCategoryValue(editCategoryDetails.name);
    }
  }, [editCategoryDetails]);

  const handleSubmit = () => {
    if (!categoryValue?.trim()?.length) {
      setError(t("form.errors.emptyField", { field: t("Category Name") }));
      return;
    }

    submitCategory(
      isEdit ? constants.categoryType.edit : constants.categoryType.add,
      categoryValue
    );
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (!testRegexCheck(e.target.value)) return;
    if (!value?.trim()?.length) {
      setError(t("form.errors.emptyField", { field: t("Category Name") }));
    } else {
      setError("");
    }
    setCategoryValue(e.target.value);
  };

  return (
    <>
      <Modal
        isOpen={showCategoryPopup}
        toggle={toogleAddCategoryPopUp}
        className={"modal-dialog-centered modal-width-660 category-modal"}
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={toogleAddCategoryPopUp}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        <ModalBody>
          {showLoader && <Loader />}

          <Text size="25px" marginBottom="25px" weight="500" color="#111b45">
            {isEdit
              ? t("superAdminCategories.editCategory")
              : t("superAdminCategories.addNewCategory")}
          </Text>

          <Input
            Title={t("superAdminCategories.categoryName")}
            Type="text"
            Name={"billMeLaterCreditLimit"}
            MaxLength={categoryMaxLength}
            Value={categoryValue}
            HandleChange={handleChange}
            Error={error}
            Placeholder={t("form.placeholder1", {
              field: t("superAdminCategories.categoryName"),
            })}
          />
          <div className="last-field">
            <button
              className="button button-round button-shadow mr-4"
              title={t("superAdminCategories.save")}
              onClick={handleSubmit}
            >
              {t("superAdminCategories.save")}
            </button>
            <button
              className="button button-round button-border button-dark "
              onClick={toogleAddCategoryPopUp}
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

export default withTranslation()(AddNewCategoryModal);
