import { useEffect, useState } from "react";
import produce from "immer";
import moment from "moment";
import { cloneDeep, orderBy, uniqBy } from "lodash";
import constants from "../../../../constants";
import { useRequestAppointmentMutation } from "../../../../repositories/appointment-repository";
import toast from "react-hot-toast";
import useQueryParam from "hooks/useQueryParam";

export default function useRequestAppointmentState(dependencies) {
  const { t, doctorId, officeId, profile, signIn, setIsAppointmentBooked } =
    dependencies;
  const memberId = useQueryParam("memberId", null);

  let initialState = {
    isLoading: false,
    errors: {},
    startDate: new Date(),
    endDate: new Date(),
    sameTimeForAllDays: true,
    startTime: null,
    endTime: null,
    days: [],
    comment: "",
    confirmModal: false,
    oldDaysData: [],
  };

  const cachedState = sessionStorage.getItem(
    constants.localStorageKeys.waitingListFormData
  );
  if (cachedState) {
    const waitingListFormData = JSON.parse(cachedState);
    initialState = cloneDeep(waitingListFormData);
    initialState.startDate = new Date(waitingListFormData.startDate);
    initialState.endDate = new Date(waitingListFormData.endDate);
    if (waitingListFormData.sameTimeForAllDays) {
      initialState.startTime = moment(waitingListFormData.startTime);
      initialState.endTime = moment(waitingListFormData.endTime);
    } else {
      initialState.days = waitingListFormData.days.map((day) => {
        const { startDateTime, endDateTime, ...rest } = day;
        if (rest.isSelected) {
          return {
            ...rest,
            startDateTime: moment(startDateTime),
            endDateTime: moment(endDateTime),
          };
        } else {
          return day;
        }
      });
    }
  }

  const [state, setState] = useState(initialState);
  const requestAppointmentMutation = useRequestAppointmentMutation();
  const { isLoading: requestingMutation } = requestAppointmentMutation;

  function generateDays(startDate, endDate) {
    const dates = [];

    const currDate = moment(
      moment(startDate).format("YYYY-MM-DD"),
      "YYYY-MM-DD"
    ).subtract(1, "days");
    const endDateClone = moment(
      moment(endDate).format("YYYY-MM-DD"),
      "YYYY-MM-DD"
    );

    while (currDate.add(1, "days").diff(endDateClone) <= 0) {
      dates.push({
        daySymbol: currDate.clone().format("dd").charAt(0),
        day: currDate.clone().weekday(),
        startDateTime: null,
        endDateTime: null,
        isSelected: false,
        endTimeError: null,
        startTimeError: null,
        date: currDate.toISOString(),
      });
      if (dates.length > 6) break; //Once we get the 7 days we need to break out of the loop.
    }

    return dates.length < 7 ? dates : orderBy(uniqBy(dates, "day"), "day");
  }
  useEffect(() => {
    //!cachedState condition is used to avoid avoid overwriting of days data on initial render if session storage contains data
    if (!cachedState) {
      const days = generateDays(state.startDate, state.endDate);
      let items = [...state.days, ...state.oldDaysData, ...days];
      items = orderBy(uniqBy(items, "date"), "day");

      if (items && items.length > 0) {
        items.forEach((day) => {
          const index = days.findIndex((val) => val.date === day.date);
          if (index !== -1) {
            days[index].startDateTime = day.startDateTime;
            days[index].endDateTime = day.endDateTime;
            days[index].isSelected = day.isSelected;
          }
        });
      }

      setState(
        produce((draft) => {
          draft.days = days;
          draft.oldDaysData = items;
        })
      );
    }
  }, [state.startDate, state.endDate]);

  useEffect(() => {
    //After initial render remove session storage data;
    sessionStorage.removeItem(constants.localStorageKeys.waitingListFormData);
  }, []);

  const handleRadioChange = (value) => {
    setState(
      produce((draft) => {
        draft.sameTimeForAllDays = value;
      })
    );
  };

  const handleStartDateChange = (startDate) => {
    setState(
      produce((draft) => {
        draft.startDate = startDate;
        delete draft.errors.startDate;
        if (!startDate) {
          draft.errors.startDate = t("form.errors.emptySelection", {
            field: t("form.fields.date"),
          });
        }
        if (!draft.endDate || moment(draft.endDate).isBefore(startDate)) {
          draft.endDate = startDate;
          delete draft.errors.endDate;
        }
      })
    );
  };

  const handleEndDateChange = (endDate) => {
    setState(
      produce((draft) => {
        draft.endDate = endDate;
        delete draft.errors.endDate;
        if (!endDate) {
          draft.errors.endDate = t("form.errors.emptySelection", {
            field: t("form.fields.date"),
          });
        }
      })
    );
  };

  const handleStartTimeChange = (startTime) => {
    setState(
      produce((draft) => {
        draft.startTime = startTime;
        delete draft.errors.startTime;
        if (startTime) {
          if (
            !draft.endTime ||
            moment(draft.endTime).isSame(startTime) ||
            moment(draft.endTime).isBefore(startTime)
          ) {
            draft.endTime = moment(startTime).add(15, "minutes");
            delete draft.errors.endTime;
          }
        } else {
          draft.errors.startTime = t("form.errors.emptySelection", {
            field: t("staff.startTime"),
          });
        }
      })
    );
  };

  const handleEndTimeChange = (endTime) => {
    setState(
      produce((draft) => {
        draft.endTime = endTime;
        delete draft.errors.endTime;
        if (endTime) {
          if (draft.startTime) {
            const duration = moment
              .duration(moment(endTime).diff(moment(draft.startTime)))
              .asMinutes();
            if (duration > 14) {
              delete draft.errors.endTime;
            } else {
              draft.errors.endTime = t(
                "form.errors.appointmentEndTimeShouldBeGreater"
              );
            }
          }
        } else {
          draft.errors.endTime = t("form.errors.emptySelection", {
            field: t("staff.endTime"),
          });
        }
      })
    );
  };

  const disabledHours = () => {
    if (!state.startTime) return [];
    return Array.from(Array(moment(state.startTime).hours()).keys());
  };

  const disabledMinutes = (hour) => {
    if (!state.startTime) return [];
    if (moment(state.startTime).hours() === hour)
      return Array.from(Array(moment(state.startTime).minutes() + 1).keys());
    return [];
  };

  const handleDayClick = (index) => {
    setState(
      produce((draft) => {
        if (draft.days[index].isSelected) {
          draft.days[index].isSelected = false;
        } else {
          draft.days[index].isSelected = true;
        }
        delete draft.errors.days;
        delete draft.days[index].startTimeError;
        delete draft.days[index].endTimeError;
      })
    );
  };

  const handleDayStartTimeChange = (startTime, index) => {
    setState(
      produce((draft) => {
        draft.days[index].startDateTime = startTime;
        delete draft.days[index].startTimeError;
        if (startTime) {
          if (
            !draft.days[index].endDateTime ||
            moment(draft.days[index].endDateTime).isSame(startTime) ||
            moment(draft.days[index].endDateTime).isBefore(startTime)
          ) {
            draft.days[index].endDateTime = moment(startTime).add(
              15,
              "minutes"
            );
            delete draft.days[index].endTimeError;
          }
        } else {
          draft.days[index].startTimeError = t("form.errors.emptySelection", {
            field: t("staff.startTime"),
          });
        }
      })
    );
  };

  const handleDayEndTimeChange = (endTime, index) => {
    setState(
      produce((draft) => {
        draft.days[index].endDateTime = endTime;
        delete draft.days[index].endTimeError;
        if (endTime) {
          if (draft.days[index].startDateTime) {
            const duration = moment
              .duration(
                moment(endTime).diff(moment(draft.days[index].startDateTime))
              )
              .asMinutes();
            if (duration > 14) {
              delete draft.days[index].endTimeError;
            } else {
              draft.days[index].endTimeError = t(
                "form.errors.appointmentEndTimeShouldBeGreater"
              );
            }
          }
        } else {
          draft.days[index].endTimeError = t("form.errors.emptySelection", {
            field: t("staff.endTime"),
          });
        }
      })
    );
  };

  const disabledDayHours = (index) => {
    if (!state.days[index].startDateTime) return [];
    return Array.from(
      Array(moment(state.days[index].startDateTime).hours()).keys()
    );
  };

  const disabledDayMinutes = (index, hour) => {
    if (!state.days[index].startDateTime) return [];
    if (moment(state.days[index].startDateTime).hours() === hour)
      return Array.from(
        Array(moment(state.days[index].startDateTime).minutes() + 1).keys()
      );
    return [];
  };

  const handleCommentTextChange = (e) => {
    const value = e.target.value;
    setState(
      produce((draft) => {
        draft.comment = value;
        if (!value.trim().length) {
          draft.errors.comment = t("form.errors.emptyField", {
            field: t("superAdmin.comment"),
          });
        } else {
          delete draft.errors.comment;
        }
      })
    );
  };

  const isValidForm = () => {
    const errors = {};
    const days = cloneDeep(state.days);

    if (!state.comment || !state.comment.trim().length) {
      errors.comment = t("form.errors.emptyField", {
        field: t("superAdmin.comment"),
      });
    }

    if (!state.startDate) {
      errors.startDate = t("form.errors.emptySelection", {
        field: t("form.fields.date"),
      });
    }

    if (!state.endDate) {
      errors.endDate = t("form.errors.emptySelection", {
        field: t("form.fields.date"),
      });
    }

    if (state.sameTimeForAllDays) {
      //When same time for all days
      if (!state.startTime) {
        errors.startTime = t("form.errors.emptySelection", {
          field: t("staff.startTime"),
        });
      }
      if (!state.endTime) {
        errors.endTime = t("form.errors.emptySelection", {
          field: t("staff.endTime"),
        });
      }
      if (state.startTime && state.endTime) {
        //startTime and endTime gap
        const duration = moment
          .duration(moment(state.endTime).diff(moment(state.startTime)))
          .asMinutes();
        if (duration > 14) {
          delete errors.endTime;
        } else {
          errors.endTime = t("form.errors.appointmentEndTimeShouldBeGreater");
        }
      }
    } else {
      //When diffrent time for diffrent days
      if (state.days.some((day) => day.isSelected)) {
        //if at least one day is selected;
        state.days.forEach((day, index) => {
          const { startDateTime, endDateTime, isSelected } = day;
          if (isSelected) {
            if (!startDateTime) {
              days[index].startTimeError = t("form.errors.emptySelection", {
                field: t("staff.startTime"),
              });
            }
            if (!endDateTime) {
              days[index].endTimeError = t("form.errors.emptySelection", {
                field: t("staff.endTime"),
              });
            }
          }
        });
      } else {
        //When no day is selected
        errors.days = t("form.errors.noDaySelected");
      }
    }

    let isInvalid = false;
    if (state.sameTimeForAllDays) {
      isInvalid = !!Object.keys(errors).length;
    } else {
      isInvalid =
        !!Object.keys(errors).length ||
        days.some((day) => !!day.startTimeError || !!day.endTimeError);
    }

    setState(
      produce((draft) => {
        draft.errors = errors;
        draft.days = days;
      })
    );

    return !isInvalid;
  };

  const toggleConfirmModal = (familyMemberId) => {
    setState(
      produce((draft) => {
        if (draft.confirmModal) {
          draft.confirmModal = false;
        } else {
          draft.confirmModal = true;
        }

        if (familyMemberId) draft.memberId = familyMemberId;
      })
    );
  };

  const handleSubmit = () => {
    if (isValidForm()) {
      if (!profile) {
        const waitingListFormData = cloneDeep(state);
        waitingListFormData.doctorId = doctorId;
        waitingListFormData.officeId = officeId;
        sessionStorage.setItem(
          constants.localStorageKeys.waitingListFormData,
          JSON.stringify(waitingListFormData)
        );
        signIn();
      } else {
        toggleConfirmModal();
      }
    }
  };

  const handleConfirm = async () => {
    toggleConfirmModal();
    const body = {
      startDate: moment(state.startDate).format("YYYY-MM-DD"),
      endDate: moment(state.endDate).format("YYYY-MM-DD"),
      officeId,
      doctorId,
      description: state.comment,
      IssameTime: state.sameTimeForAllDays,
      appointmentRequestTime: state.sameTimeForAllDays
        ? [
            {
              day: null,
              startDateTime: state.startTime.format("hh:mm A"),
              endDateTime: state.endTime.format("hh:mm A"),
            },
          ]
        : state.days
            .filter((day) => day.isSelected)
            .map((it) => {
              const { day, startDateTime, endDateTime } = it;
              return {
                day,
                startDateTime: startDateTime.format("hh:mm A"),
                endDateTime: endDateTime.format("hh:mm A"),
              };
            }),
    };

    if (state.memberId !== profile.id)
      body.patientFamilyMemberId = parseInt(state.memberId);

    if (memberId !== profile.id)
      body.patientFamilyMemberId = parseInt(memberId);

    try {
      await requestAppointmentMutation.mutateAsync(body);
      setIsAppointmentBooked(true);
    } catch (error) {
      toast.error(error?.message);
    }
  };
  return {
    state,
    handleRadioChange,
    handleStartDateChange,
    handleEndDateChange,
    disabledHours,
    handleStartTimeChange,
    handleEndTimeChange,
    disabledMinutes,
    handleDayClick,
    handleDayStartTimeChange,
    disabledDayHours,
    disabledDayMinutes,
    handleDayEndTimeChange,
    handleCommentTextChange,
    handleSubmit,
    requestingMutation,
    toggleConfirmModal,
    handleConfirm,
  };
}
