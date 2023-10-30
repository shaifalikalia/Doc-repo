import { useEffect, useState } from "react";
import Page from "components/Page";
import CustomSelect from "components/CustomSelect";
import styles from "./Feedback.module.scss";
import { withTranslation } from "react-i18next";
import {
  FeedBackAndSuggestionCategoryList,
  addFeedBackAndSuggestions,
} from "repositories/utility-repository";
import toast from "react-hot-toast";
import Loader from "components/Loader";
import { testRegexCheckDescription } from "utils";

const FeedbackPage = ({ t, history }) => {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    Description: "",
    category: "",
  });
  const [isLoader, setIsLoader] = useState(false);
  const [CategoryList, SetCategoryList] = useState();

  useEffect(() => {
    getFeedBackCategoryList();
  }, []);

  const getFeedBackCategoryList = async () => {
    setIsLoader(true);
    try {
      let res = await FeedBackAndSuggestionCategoryList();
      SetCategoryList(res);
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoader(false);
  };

  const goBack = () => history.push("/");

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    if (name === "Description" && !testRegexCheckDescription(value)) return;
    values[name] = value;
    if (errors[name]) {
      delete errors[name];
    }
    setErrors({ ...errors });
    setValues({ ...values });
  };

  const handleCustomDropDown = (value, name) => {
    const eventObject = {
      target: {
        value: value.id.toString(),
        name: name,
      },
    };

    handleChange(eventObject);
  };

  const isValid = () => {
    let valid = true;
    if (values.category) {
      delete errors["category"];
    } else {
      valid = false;
      errors["category"] = t("form.errors.emptySelection", {
        field: t("form.fields.category"),
      });
    }

    if (values.Description && values.Description?.trim()) {
      delete errors["Description"];
    } else {
      valid = false;
      errors["Description"] = t("form.errors.emptySelection", {
        field: t("form.fields.description"),
      });
    }

    return valid;
  };

  const handleSubmit = async () => {
    try {
      if (isValid()) {
        setIsLoader(true);
        let params = {
          Description: values.Description,
          UserFeedbackAndSuggestionCategoryId: +values.category,
        };
        let res = await addFeedBackAndSuggestions(params);
        toast.success(res.message);
        setValues({ Description: "", category: "" });
        setIsLoader(false);
        history.push("/");
      }
    } catch (error) {
      toast.error(error.message);
      setIsLoader(false);
    }

    setErrors({ ...errors });
  };

  const getSelectedOption = () => {
    const selectedData =
      CategoryList.find(
        (category) => category.id.toString() === values?.category?.toString()
      ) || {};
    return selectedData.category;
  };

  return (
    <Page onBack={goBack}>
      {isLoader && <Loader />}
      <div className="p-0 container container-smd">
        <h2 className="page-title mb-3">{t("feedback.title")}</h2>
        <div className="form-wrapper mb-5">
          <div className={styles["busy-timeslots-form"]}>
            {CategoryList && CategoryList.length > 0 && (
              <div className="custom-dropdown-only">
                <CustomSelect
                  Title={t("form.fields.category")}
                  options={CategoryList}
                  id={"category"}
                  dropdownClasses={"custom-select-scroll"}
                  getName={(op) => op?.category}
                  selectedOption={{ category: getSelectedOption() }}
                  selectOption={(value) =>
                    handleCustomDropDown(value, "category")
                  }
                />
              </div>
            )}
            {errors.category && (
              <span className="error-msg">{errors.category}</span>
            )}

            <div
              className={`c-field  ${errors.Description ? "error-input" : ""}`}
            >
              <label>{t("form.fields.description")}</label>
              <textarea
                className="c-form-control"
                placeholder={t("form.placeholder1", {
                  field: t("form.fields.description"),
                })}
                name="Description"
                maxLength="400"
                value={values.Description}
                onChange={(e) => handleChange(e)}
              ></textarea>
              {errors.Description && (
                <span className="error-msg">{errors.Description}</span>
              )}
            </div>
            <button
              className="button button-round button-shadow mr-4"
              title={t("submit")}
              onClick={handleSubmit}
            >
              {t("submit")}
            </button>
            <button
              className="button button-round button-dark button-border"
              title={t("cancel")}
              onClick={goBack}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default withTranslation()(FeedbackPage);
