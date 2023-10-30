import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import styles from "./../AdvancedOptions.module.scss";
import SelectionPopUp from "../SelectionPopUp";

function TimesheetAllDayForm({ t, officeId, handleChange, previousTSData }) {
  const [showAddDesc, setShowAddDesc] = useState(false);

  const [description, setDescription] = useState("");
  const [listType, setListType] = useState(1); // 1 - Work , 2 - Task
  const [workType, setWorkType] = useState(null);
  const [taskType, setTaskType] = useState(null);
  const [issaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);
  if (
    previousTSData &&
    previousTSData[0] &&
    previousTSData[0].advanceTimesheetType == 1 &&
    workType === null &&
    taskType === null
  ) {
    if (workType === null)
      setWorkType(previousTSData[0].timesheetWorkTypeResponse);
    if (taskType === null)
      setTaskType(previousTSData[0].timesheetCustomTaskResponse);
    if (description === "") {
      setDescription(previousTSData[0].discription);
      setShowAddDesc(true);
    }
  }
  useEffect(() => {
    const data = [
      {
        id:
          previousTSData && previousTSData[0] && previousTSData[0].id
            ? previousTSData[0].id
            : 0,
        TimesheetWorkTypeId: workType && workType.id ? workType.id : null,
        IsCustomTask:
          taskType && taskType.isCustomTask ? taskType.isCustomTask : false,
        TaskId: taskType && taskType.id ? taskType.id : null,
        discription: description,
        startTime: null,
        endTime: null,
      },
    ];
    handleChange(data);
    // eslint-disable-next-line
  }, [description, workType, taskType]);
  const saveSelection = (data) => {
    if (listType === 2) {
      setTaskType(data);
    } else {
      setWorkType(data);
    }
    setIsSaveDraftModalOpen(false);
  };
  const handleDescription = (val) => {
    if (val && val.length && val.length < 400) {
      setDescription(val);
    } else {
      setDescription(val.substring(0, 400));
    }
  };
  return (
    <div className={styles["work-task-common"]}>
      <div className="c-field">
        <label>{t("staff.typeOfWork")}</label>
        <div className={"c-form-control d-flex justify-content-between  "}>
          <span>
            {workType && workType.title ? (
              workType.title
            ) : (
              <span className={styles.placeholder}> No work type selected</span>
            )}
          </span>
          <span
            className="link-btn"
            onClick={() => {
              setIsSaveDraftModalOpen(true);
              setListType(1);
            }}
          >
            Select
          </span>
        </div>
      </div>
      <div className="c-field">
        <label>{t("staff.taskAssigned")}</label>
        <div className={"c-form-control d-flex justify-content-between  "}>
          <span>
            {taskType && taskType.title ? (
              taskType.title
            ) : (
              <span className={styles.placeholder}>No task selected</span>
            )}
          </span>

          <span
            className="link-btn"
            onClick={() => {
              setIsSaveDraftModalOpen(true);
              setListType(2);
            }}
          >
            Select
          </span>
        </div>
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
      {showAddDesc ? (
        <div className={styles["custom-box"]}>
          <div className="c-field">
            <label>{t("staff.addDescription")}</label>
            <textarea
              placeholder={t("form.placeholder1", {
                field: t("staff.addDescription"),
              })}
              className={"c-form-control " + styles["custom-textarea-control"]}
              name="addDescription"
              maxLength="400"
              onChange={(e) => {
                handleDescription(e.currentTarget.value);
              }}
              value={description}
            ></textarea>
          </div>
        </div>
      ) : (
        <div className={styles["add-desc"]}>
          <span className="link-btn" onClick={() => setShowAddDesc(true)}>
            <img
              src={require("assets/images/plus-icon-outline.svg").default}
              alt="icon"
            />
            {t("staff.addDescription")}
          </span>
        </div>
      )}
    </div>
  );
}

export default withTranslation()(TimesheetAllDayForm);
