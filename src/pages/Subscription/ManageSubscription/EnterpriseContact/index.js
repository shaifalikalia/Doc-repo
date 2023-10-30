import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { connect } from "react-redux";

const EnterpriseContactModal = (props) => {
  const email =
    (props.companyInformation && props.companyInformation.email) || "";
  const phone =
    (props.companyInformation && props.companyInformation.phone) || "";

  return (
    <Modal
      isOpen={props.show}
      className="modal-dialog-centered modal-lg contact-sub-modal"
      modalClassName="custom-modal"
      toggle={props.closeModal}
    >
      <span className="close-btn" onClick={props.closeModal}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <div className="contact-block">
          <h2 className="title">Contact Us</h2>
          <p>
            Please contact the Miraxis team about subscription and pricing info.
          </p>

          <div className="contact-dtl">
            <div className="row">
              <div className="col-md">
                <div className="media">
                  <img
                    src={require("assets/images/contact-email.svg").default}
                    alt="img"
                  />
                  <div className="media-body">
                    <h4>Email Address</h4>
                    <p>{email}</p>
                  </div>
                </div>
              </div>
              <div className="col-md">
                <div className="media">
                  <img
                    src={require("assets/images/contact-phone.svg").default}
                    alt="img"
                  />
                  <div className="media-body">
                    <h4>Phone Number</h4>
                    <p>{phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = ({ pageContent: { companyInformation } }) => {
  return { companyInformation };
};

export default connect(mapStateToProps)(EnterpriseContactModal);
