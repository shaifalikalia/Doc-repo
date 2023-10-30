import React from "react";
import { withTranslation } from "react-i18next";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import "./../../ManageOrders.scss";
import crossIcon from "../../../../../assets/images/cross.svg";
import { isValueEmpty } from "utils";
import Text from "components/Text";

function TraceOrderDetail({ t, trackDetails, closeModel }) {
  return (
    <>
      <Modal
        isOpen={true}
        toggle={closeModel}
        className={"modal-dialog-centered tracking-modal"}
        modalClassName="custom-modal"
      >
        <span className="close-btn" onClick={closeModel}>
          <img src={crossIcon} alt="close" />
        </span>

        <div className="modal-custom-title">
          <Text size="25px" marginBottom="40px" weight="500" color="#111B45">
            <span className="modal-title-25">
              {t("vendorManagement.viewTrackingTitles")}
            </span>
          </Text>
        </div>
        <ModalBody className="text-left">
          <div className="whiteSpace">
            <Text size="14px" weight="600" color="#102C42">
              {isValueEmpty(trackDetails)}
            </Text>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(TraceOrderDetail);
