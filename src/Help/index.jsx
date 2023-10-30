import React from "react";
import Page from "components/Page";
import { Col, Row } from "reactstrap";
import styles from "./Help.module.scss";
import FaqIcon from "../assets/images/contact_support.png";
import OnlineHelpIcon from "../assets/images/ico_faq.png";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import constants from "../constants.js";
import { motion } from "framer-motion";

function HelpPage({ history, location, t }) {
  return (
    <Page
      onBack={() => history.push("/")}
      title={t("navbar.help")}
      className={styles["page"]}
    >
      <Row>
        <Col lg="4">
          <Card
            icon={FaqIcon}
            title={t("help.faqs")}
            to={constants.routes.faq}
          />
        </Col>
        <Col lg="4">
          <Card
            icon={OnlineHelpIcon}
            title={t("help.onlineHelp")}
            to={constants.routes.onlineHelp}
          />
        </Col>
      </Row>
    </Page>
  );
}

function Card({ to, icon, title, data }) {
  return (
    <motion.div
      whileHover={{ scale: constants.animation.hoverScale }}
      whileTap={{ scale: constants.animation.hoverScale }}
    >
      <Link to={to}>
        <div className={styles["card"]}>
          <img className={`${styles["icon"]} mr-2`} src={icon} alt="icon" />
          <h4>{title}</h4>
        </div>
      </Link>
    </motion.div>
  );
}

export default withTranslation()(HelpPage);
