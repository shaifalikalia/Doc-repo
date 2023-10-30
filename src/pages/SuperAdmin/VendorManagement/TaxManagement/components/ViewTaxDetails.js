import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Col, Modal, Row } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";

function ViewTaxDetailsModal({
  t,
  taxDetails,
  closeModal,
  setisEditTaxDetails,
}) {
  return (
    <>
      <Modal
        isOpen={true}
        toggle={closeModal}
        className={"modal-dialog-centered modal-width-660 tax-detail-modal"}
        modalClassName="custom-modal"
      >
        <span
          className="small-icon"
          onClick={() => setisEditTaxDetails(taxDetails)}
        >
          <img
            src={require("assets/images/edit-icon.svg").default}
            alt="edit"
          />
        </span>
        <span class="divider small-icon"></span>
        <span className="close-btn" onClick={closeModal}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>

        <ModalBody>
          <Text size="25px" marginBottom="25px" weight="500" color="#111b45">
            {t("superAdminTax.taxDetails")}
          </Text>
          <Text size="12px" weight="400" color="#6F7788">
            {" "}
            {t("superAdminTax.taxName")}
          </Text>
          <Text size="14px" marginBottom="36px" weight="600" color="#102C42">
            {taxDetails?.name}
          </Text>
          <Text size="12px" weight="400" color="#6F7788">
            {" "}
            {t("superAdminTax.taxType")}
          </Text>
          <Text size="14px" weight="600" color="#102C42">
            {taxDetails?.isSameForAllState
              ? t("superAdminTax.oneTax")
              : t("superAdminTax.provinceWiseTax")}
          </Text>

          {taxDetails.isSameForAllState && (
            <div>
              <Text size="12px" marginTop="36px" weight="400" color="#6F7788">
                {" "}
                {t("superAdminTax.taxPercentage")}
              </Text>
              <Text size="14px" weight="600" color="#102C42">
                {taxDetails?.vendorTaxForStates.length &&
                  `${taxDetails?.vendorTaxForStates[0]?.percentage}%`}
              </Text>
            </div>
          )}

          {taxDetails?.vendorTaxForStates.length &&
            !taxDetails.isSameForAllState && (
              <table>
                <thead>
                  <tr>
                    <th> Province/States </th>
                    <th>Tax Percentage </th>
                  </tr>
                </thead>
                <tbody>
                  {taxDetails?.vendorTaxForStates.map((item) => (
                    <tr key={item.id}>
                      <td> {item?.state?.name} </td>
                      <td> {`${item.percentage}%`} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(ViewTaxDetailsModal);
