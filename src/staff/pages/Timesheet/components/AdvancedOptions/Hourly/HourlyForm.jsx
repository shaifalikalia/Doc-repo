import React, { useState, useEffect } from "react";
import moment from "moment";
import { withTranslation } from "react-i18next";
import { Col, FormGroup, Label, Row } from "reactstrap";
import deleteIcon from "./../../../../../../assets/images/delete-red.svg";
import styles from "./../AdvancedOptions.module.scss";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import Card from "components/Card";
import Text from "components/Text";
import SelectionPopUp from "../SelectionPopUp";
import { toast } from "react-toastify";
import DeleteSectionModal from "./DeleteSectionModal";
function TimesheetHourlyForm({ t, officeId, handleChange, previousTSData }) {
  const [selectedKey, setSelectedKey] = useState(false);
  const [listType, setListType] = useState(1); // 1 - Work , 2 - Task
  const [issaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);
  const [expandArray, setExpandArray] = useState([0]);
  const [descriptionArray, setDescriptionArray] = useState([]);
  const [deleteSectionModal, setDeleteSectionModal] = useState(false);
  const [selectedVal, setSelectedVal] = useState(null);

  const [taskSection, setTaskSection] = useState([
    {
      id: 0,
      workType: null,
      taskType: null,
      discription: "",
      startTime: null,
      endTime: null,
    },
  ]);

  const addNewTaskSection = () => {
    let temp = [...expandArray];
    if (taskSection.length < 12) {
      let newSection = [...taskSection];
      newSection.push({
        id: 0,
        workType: null,
        taskType: null,
        discription: "",
        startTime: null,
        endTime: null,
      });
      temp.push(taskSection.length);
      setTaskSection(newSection);
      setExpandArray(temp);
    }
  };

  const onDescrptionClick = (id) => {
    let temp = [...descriptionArray];
    const index = temp.indexOf(id);
    if (index > -1) {
      temp.splice(index, 1);
    } else {
      temp.push(id);
    }
    setDescriptionArray(temp);
  };
  if (
    previousTSData &&
    previousTSData[0] &&
    previousTSData[0].advanceTimesheetType == 2 &&
    taskSection[0].workType === null &&
    taskSection[0].taskType === null &&
    taskSection[0].discription == ""
  ) {
    let newSection = [];
    let temp = [...expandArray];
    previousTSData.forEach((v, i) => {
      temp.push(i);
      newSection.push({
        id: v.id,
        taskOrder: v.taskOrder ? v.taskOrder : i + 1,
        workType: v.timesheetWorkTypeResponse,
        taskType: v.timesheetCustomTaskResponse,
        discription: v.discription,
        startTime: v.startTime
          ? moment(v.startTime, [moment.ISO_8601, "hh:mm A"])
          : null,
        endTime: v.endTime
          ? moment(v.endTime, [moment.ISO_8601, "hh:mm A"])
          : null,
      });
    });
    setExpandArray(temp);
    setDescriptionArray(temp);
    setTaskSection(newSection);
  }

  useEffect(() => {
    let data = [];
    taskSection.forEach((v, i) => {
      if (v.startTime || v.endTime) {
        data.push({
          id: v.id,
          taskOrder: i + 1,
          TimesheetWorkTypeId:
            v.workType && v.workType.id ? v.workType.id : null,
          IsCustomTask:
            v.taskType && v.taskType.isCustomTask
              ? v.taskType.isCustomTask
              : false,
          TaskId: v.taskType && v.taskType.id ? v.taskType.id : null,
          discription: v.discription,
          startTime: v.startTime
            ? v.startTime.format("YYYY-MM-DDTHH:mm")
            : null,
          endTime: v.endTime ? v.endTime.format("YYYY-MM-DDTHH:mm") : null,
        });
      }
    });
    handleChange(data);
    // eslint-disable-next-line
  }, [taskSection]);
  const validTime = (index, val, key, newSection) => {
    let isValid = true;
    const startDateTime =
      newSection[index]["startTime"] !== null
        ? newSection[index]["startTime"].format("YYYY-MM-DDTHH:mm")
        : null;
    const endDateTime =
      newSection[index]["endTime"] !== null
        ? newSection[index]["endTime"].format("YYYY-MM-DDTHH:mm")
        : null;
    let timeSpentInMinutes = 0;
    if (startDateTime !== null && endDateTime !== null) {
      const duration = moment.duration(
        newSection[index]["endTime"].diff(newSection[index]["startTime"])
      );
      timeSpentInMinutes = parseInt(duration.asMinutes());
      if (timeSpentInMinutes <= 0) {
        toast.error(t("staff.timesheetStartTimeShouldBeLessThanFinishTime"));
        isValid = false;
      }
    }
    return isValid;
  };
  const handleValueChange = (index, key, val, isTime = false) => {
    let newSection = [...taskSection];
    if (key === "discription" && val && val.length && val.length > 400) {
      val = val.substring(0, 400);
    }

    newSection[index][key] = val;
    if (key === "startTime") {
      newSection[index]["startTime"] = val;
      newSection[index]["endTime"] = null;
    }
    if (isTime && !validTime(index, val, key, newSection)) {
      newSection[index][key] = null;
      return;
    }
    setTaskSection(newSection);
  };

  const saveSelection = (data) => {
    let newSection = [...taskSection];
    if (listType === 2) {
      newSection[selectedKey]["taskType"] = data;
    } else {
      newSection[selectedKey]["workType"] = data;
    }
    setIsSaveDraftModalOpen(false);
    setTaskSection(newSection);
  };

  const taskClick = (id) => {
    let temp = [...expandArray];
    const index = temp.indexOf(id);
    if (index > -1) {
      temp.splice(index, 1);
    } else {
      temp.push(id);
    }
    setExpandArray(temp);
  };

  const removeField = () => {
    if (selectedVal !== null) {
      let temp1 = [...expandArray];
      let temp2 = [...descriptionArray];
      let newArr = [...taskSection];
      newArr.splice(selectedVal, 1);
      temp1.splice(selectedVal, 1);
      temp2.splice(selectedVal, 1);
      setExpandArray(temp1);
      setDescriptionArray(temp2);
      setTaskSection(newArr);
      setSelectedVal(null);
    }
    setDeleteSectionModal(false);
  };
  return (
    <>
      <div className={styles["timesheet-hour-accordion"]}>
        {taskSection.map((item, index) => (
          <Card
            key={index}
            radius="6px"
            marginBottom="10px"
            className={styles["detail-card"]}
          >
            <div className={styles["task-accordion"]}>
              <Text color="#587e85" size="16px" weight="600">
                Task {index + 1}{" "}
              </Text>
              <div className="d-flex">
                {taskSection.length > 1 && !item.id && (
                  <div className="mr-2">
                    <img
                      src={deleteIcon}
                      alt="delete"
                      onClick={() => {
                        setDeleteSectionModal(true);
                        setSelectedVal(index);
                      }}
                    />
                  </div>
                )}
                <div
                  onClick={() => taskClick(index)}
                  className={` ${styles["arrow-icon"]} ${
                    expandArray.includes(index) ? styles.show : ""
                  }`}
                >
                  <img
                    src={require("assets/images/up-arrow-angle.svg").default}
                    alt="icon"
                  />
                </div>
              </div>
            </div>

            <div
              className={`${styles["work-task-common"]}  ${
                expandArray.includes(index) ? styles.showDiv : styles.hideDiv
              }`}
            >
              <Row>
                <Col sm="6">
                  <FormGroup>
                    <Label for="startTime">{t("staff.startTime")}</Label>
                    <div>
                      <TimePicker
                        showSecond={false}
                        placeholder="--"
                        format="h:mm A"
                        value={item.startTime}
                        onChange={(e) =>
                          handleValueChange(index, "startTime", e, true)
                        }
                        use12Hours
                        popupClassName={styles["time-picker-popup"]}
                        className={styles["time-picker"]}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup>
                    <Label for="startTime">{t("staff.finishTime")}</Label>
                    <div>
                      <TimePicker
                        showSecond={false}
                        placeholder="--"
                        format="h:mm A"
                        use12Hours
                        value={item.endTime}
                        onChange={(e) =>
                          handleValueChange(index, "endTime", e, true)
                        }
                        popupClassName={styles["time-picker-popup"]}
                        className={styles["time-picker"]}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <div className="c-field">
                <label>{t("staff.typeOfWork")}</label>
                <div
                  className={"c-form-control d-flex justify-content-between "}
                >
                  <span>
                    {item.workType && item.workType.title ? (
                      item.workType.title
                    ) : (
                      <span className={styles.placeholder}>
                        {" "}
                        No work type selected
                      </span>
                    )}
                  </span>
                  <span
                    className="link-btn"
                    onClick={() => {
                      setIsSaveDraftModalOpen(true);
                      setListType(1);
                      setSelectedKey(index);
                    }}
                  >
                    Select
                  </span>
                </div>
              </div>
              <div className="c-field">
                <label>{t("staff.taskAssigned")}</label>
                <div
                  className={"c-form-control d-flex justify-content-between  "}
                >
                  <span>
                    {item.taskType && item.taskType.title ? (
                      item.taskType.title
                    ) : (
                      <span className={styles.placeholder}>
                        No task selected
                      </span>
                    )}
                  </span>
                  <span
                    className="link-btn"
                    onClick={() => {
                      setIsSaveDraftModalOpen(true);
                      setListType(2);
                      setSelectedKey(index);
                    }}
                  >
                    Select
                  </span>
                </div>
              </div>
              {descriptionArray.includes(index) ? (
                <div className={styles["custom-box"]}>
                  <div className="c-field">
                    <label>{t("staff.addDescription")}</label>
                    <textarea
                      placeholder={t("form.placeholder1", {
                        field: t("staff.addDescription"),
                      })}
                      className={
                        "c-form-control " + styles["custom-textarea-control"]
                      }
                      name="discription"
                      maxLength="400"
                      onChange={(e) =>
                        handleValueChange(
                          index,
                          "discription",
                          e.currentTarget.value
                        )
                      }
                      value={item.discription}
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div className={styles["add-desc"]}>
                  <span
                    className="link-btn"
                    onClick={() => onDescrptionClick(index)}
                  >
                    <img
                      src={
                        require("assets/images/plus-icon-outline.svg").default
                      }
                      alt="icon"
                    />
                    {t("staff.addDescription")}
                  </span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      {issaveDraftModalOpen && (
        <SelectionPopUp
          issaveDraftModalOpen={issaveDraftModalOpen}
          setIsSaveDraftModalOpen={setIsSaveDraftModalOpen}
          OfficeId={officeId}
          type={listType}
          saveSelection={saveSelection}
        />
      )}
      {taskSection.length < 12 && (
        <div className={styles["add-task"]}>
          <span className="link-btn" onClick={() => addNewTaskSection()}>
            <img
              src={require("assets/images/plus-icon-outline.svg").default}
              alt="icon"
            />

            {t("staff.addTask")}
          </span>
        </div>
      )}

      {deleteSectionModal && (
        <DeleteSectionModal
          isModalOpen={deleteSectionModal}
          confirmDelete={() => removeField()}
          closeModal={() => {
            setDeleteSectionModal(false);
          }}
        />
      )}
    </>
  );
}

export default withTranslation()(TimesheetHourlyForm);
