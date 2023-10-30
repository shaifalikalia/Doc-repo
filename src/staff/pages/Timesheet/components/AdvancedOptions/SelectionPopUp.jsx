import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import Input from "components/Input";
import styles from "./AdvancedOptions.module.scss";
import styles2 from "../../Timesheet.module.scss";

import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "./../../../../../assets/images/cross.svg";
import addIcon from "./../../../../../assets/images/circular-add.svg";
import tickIcon from "./../../../../../assets/images/icon_tick.svg";
import Text from "components/Text";
import "../../timesheet-calendar.scss";
import {
  getWorkTypeList,
  getTaskList,
  useCustomWorkTypeMutation,
  useCustomTaskMutation,
} from "repositories/timesheet-repository";
import toast from "react-hot-toast";

function SelectionPopUp({
  t,
  issaveDraftModalOpen,
  setIsSaveDraftModalOpen,
  OfficeId,
  type,
  saveSelection,
}) {
  const PageSize = 100;
  const PageNumber = 1;
  const [loader, setLoader] = useState(true);
  const [listData, setListData] = useState([]);
  const [customTitle, setcustomTitle] = useState("");
  const [titleError, settitleError] = useState("");
  const [selectorError, setselectorError] = useState("");
  const customWorkTypeMutation = useCustomWorkTypeMutation();
  const customTaskMutation = useCustomTaskMutation();
  const [showCustom, setShowCustom] = useState(false);

  const [selectedType, setSelectedType] = useState({});
  useEffect(() => {
    fetchListData();
    // eslint-disable-next-line
  }, [type]);

  const fetchListData = async () => {
    setLoader(true);
    try {
      let resp = null;
      if (type === 2) {
        resp = await getTaskList(OfficeId, PageSize, PageNumber);
      } else {
        resp = await getWorkTypeList(OfficeId, PageSize, PageNumber);
      }
      if (resp) {
        setListData(resp);
      }
      setLoader(false);
    } catch (e) {
      console.log(e.message);
      setLoader(false);
    }
  };

  const saveCustomWork = async () => {
    let resp = null;
    if (!customTitle || customTitle.trim().length < 1) {
      settitleError(t("form.errors.notEmpty"));
      return;
    }
    setLoader(true);
    if (type === 2) {
      try {
        resp = await customTaskMutation.mutateAsync({
          OfficeId,
          title: customTitle,
        });
      } catch (e) {
        toast.error(e.message);
      }
    } else {
      try {
        resp = await customWorkTypeMutation.mutateAsync({
          OfficeId,
          title: customTitle,
        });
      } catch (e) {
        toast.error(e.message);
      }
    }
    if (resp) {
      fetchListData();
    }
    setLoader(false);
    setcustomTitle("");
    settitleError("");
    setShowCustom(false);
  };
  const checkAndSetCustom = (val) => {
    if (val && val.length && val.trim().length < 400) {
      setcustomTitle(val);
    } else {
      setcustomTitle(val.substring(0, 400));
    }
  };
  const selectFromList = () => {
    if (selectedType && selectedType.id) {
      saveSelection(selectedType);
      setselectorError("");
    } else {
      setselectorError(
        t("form.errors.emptySelection", {
          field: type === 2 ? t("staff.typeOfTask") : t("staff.typeOfWork"),
        })
      );
    }
  };
  return (
    <>
      <Modal
        isOpen={issaveDraftModalOpen}
        toggle={() => setIsSaveDraftModalOpen(false)}
        className="modal-dialog-centered work-task-modal-dialog"
        modalClassName="custom-modal"
      >
        <span
          className="close-btn"
          onClick={() => setIsSaveDraftModalOpen(false)}
        >
          <img src={crossIcon} alt="close" />
        </span>
        {loader && <div className={`${styles2["loader-position"]} loader`} />}
        <ModalBody className={["work-task-modal"]}>
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {" "}
              {type === 2 ? t("staff.selectTask") : t("staff.selectWork")}
            </span>{" "}
          </Text>

          {showCustom ? (
            <div className={["custom-box"]}>
              <Input
                Type="text"
                Title={
                  type === 2 ? t("staff.selectTask") : t("staff.selectWork")
                }
                Value={customTitle}
                HandleChange={(e) => checkAndSetCustom(e.currentTarget.value)}
                Error={titleError}
              />
              <span className={"link-btn add-btn"} onClick={saveCustomWork}>
                {" "}
                <img src={tickIcon} className="mr-1" alt="tick-icon" /> Add
              </span>
            </div>
          ) : (
            <div
              className={styles["menu-item"]}
              onClick={() => setShowCustom(true)}
            >
              <span className="link-btn">
                <img src={addIcon} className="mr-1" alt="add-icon" />{" "}
                {type === 2
                  ? t("staff.addCustomTask")
                  : t("staff.addCustomWork")}
              </span>
            </div>
          )}
          <ul className={["work-list"]}>
            {listData.length > 0 &&
              listData.map((item, index) => (
                <li key={index}>
                  <div className="ch-radio">
                    <label onClick={() => setSelectedType(item)}>
                      <input
                        type="radio"
                        name="selectWork"
                        value={item.id}
                        checked={
                          selectedType &&
                          selectedType.id &&
                          selectedType.id === item.id
                        }
                      />
                      <span>{item.title}</span>
                    </label>
                  </div>
                </li>
              ))}
          </ul>
          {selectorError && <span className="error-msg">{selectorError}</span>}
          <button
            className="button button-round button-shadow mr-md-4 mb-3 w-sm-100"
            title={t("staff.select")}
            onClick={() => selectFromList()}
          >
            {t("staff.select")}
          </button>
          <button
            className="button button-round button-border button-dark btn-mobile-link"
            title={t("cancel")}
            onClick={() => {
              setSelectedType({});
              setIsSaveDraftModalOpen(false);
            }}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(SelectionPopUp);
