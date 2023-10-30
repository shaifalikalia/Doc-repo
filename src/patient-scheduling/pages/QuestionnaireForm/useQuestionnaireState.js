import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import qs from "query-string";
import constants from "../../../constants";
import {
  useFillQuestionnaire,
  useGetFilledQuestionnaire,
  useGetQuestionnaire,
} from "repositories/questionnaire-repository";
import toast from "react-hot-toast";
import { orderBy } from "lodash";
import produce from "immer";
import { scrollToError } from "utils";
import { useSelector } from "react-redux";

const useQuestionnaireState = (dependencies) => {
  const { t, signIn } = dependencies;
  const location = useLocation();
  const history = useHistory();
  const profile = useSelector((state) => state.userProfile.profile);
  let officeId, doctorId, isEdit, memberId;
  ({ officeId, doctorId, isEdit, memberId } = qs.parse(location.search));
  isEdit = isEdit === "true" ? true : false;

  const isGetQuestionnaireEnabled = !isEdit && officeId;
  const isGetFilledQuestionnaireEnabled =
    isEdit && profile && profile.id && officeId && doctorId;

  //**Get Office Questionnaire */
  const {
    isLoading: isQuestionnaireLoading,
    data: questionsData,
    isFetching: isFetchingQuestions,
    error: questionsError,
  } = useGetQuestionnaire(officeId, { enabled: !!isGetQuestionnaireEnabled });

  //**Get Filled Questionnaire with responses */
  const {
    isLoading: filledQuestionnaireLoading,
    data: filledQuestions,
    isFetching: isFetchingFilledQuestions,
    error: filledQuestionsError,
  } = useGetFilledQuestionnaire(officeId, doctorId, profile?.id, {
    enabled: !!isGetFilledQuestionnaireEnabled,
  });

  const fillQuestionnaireMutation = useFillQuestionnaire();
  const { isLoading: fillingQuestionnaire } = fillQuestionnaireMutation;

  const orderbyQuestionOrder = (questions) => {
    return orderBy(questions || [], "questionOrder", "asc");
  };

  const convertFilledQuestions = (questions = []) => {
    return questions?.map((question) => {
      const { patientQuestionnaireOptionResponse, ...restQuestion } = question;
      let appointmentQuestionnaireOption = patientQuestionnaireOptionResponse;
      if (patientQuestionnaireOptionResponse?.length) {
        appointmentQuestionnaireOption = patientQuestionnaireOptionResponse.map(
          (op) => {
            const { patientQuestionnaireSubOptionResponse, ...restOption } = op;
            return {
              ...restOption,
              appointmentQuestionnaireSubOption:
                patientQuestionnaireSubOptionResponse,
            };
          }
        );
      }
      return {
        ...restQuestion,
        appointmentQuestionnaireOption,
      };
    });
  };

  const handleGoBack = () => {
    history.push({
      pathname: constants.routes.doctor,
      search:
        officeId && doctorId
          ? qs.stringify({
              officeId,
              doctorId,
              memberId,
            })
          : null,
    });
  };

  const initialAnswers = [
    {
      QuestionOrder: 1,
      OptionOrder: 0,
      SubOptionOrder: 0,
      error: "",
      suboptionError: "",
    },
    {
      QuestionOrder: 2,
      OptionOrder: 0,
      SubOptionOrder: 0,
      error: "",
      suboptionError: "",
    },
    {
      QuestionOrder: 3,
      OptionOrder: 0,
      SubOptionOrder: 0,
      error: "",
      suboptionError: "",
    },
    {
      QuestionOrder: 4,
      QuestionnaireTextResponse: "",
      error: "",
    },
    {
      QuestionOrder: 5,
      QuestionnaireTextResponse: "",
      error: "",
    },
    {
      QuestionOrder: 6,
      QuestionnaireTextResponse: "",
      error: "",
    },
  ];

  const [questionsList, setQuestionsList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [answers, setAnswers] = useState(initialAnswers);
  //Show suboptions list for selected option.
  const [viewSuboptionsListFor, setViewSuboptionsListFor] = useState(0);

  //**Useeffect for showing any get api errors */
  useEffect(() => {
    if (
      !isEdit &&
      !isQuestionnaireLoading &&
      !isFetchingQuestions &&
      questionsError
    ) {
      toast.error(questionsError.message);
    }
    if (
      isEdit &&
      !filledQuestionnaireLoading &&
      !isFetchingFilledQuestions &&
      filledQuestionsError
    ) {
      toast.error(filledQuestionsError.message);
    }
  }, [questionsError, filledQuestionsError]);

  //**UseEffect to get unfilled office questionnaire */
  useEffect(() => {
    if (isGetQuestionnaireEnabled && questionsData) {
      setQuestionsList(questionsData);
    }
  }, [questionsData]);

  //**UseEffect to get Filled Questionnaire */
  useEffect(() => {
    if (isGetFilledQuestionnaireEnabled && filledQuestions) {
      const updatedFilledQuestions = convertFilledQuestions(filledQuestions);
      let updatedViewSuboptionsListFor = 0;
      const updatedInitialAnswers = orderbyQuestionOrder(
        updatedFilledQuestions
      ).map((question) => {
        const { questionOrder } = question;
        const toReturn = {
          QuestionOrder: questionOrder,
          OptionOrder: 0,
          SubOptionOrder: 0,
        };
        if (isQuestionOne(questionOrder) || isDropdownQuestion(questionOrder)) {
          const { appointmentQuestionnaireOption } = question;
          appointmentQuestionnaireOption.forEach((op) => {
            const { isSeleted, optionOrder } = op;
            if (isSeleted) {
              toReturn.OptionOrder = optionOrder;
            }
          });
        }
        if (isQuestionTwo(questionOrder)) {
          const { appointmentQuestionnaireOption } = question;
          appointmentQuestionnaireOption.forEach((op) => {
            const {
              isSeleted,
              optionOrder,
              isSubOption,
              appointmentQuestionnaireSubOption,
            } = op;
            if (isSeleted) {
              toReturn.OptionOrder = optionOrder;
            }
            if (isSubOption && appointmentQuestionnaireSubOption?.length) {
              appointmentQuestionnaireSubOption.forEach((sop) => {
                const { isSeleted: isSeletedSubOp, subOptionOrder } = sop;
                if (isSeletedSubOp) {
                  toReturn.SubOptionOrder = subOptionOrder;
                  updatedViewSuboptionsListFor = optionOrder;
                }
              });
            }
          });
        }
        if (isTextQuestion(questionOrder)) {
          const { quesionnaireTextResponse } = question;
          delete toReturn.SubOptionOrder;
          delete toReturn.OptionOrder;
          toReturn.QuestionnaireTextResponse = quesionnaireTextResponse;
        }
        return toReturn;
      });

      if (updatedInitialAnswers?.length) {
        setAnswers(updatedInitialAnswers);
      }
      setQuestionsList(updatedFilledQuestions);
      setViewSuboptionsListFor(updatedViewSuboptionsListFor);
    }
  }, [filledQuestions]);

  //To get cached questionnaire that was filed before signing in;
  useEffect(() => {
    let filledQuestionnaireData = sessionStorage.getItem(
      constants.localStorageKeys.filledQuestionnaireData
    );
    if (filledQuestionnaireData) {
      filledQuestionnaireData = JSON.parse(filledQuestionnaireData);
      const { QuestionResponse } = filledQuestionnaireData;
      const questionTwoResponse = QuestionResponse?.find(({ QuestionOrder }) =>
        isQuestionTwo(QuestionOrder)
      );
      setAnswers(orderBy(QuestionResponse, "QuestionOrder", "asc"));
      if (questionTwoResponse?.OptionOrder) {
        setViewSuboptionsListFor(questionTwoResponse.OptionOrder);
      }
    }
    sessionStorage.removeItem(
      constants.localStorageKeys.filledQuestionnaireData
    );
  }, []);

  const handleSuboptionsListView = (optionOrder) => {
    if (viewSuboptionsListFor === optionOrder) {
      setViewSuboptionsListFor(0);
    } else {
      setViewSuboptionsListFor(optionOrder);
    }
  };

  //**Common */
  const isTextQuestion = (questionOrder) => {
    return [4, 5, 6].includes(questionOrder);
  };
  const isDropdownQuestion = (questionOrder) => {
    return questionOrder === 3;
  };
  const isQuestionOne = (questionOrder) => {
    return questionOrder === 1;
  };
  const isQuestionTwo = (questionOrder) => {
    return questionOrder === 2;
  };

  //** For questions that require text answers  */
  const getTextQuestionAnswer = (questionOrder) => {
    return answers[questionOrder - 1].QuestionnaireTextResponse;
  };

  const handleTextQuestionAnswer = (questionOrder, e) => {
    const value = e.target.value;
    setAnswers(
      produce((draft) => {
        draft[questionOrder - 1].QuestionnaireTextResponse = value;
        if (!value.trim().length) {
          draft[questionOrder - 1].error = t("questionnaire.errorMessage");
        } else {
          draft[questionOrder - 1].error = "";
        }
      })
    );
  };

  //** For Dropdown Select Question */
  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const handleDropdownOptionSelect = (questionOrder, optionOrder) => {
    setAnswers(
      produce((draft) => {
        draft[questionOrder - 1].OptionOrder = optionOrder;
        draft[questionOrder - 1].error = "";
      })
    );
    handleShowDropdown();
  };

  //** For options selection */
  const handleOptionSelect = (questionOrder, optionOrder) => {
    setAnswers(
      produce((draft) => {
        draft[questionOrder - 1].OptionOrder = optionOrder;
        draft[questionOrder - 1].SubOptionOrder = 0;
        draft[questionOrder - 1].suboptionError = "";
        draft[questionOrder - 1].error = "";
      })
    );

    if (isQuestionTwo(questionOrder)) {
      setViewSuboptionsListFor(optionOrder);
    }
  };

  const getSelectedOption = (questionOrder) => {
    return answers[questionOrder - 1].OptionOrder;
  };

  const getQuestionError = (questionOrder) => {
    return answers[questionOrder - 1].error;
  };

  //**For suboption selections */
  const handleSuboptionSelect = (
    questionOrder,
    optionOrder,
    suboptionOrder
  ) => {
    setAnswers(
      produce((draft) => {
        draft[questionOrder - 1].OptionOrder = optionOrder;
        draft[questionOrder - 1].SubOptionOrder = suboptionOrder;
        draft[questionOrder - 1].suboptionError = "";
        draft[questionOrder - 1].error = "";
      })
    );
  };

  const getSelectedSuboption = (questionOrder) => {
    return answers[questionOrder - 1].SubOptionOrder;
  };

  const getQuestionSuboptionError = (questionOrder) => {
    return answers[questionOrder - 1].suboptionError;
  };

  //**Handle submit */
  const isValidForm = () => {
    let isValid = true;
    setAnswers(
      produce((draftAnswers) => {
        draftAnswers.forEach((answer, idx) => {
          const { QuestionOrder: questionOrder } = answer;

          if (isTextQuestion(questionOrder)) {
            const { QuestionnaireTextResponse } = answer;
            if (!QuestionnaireTextResponse.trim().length) {
              draftAnswers[idx].error = t("questionnaire.errorMessage");
              isValid = false;
            } else {
              draftAnswers[idx].error = "";
            }
          }

          if (isDropdownQuestion(questionOrder)) {
            const { OptionOrder } = answer;
            if (OptionOrder === 0) {
              draftAnswers[idx].error = t("questionnaire.errorMessage");
              isValid = false;
            } else {
              draftAnswers[idx].error = "";
            }
          }

          if (isQuestionOne(questionOrder)) {
            const { OptionOrder } = answer;
            if (OptionOrder === 0) {
              draftAnswers[idx].error = t("questionnaire.errorMessage");
              isValid = false;
            } else {
              draftAnswers[idx].error = "";
            }
          }

          if (isQuestionTwo(questionOrder)) {
            const { OptionOrder, SubOptionOrder } = answer;
            if (OptionOrder === 0) {
              draftAnswers[idx].error = t("questionnaire.errorMessage");
              isValid = false;
            } else {
              if (selectedOptionsHasSuboptions(questionOrder, OptionOrder)) {
                if (SubOptionOrder === 0) {
                  draftAnswers[idx].suboptionError = t(
                    "questionnaire.errorMessage"
                  );
                  isValid = false;
                } else {
                  draftAnswers[idx].error = "";
                  draftAnswers[idx].suboptionError = "";
                }
              } else {
                draftAnswers[idx].error = "";
                draftAnswers[idx].suboptionError = "";
              }
            }
          }
        });
      })
    );

    return isValid;
  };

  const handleSubmit = async () => {
    if (isValidForm()) {
      const questionResponse = answers.map(
        ({ error, suboptionError, ...rest }) => rest
      );
      const body = {
        OfficeId: officeId,
        DoctorId: doctorId,
        QuestionResponse: questionResponse,
      };
      if (profile) {
        const patientId = profile.id;
        body.PatientId = patientId;
        try {
          const response = await fillQuestionnaireMutation.mutateAsync(body);
          response.officeId = +officeId;
          response.doctorId = +doctorId;
          sessionStorage.setItem(
            constants.localStorageKeys.questionnaireResponse,
            JSON.stringify(response)
          );
          toast.success(t("questionnaire.successMessage"));
          handleGoBack();
        } catch (error) {
          toast.error(error.message);
        }
      } else {
        sessionStorage.clear();
        localStorage.clear();
        sessionStorage.setItem(
          constants.localStorageKeys.filledQuestionnaireData,
          JSON.stringify(body)
        );
        signIn?.();
      }
    } else {
      scrollToError();
    }
  };

  function selectedOptionsHasSuboptions(questionOrder, optionOrder) {
    if (questionsList.length) {
      const question = questionsList?.find(
        (q) => q.questionOrder === questionOrder
      );
      if (question) {
        const { appointmentQuestionnaireOption } = question;
        const option = appointmentQuestionnaireOption?.find(
          (op) => op.optionOrder === optionOrder
        );
        const { isSubOption, appointmentQuestionnaireSubOption = [] } =
          option || {};
        return isSubOption && appointmentQuestionnaireSubOption?.length > 0;
      }
    }
    return false;
  }

  return {
    state: {
      questionsList: orderbyQuestionOrder(questionsList),
      showDropdown,
      isLoading:
        isQuestionnaireLoading ||
        fillingQuestionnaire ||
        filledQuestionnaireLoading,
      viewSuboptionsListFor,
      answers,
    },
    updateMethods: {
      setShowDropdown,
    },
    otherMethods: {
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
    },
  };
};

export default useQuestionnaireState;
