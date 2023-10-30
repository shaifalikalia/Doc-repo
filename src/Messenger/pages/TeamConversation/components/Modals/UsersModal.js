import React, { Fragment } from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import "./ChatModal.scss";
import { addDefaultStaffRounded } from "utils";

function UsersModal(props) {
  const { users = [], isOpen, onClose } = props;

  return (
    <Fragment>
      <Modal
        isOpen={isOpen}
        toggle={onClose}
        className="modal-dialog-centered modal-width-660 new-grop-modal"
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={onClose}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        <ModalBody>
          <ul className={"modal-employee-list group-list mb-0"}>
            {users.map((staff, index) => {
              return (
                <li key={index}>
                  <div className="ch-checkbox no-checkbox">
                    <label>
                      <span>
                        <img
                          src={staff.profilePic}
                          alt="profile-pic"
                          onError={addDefaultStaffRounded}
                        />
                        <div>
                          {" "}
                          {staff.name} <small>{staff.officeName}</small>
                        </div>
                      </span>
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </ModalBody>
      </Modal>
    </Fragment>
  );
}

export default withTranslation()(UsersModal);
