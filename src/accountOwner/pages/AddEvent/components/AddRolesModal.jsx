import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import crossIcon from "../../../../assets/images/cross.svg";
import Text from "components/Text";
import styles from "../AddEvent.module.scss";
import "../AddEvent.scss";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

function AddRolesModal({
  t,
  issaveRolesModalOpen,
  setIsSaveRolesModalOpen,
  designationIds,
  setDesignationIds,
  userRoles,
  eventId,
}) {
  const [selectedDesignation, setSelectedDesignation] =
    useState(designationIds);

  const checkDesignation = (designation) => {
    let selectedDesignationIds = [...selectedDesignation];
    let dIndex = selectedDesignationIds.findIndex(
      (e) => e.designationsId === designation.id
    );
    if (dIndex > -1) {
      if (selectedDesignationIds?.[dIndex]?.isFromDetail === false) {
        selectedDesignationIds.splice(dIndex, 1);
      } else {
        selectedDesignationIds[dIndex].IsDeleted =
          !selectedDesignationIds?.[dIndex]?.IsDeleted;
      }
    } else {
      selectedDesignationIds.push({
        id: 0,
        schedulerEventId: eventId ? eventId : 0,
        designationsId: designation.id,
        IsDeleted: false,
        isFromDetail: false,
      });
    }
    setSelectedDesignation(selectedDesignationIds);
  };

  const checkMemberRoleAvaliable = (array, value) => {
    let checkedValue = array?.some(
      (e) => e?.designationsId === value?.id && e?.IsDeleted === false
    );
    return checkedValue;
  };

  return (
    <>
      <Modal
        isOpen={issaveRolesModalOpen}
        toggle={() => setIsSaveRolesModalOpen(false)}
        className={"modal-dialog-centered " + styles["add-roles-modal-dialog"]}
        modalClassName="custom-modal"
      >
        <span
          className="close-btn"
          onClick={() => setIsSaveRolesModalOpen(false)}
        >
          <img src={crossIcon} alt="close" />
        </span>
        <ModalBody>
          <Text size="25px" marginBottom="10px" weight="500" color="#111b45">
            <span className="modal-title-25">{t("accountOwner.addRoles")}</span>
          </Text>

          <Text
            size="12px"
            marginBottom="10px"
            weight="400"
            color="rgb(111, 119, 136)"
          >
            {selectedDesignation?.filter((e) => e.IsDeleted === false)?.length}{" "}
            {t("Selected")}
          </Text>
          <Accordion
            className={["add-role-accordion contract-detail-accordion"]}
            preExpanded={[0]}
          >
            {userRoles.length > 0 &&
              userRoles.map((item, index) => (
                <AccordionItem uuid={index} key={index}>
                  <AccordionItemHeading>
                    <AccordionItemButton>{item.name}</AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <ul className={styles["roles-list"]}>
                      {item.designations.map((val, key) => (
                        <li key={key}>
                          <div className="ch-checkbox">
                            <label>
                              <input
                                type="checkbox"
                                checked={checkMemberRoleAvaliable(
                                  selectedDesignation,
                                  val
                                )}
                                onChange={() => checkDesignation(val)}
                              />
                              <span> {val.name}</span>
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </AccordionItemPanel>
                </AccordionItem>
              ))}
          </Accordion>

          <button
            className="button button-round button-shadow mr-sm-3 mb-3 w-sm-100"
            title={t("accountOwner.addRoles")}
            onClick={() => {
              setDesignationIds(selectedDesignation);
              setIsSaveRolesModalOpen(false);
            }}
          >
            {t("accountOwner.addRoles")}
          </button>
          <button
            className="button btn-mobile-link button-round button-border button-dark "
            onClick={() => setIsSaveRolesModalOpen(false)}
            title={t("cancel")}
          >
            {t("cancel")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(AddRolesModal);
