import React from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal } from "reactstrap";
import ModalBody from "reactstrap/lib/ModalBody";
import Text from "components/Text";
import styles from "./../Promotion.module.scss";
import Empty from "components/Empty";
import { Link } from "react-router-dom";

function ViewCustomerModal({
  t,
  isViewCustomerModalOpen,
  setViewCustomerModalOpen,
  listOfCustomers,
}) {
  return (
    <>
      <Modal
        isOpen={isViewCustomerModalOpen}
        toggle={() => setViewCustomerModalOpen(false)}
        className={
          "modal-dialog-centered modal-width-660 " +
          styles["view-customer-modal"]
        }
        modalClassName="custom-modal"
      >
        <span
          className="close-btn"
          onClick={() => setViewCustomerModalOpen(false)}
        >
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        <ModalBody>
          <div className="modal-custom-title">
            <Text size="25px" marginBottom="5px" weight="500" color="#111b45">
              {t("vendorManagement.customers")}
            </Text>
          </div>
          <div className={styles["alert-info"]}>
            <div className="d-flex">
              <img
                src={require("assets/images/envelope-icon.svg").default}
                alt="close"
              />
              <Text size="12px" marginBottom="0px" weight="300" color="#102B42">
                {t("vendorManagement.customersModalDesc")}
              </Text>
            </div>
            <div className={"link-btn " + styles["send-nvite"]}>
              <Link to="/invite-sales-rep">
                {t("vendorManagement.sendInvite")}
              </Link>
            </div>
          </div>
          <Text size="12px" marginBottom="5px" weight="400" color="#6F7788">
            {listOfCustomers?.length} {t("vendorManagement.customers")}
          </Text>
          <ul
            className={
              styles["customer-list"] + " " + styles["view-customer-list"]
            }
          >
            {!!listOfCustomers.length ? (
              listOfCustomers.map((item) => (
                <li key={item.id}>
                  {item?.user?.firstName} {item?.user?.lastName}
                  <p>{item?.office?.name}</p>
                </li>
              ))
            ) : (
              <Empty Message={t("noRecordFound")} />
            )}
          </ul>
          <button
            type="button"
            className="button button-round button-shadow w-sm-100"
            onClick={() => setViewCustomerModalOpen(false)}
            title={t("vendorManagement.okayGotIt")}
          >
            {t("vendorManagement.okayGotIt")}
          </button>
        </ModalBody>
      </Modal>
    </>
  );
}

export default withTranslation()(ViewCustomerModal);
