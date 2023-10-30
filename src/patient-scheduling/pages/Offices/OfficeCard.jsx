import React, { useState } from "react";
import Card from "components/Card";
import Text from "components/Text";
import styles from "./Offices.module.scss";
import { withTranslation } from "react-i18next";
import pin from "./../../../assets/images/pin-icon.svg";
import calendar from "./../../../assets/images/calendar-icon.svg";
import { Modal, ModalBody } from "reactstrap";
import crossIcon from "./../../../assets/images/cross.svg";
import { Link } from "react-router-dom";
import constants from "./../../../constants";
import qs from "query-string";
import { motion } from "framer-motion";
import { getFullAddress } from "utils";

const animationVariant = {
  hidden: { y: 50, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

function OfficeCard({ doctorId, office, t }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const specialties = office.specialities
    ? office.specialities.split(", ")
    : [];
  const isSubscriptionPurchased = office.isSubscriptionPurchased;

  let specialtiesSection = null;
  if (specialties.length === 0) {
    specialtiesSection = (
      <Text size="12px" weight="600" color="#6f7788">
        {t("notAdded")}
      </Text>
    );
  } else if (specialties.length > 2) {
    specialtiesSection = (
      <>
        {specialties.slice(0, 2).map((it) => (
          <Text size="12px" weight="500" color="#6f7788" marginBottom="3px">
            {it}
          </Text>
        ))}

        <div
          className={styles["anchor-link"]}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          {t("viewAll")}
        </div>
      </>
    );
  } else {
    specialtiesSection = specialties.map((it) => (
      <Text size="12px" weight="500" color="#6f7788" marginBottom="3px">
        {it}
      </Text>
    ));
  }

  return (
    <>
      <motion.div
        variants={animationVariant}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 1.05 }}
      >
        <Card
          className={styles["officeCardWrapper"]}
          radius="15px"
          cursor="unset"
          shadow="0 0 15px 0 rgba(0, 0, 0, 0.06)"
        >
          <div className={styles["office-card-container"]}>
            <div style={{ height: 82 }}>
              <div
                style={{
                  maxHeight: 48,
                  marginTop: 10,
                  marginBottom: 5,
                  overflow: "hidden",
                }}
              >
                <Text secondary size="16px" weight="600">
                  {office.name}
                </Text>
              </div>
              <div className="d-flex">
                <div className={styles.pinIcon}>
                  {" "}
                  <img src={pin} alt="pin" />{" "}
                </div>
                <Text
                  className={styles.addressField}
                  size="12px"
                  minHeight="50px"
                  weight="300"
                  color="#6f7788"
                  overflow="hidden"
                >
                  {getFullAddress(office.officeLocation, t)}
                </Text>
              </div>
            </div>
            <Text
              size="12px"
              weight="300"
              color="#6f7788"
              marginTop="28px"
              marginBottom="8px"
            >
              {t("patient.officeSpecialtiesOrServices")}
            </Text>

            <div style={{ height: 52 }}>{specialtiesSection}</div>

            <Link
              to={{
                pathname: isSubscriptionPurchased
                  ? constants.routes.doctor
                  : constants.routes.requestAnAppointment,
                search: qs.stringify({ doctorId, officeId: office.id }),
              }}
            >
              <div className={styles["book-btn"]}>
                <img src={calendar} alt="calendar" />
                <Text secondary size="12px" weight="500">
                  {isSubscriptionPurchased
                    ? t("patient.bookAppointment")
                    : t("patient.requestAnAppointment")}
                </Text>
              </div>
            </Link>
          </div>
        </Card>
      </motion.div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          toggle={closeModal}
          className={
            "modal-dialog-centered " + styles["doctor-specialty-modal"]
          }
          modalClassName={"custom-modal "}
        >
          <span className="close-btn" onClick={closeModal}>
            <img src={crossIcon} alt="close" />
          </span>
          <h2 className={styles["modal-title"]}>
            {t("patient.officeSpecialties", { officeName: office.name })}
          </h2>
          <ModalBody>
            <ul className={styles["specialty-list"]}>
              {specialties.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}

export default withTranslation()(OfficeCard);
