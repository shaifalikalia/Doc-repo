import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal, ModalBody } from "reactstrap";
import crossIcon from "./../../../assets/images/cross.svg";

import Text from "components/Text";
const ImportCatalogueModal = ({
  t,
  isImportCatalogueModalOpen,
  closeImportCatalogueModal,
}) => {
  return (
    <Modal
      isOpen={isImportCatalogueModalOpen}
      toggle={closeImportCatalogueModal}
      className="modal-dialog-centered pricing-plan-modal modal-width-660 import-catalogue-modal"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeImportCatalogueModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody>
        <div className="modal-custom-title">
          <Text size="25px" marginBottom="24px" weight="500" color="#111B45">
            <span className="modal-title-25">
              {t("vendorManagement.StepsToImportCatalog")}
            </span>
          </Text>
        </div>
        <div className="d-flex">
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25 mr-2">
              {" "}
              {t("vendorManagement.one")}
            </span>
          </Text>
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25 ml-1">
              {t("vendorManagement.StepsCatalog1")}
            </span>
          </Text>
        </div>
        <div className="d-flex">
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25 mr-2">
              {" "}
              {t("vendorManagement.two")}
            </span>
          </Text>
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25">
              {t("vendorManagement.StepsCatalog2")}
            </span>
          </Text>
        </div>
        <div className="d-flex">
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25 mr-2">
              {" "}
              {t("vendorManagement.three")}
            </span>
          </Text>
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25">
              {t("vendorManagement.StepsCatalog3")}
            </span>
          </Text>
        </div>
        <div className="sub-content">
          <div className="d-flex">
            <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
              <span className="modal-title-25 mr-2">
                {" "}
                {t("vendorManagement.a")}{" "}
              </span>
            </Text>
            <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
              <span
                className="modal-title-25"
                dangerouslySetInnerHTML={{
                  __html: t("vendorManagement.StepsCatalog3a"),
                }}
              />
            </Text>
          </div>
          <div className="d-flex">
            <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
              <span className="modal-title-25 mr-2">
                {" "}
                {t("vendorManagement.b")}
              </span>
            </Text>
            <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
              <span
                className="modal-title-25"
                dangerouslySetInnerHTML={{
                  __html: t("vendorManagement.StepsCatalog3b"),
                }}
              />
            </Text>
          </div>
          <div className="d-flex">
            <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
              <span className="modal-title-25 mr-2">
                {" "}
                {t("vendorManagement.c")}{" "}
              </span>
            </Text>
            <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
              <span
                className="modal-title-25"
                dangerouslySetInnerHTML={{
                  __html: t("vendorManagement.StepsCatalog3c"),
                }}
              />
            </Text>
          </div>
          <div className="d-flex">
            <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
              <span className="modal-title-25 mr-2">
                {" "}
                {t("vendorManagement.d")}
              </span>
            </Text>
            <Text size="16px" marginBottom="40px" weight="300" color="#111B45">
              <span
                className="modal-title-25"
                dangerouslySetInnerHTML={{
                  __html: t("vendorManagement.StepsCatalog3d"),
                }}
              />
            </Text>
          </div>
        </div>

        <div className="modal-custom-title">
          <Text size="25px" marginBottom="24px" weight="500" color="#111B45">
            <span className="modal-title-25">
              {t("vendorManagement.rulesForImportingImages")}
            </span>
          </Text>
        </div>
        <div className="d-flex">
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25 mr-2">
              {" "}
              {t("vendorManagement.one")}
            </span>
          </Text>
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25 ml-1">
              {t("vendorManagement.importingImage1")}
            </span>
          </Text>
        </div>
        <div className="d-flex">
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25 mr-2">
              {" "}
              {t("vendorManagement.two")}
            </span>
          </Text>
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25">
              {t("vendorManagement.importingImage2")}
            </span>
          </Text>
        </div>
        <div className="d-flex">
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25 mr-2">
              {" "}
              {t("vendorManagement.three")}
            </span>
          </Text>
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25">
              {t("vendorManagement.importingImage3")}
            </span>
          </Text>
        </div>

        <div className="d-flex">
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25 mr-2">
              {" "}
              {t("vendorManagement.four")}{" "}
            </span>
          </Text>
          <Text size="16px" marginBottom="0px" weight="300" color="#111B45">
            <span className="modal-title-25">
              {t("vendorManagement.importingImage4")}
            </span>
          </Text>
        </div>

        <div className="d-flex">
          <Text size="16px" marginBottom="10px" weight="300" color="#111B45">
            <span className="modal-title-25 mr-2">
              {" "}
              {t("vendorManagement.five")}{" "}
            </span>
          </Text>
          <Text size="16px" marginBottom="0px" weight="300" color="#111B45">
            <span className="modal-title-25">
              {t("vendorManagement.importingImage5")}
            </span>
          </Text>
        </div>

        {/* While uploading the image, the image size should be less than 5 MB */}
      </ModalBody>
    </Modal>
  );
};
export default withTranslation()(ImportCatalogueModal);
