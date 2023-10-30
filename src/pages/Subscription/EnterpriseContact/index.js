import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

const EnterpriseContactModal = (props) => {
  const email =
    (props.companyInformation && props.companyInformation.email) || "";
  const phone =
    (props.companyInformation && props.companyInformation.phone) || "";
  const { t } = props;

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
          <h2 className="title">{t("enterpriseSubscriptionContactTitle")}</h2>
          <p>{t("enterpriseSubscriptionContactText")}</p>

          <div className="contact-dtl">
            <div className="row">
              <div className="col-md">
                <div className="media">
                  <img
                    src={require("assets/images/contact-email.svg").default}
                    alt="img"
                  />
                  <div className="media-body">
                    <h4>{t("form.fields.emailAddress")}</h4>
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
                    <h4>{t("form.fields.phoneNumber")}</h4>
                    <p>{phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="button-block">
            <button
              class="button button-round button-border button-dark button-min-160"
              title={t("close")}
              onClick={props.closeModal}
            >
              {t("close")}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = ({ pageContent: { companyInformation } }) => {
  return { companyInformation };
};

export default connect(mapStateToProps)(
  withTranslation()(EnterpriseContactModal)
);
