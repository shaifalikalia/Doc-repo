import React from "react";
import styles from "./QuestionnaireForm.module.scss";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Card from "components/Card";
import useQuestionnaireState from "./useQuestionnaireState";
import Loader from "components/Loader";
import OutsideClickHandler from "react-outside-click-handler";

const QuestionnaireForm = ({ t, signIn }) => {
  const { state, updateMethods, otherMethods } = useQuestionnaireState({
    t,
    signIn,
  });
  const { questionsList, showDropdown, isLoading, viewSuboptionsListFor } =
    state;
  const { setShowDropdown } = updateMethods;
  const {
    handleGoBack,
    handleShowDropdown,
    handleTextQuestionAnswer,
    getTextQuestionAnswer,
    handleDropdownOptionSelect,
    getSelectedOption,
    handleOptionSelect,
    getQuestionError,
    isTextQuestion,
    isDropdownQuestion,
    isQuestionOne,
    isQuestionTwo,
    handleSubmit,
    handleSuboptionsListView,
    handleSuboptionSelect,
    getSelectedSuboption,
    getQuestionSuboptionError,
  } = otherMethods;

  const getTextboxQuestionView = (question) => {
    const { questionOrder, question: questionText } = question;
    const error = getQuestionError(questionOrder);
    return (
      <Card key={questionOrder} className={styles["card-box"]}>
        <div className={styles["question-box"]}>
          {t("questionnaire.questionText", { questionOrder, questionText })}
        </div>
        <div className={`c-field`}>
          <textarea
            className="c-form-control"
            placeholder={t("questionnaire.addYourAnswerHere")}
            value={getTextQuestionAnswer(questionOrder)}
            onChange={(e) => handleTextQuestionAnswer(questionOrder, e)}
            maxLength="400"
          ></textarea>
          {!!error && <span className="error-msg">{error}</span>}
        </div>
      </Card>
    );
  };

  const getDropdownQuestionView = (question) => {
    const {
      questionOrder,
      question: questionText,
      appointmentQuestionnaireOption,
    } = question;
    const error = getQuestionError(questionOrder);
    let selectedOption = getSelectedOption(questionOrder);
    if (selectedOption > 0) {
      selectedOption = appointmentQuestionnaireOption.find(
        (op) => op.optionOrder === selectedOption
      );
    }
    return (
      <Card key={questionOrder} className={styles["card-box"]}>
        <div className={styles["question-box"]}>
          {t("questionnaire.questionText", { questionOrder, questionText })}
        </div>
        <OutsideClickHandler onOutsideClick={() => setShowDropdown(false)}>
          <div className="position-relative">
            <div onClick={handleShowDropdown} className={styles["select-box"]}>
              {selectedOption
                ? selectedOption.optionName
                : t("questionnaire.select")}
              <img
                className={`${styles["caret-img"]}`}
                src={require("assets/images/caret.svg").default}
                alt="img"
              />
            </div>
            {!!error && <span className="error-msg">{error}</span>}
            {showDropdown && (
              <div className={styles["select-list"]}>
                {appointmentQuestionnaireOption.map((option) => {
                  const { optionName, optionOrder } = option;
                  //const isSelected = getSelectedOption(questionOrder) === optionOrder;
                  return (
                    <div
                      onClick={() =>
                        handleDropdownOptionSelect(questionOrder, optionOrder)
                      }
                      key={optionOrder}
                      className={styles["text-wrapper"] + " cursor-pointer"}
                    >
                      <div className={styles["text"]}>{optionName}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </OutsideClickHandler>
      </Card>
    );
  };

  const getQuestionOneView = (question) => {
    const {
      questionOrder,
      question: questionText,
      appointmentQuestionnaireOption,
    } = question;
    const error = getQuestionError(questionOrder);
    return (
      <Card key={questionOrder} className={styles["card-box"]}>
        <div className={styles["question-box"]}>
          {t("questionnaire.questionText", { questionOrder, questionText })}
        </div>
        <div className="ch-radio">
          {appointmentQuestionnaireOption.map((op) => {
            const { optionName, optionOrder } = op;
            const isChecked = getSelectedOption(questionOrder) === optionOrder;
            return (
              <label key={optionOrder} className="mr-5">
                <input
                  type="radio"
                  onChange={() =>
                    handleOptionSelect(questionOrder, optionOrder)
                  }
                  checked={isChecked}
                />
                <span> {optionName} </span>
              </label>
            );
          })}
        </div>
        {!!error && <span className="error-msg">{error}</span>}
      </Card>
    );
  };

  const getQuestionTwoView = (question) => {
    const {
      questionOrder,
      question: questionText,
      appointmentQuestionnaireOption,
    } = question;
    const error = getQuestionError(questionOrder);
    return (
      <Card key={questionOrder} className={styles["card-box"]}>
        <div className={styles["question-box"]}>
          {t("questionnaire.questionText", { questionOrder, questionText })}
        </div>
        <ul className={styles["option-list"]}>
          {appointmentQuestionnaireOption.map((option) => {
            const {
              optionName,
              optionOrder,
              isSubOption,
              appointmentQuestionnaireSubOption,
              timeRequired,
            } = option;
            const selectedOption = getSelectedOption(questionOrder);
            const isOptionChecked = selectedOption === optionOrder;

            //If there are suboptions
            if (isSubOption && appointmentQuestionnaireSubOption?.length) {
              const shouldShowSuboptions =
                viewSuboptionsListFor === optionOrder;
              const suboptionError = getQuestionSuboptionError(questionOrder);
              return (
                <li key={optionOrder}>
                  <div className="ch-radio">
                    <label>
                      <input
                        type="radio"
                        checked={isOptionChecked}
                        onChange={() =>
                          handleOptionSelect(questionOrder, optionOrder)
                        }
                      />
                      <span> {optionName} </span>
                    </label>
                  </div>
                  <div className={styles["sub-option-box"]}>
                    <div>
                      <span
                        onClick={() => handleSuboptionsListView(optionOrder)}
                        className="link-btn"
                      >
                        {t("questionnaire.suboptions", {
                          count: appointmentQuestionnaireSubOption.length,
                        })}
                        <img
                          className={`${styles["arrow-img"]} ${
                            shouldShowSuboptions && styles["arrow-up"]
                          }`}
                          src={require("assets/images/down-arrow.svg").default}
                          alt="img"
                        />
                      </span>
                    </div>
                    {shouldShowSuboptions && (
                      <div className={styles["sub-option-list"]}>
                        {appointmentQuestionnaireSubOption.map((suboption) => {
                          const {
                            subOptionName,
                            subOptionOrder,
                            timeRequired: timeRequiredForSubOption,
                          } = suboption;
                          const selectedSuboption =
                            getSelectedSuboption(questionOrder);
                          const isSuboptionChecked =
                            selectedSuboption === subOptionOrder;
                          return (
                            <div
                              key={subOptionOrder}
                              className={"ch-radio " + styles["flex-list"]}
                            >
                              <label>
                                <input
                                  type="radio"
                                  checked={
                                    isOptionChecked && isSuboptionChecked
                                  }
                                  onChange={() =>
                                    handleSuboptionSelect(
                                      questionOrder,
                                      optionOrder,
                                      subOptionOrder
                                    )
                                  }
                                />
                                <span> {subOptionName} </span>
                              </label>
                              <div className={styles["time-text"]}>
                                {t("questionnaire.appointmentTime", {
                                  timeRequired: timeRequiredForSubOption,
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {isOptionChecked && !!suboptionError && (
                      <span className="error-msg">{suboptionError}</span>
                    )}
                  </div>
                </li>
              );
            }

            //When there are no suboptions
            return (
              <li key={optionOrder}>
                <div className={"ch-radio " + styles["flex-list"]}>
                  <label className="mr-5">
                    <input
                      type="radio"
                      checked={isOptionChecked}
                      onChange={() =>
                        handleOptionSelect(questionOrder, optionOrder)
                      }
                    />
                    <span> {optionName} </span>
                  </label>
                  <div className={styles["time-text"]}>
                    {t("questionnaire.appointmentTime", { timeRequired })}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {!!error && <span className="error-msg">{error}</span>}
      </Card>
    );
  };

  const questionsUi = questionsList.map((question) => {
    const { questionOrder } = question;
    if (isQuestionOne(questionOrder)) {
      return getQuestionOneView(question);
    }
    if (isDropdownQuestion(questionOrder)) {
      return getDropdownQuestionView(question);
    }
    if (isTextQuestion(questionOrder)) {
      return getTextboxQuestionView(question);
    }
    if (isQuestionTwo(questionOrder)) {
      return getQuestionTwoView(question);
    }

    return null;
  });

  return (
    <Page
      className={styles["questionnaire-page"]}
      onBack={handleGoBack}
      title={t("patient.QuestionnaireForBookingAnAppointment")}
    >
      {isLoading && <Loader />}

      {questionsUi}

      <div className={styles["btn-box"]}>
        <button
          className={
            "button button-round button-shadow mr-md-4 " + styles["btn-green"]
          }
          title={t("submit")}
          onClick={handleSubmit}
        >
          {t("submit")}
        </button>
        <button
          className={
            "button button-round button-dark button-border " +
            styles["btn-border"]
          }
          title={t("cancel")}
          onClick={handleGoBack}
        >
          {t("cancel")}
        </button>
      </div>
    </Page>
  );
};

export default withTranslation()(QuestionnaireForm);
