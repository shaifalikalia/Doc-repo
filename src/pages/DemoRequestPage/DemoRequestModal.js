import React from "react";
import { withTranslation } from "react-i18next";
import "./DemoRequest.scss";
import crossIcon from "./../../assets/images/cross.svg";
import { Modal, ModalBody } from "reactstrap";
import ScheduleForm from "components/Home-contact/components/Schedule-form-model";
import { useHistory } from "react-router-dom";
import constants from "../../constants";

const DemoRequestModal = ({
  t,
  isDemoRequestModalOpen,
  setIsDemoRequestModalOpen,
}) => {
  const closeDemoRequestModal = () => setIsDemoRequestModalOpen(false);
  const history = useHistory();

  const handleCloseRedirection = () => {
    closeDemoRequestModal();
    history.push(constants.routes.demoRequestThank);
  };

  return (
    <Modal
      isOpen={isDemoRequestModalOpen}
      toggle={closeDemoRequestModal}
      className={
        "modal-dialog-centered  modal-width-660 rejection-modal demo-request-modal"
      }
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeDemoRequestModal}>
        <img src={crossIcon} alt="close" />
      </span>

      <ModalBody>
        <div className="schedule-form contact-section">
          <div className="schedule-block">
            <h2>Schedule a Demo</h2>
            <h4>Please complete the form and we'll get back to you.</h4>
            <ScheduleForm afterReqFunCallBack={handleCloseRedirection} />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(DemoRequestModal);
