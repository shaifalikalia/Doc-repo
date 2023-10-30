import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import ProgressiveImage from "../SendbirdCustomComponents/ProgressiveImage";

function ImageViewer({ t, imageUrl, closeImageViewerModal, isOpen }) {
  return (
    <Modal
      isOpen={isOpen}
      toggle={closeImageViewerModal}
      className="modal-dialog-centered modal-width-660 image-preview-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn">
        <a href={imageUrl} target="_blank" rel="noreferrer">
          <img
            className="mr-2"
            src={require("assets/images/download-icon.svg").default}
            alt="downlaod"
          />
        </a>
        <img
          src={require("assets/images/cross.svg").default}
          alt="close"
          onClick={closeImageViewerModal}
        />
      </span>
      <ModalBody>
        <div className="text-center">
          <ProgressiveImage src={imageUrl} alt="preview" />
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(ImageViewer);
