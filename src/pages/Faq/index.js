import { getCompanyInformation } from "actions";
import _isLoading from "hoc/isLoading";
import HomeContact from "components/Home-contact";
import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import { Link } from "react-router-dom";
import constants from "../../constants";
import DownloadModal from "./DownloadModal";
import { isMobileTab } from "utils";
import MoreInfoModal from "./MoreInfoModal";

class Faq extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getCompanyInformation();
  }
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "1",
      openModal: false,
      openMoreInfoModal: false,
      faqType: null,
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
      isMobileTab() && this.scrollToPlan(tab);
    }
  }

  onClickDownloadBtn = (faqType) => {
    this.setState({
      openModal: true,
      type: faqType,
    });
  };
  onClickMoreInfoBtn = (faqType) => {
    this.setState({
      openMoreInfoModal: true,
      type: faqType,
    });
  };

  onCloseModal = () => {
    this.setState({
      openModal: false,
      openMoreInfoModal: false,
    });
  };

  scrollToPlan(id) {
    setTimeout(() => {
      var element = document.getElementById(`faq${id}`);
      var headerOffset = 70;
      var elementPosition = element.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        behavior: "smooth",
        top: offsetPosition,
      });
    }, 500);
  }

  render() {
    const { t } = this.props;
    return (
      <Fragment>
        <div className="app-page">
          <div className="banner-block faq-banner">
            <div className="container">
              <div className="banner-caption">
                <h2>{t("faq.faq")}</h2>
                <div className={"search-box  d-none"}>
                  <input type="text" placeholder={t("faq.faqSearch")} />
                  <span className="ico">
                    <img
                      src={require("assets/images/search-icon.svg").default}
                      alt="icon"
                    />
                  </span>
                </div>
                <p>{t("faq.faqDesc")}</p>
                <Nav tabs className="faq-tabs">
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "1",
                      })}
                      onClick={() => {
                        this.toggle("1");
                      }}
                    >
                      <img
                        className="icon-grey"
                        src={
                          require("assets/images/landing-pages/faq-general-grey.svg")
                            .default
                        }
                        alt="icon"
                      />
                      <img
                        className="icon-green"
                        src={
                          require("assets/images/landing-pages/faq-general-green.svg")
                            .default
                        }
                        alt="icon"
                      />
                      {t("contracts.general")}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "2",
                      })}
                      onClick={() => {
                        this.toggle("2");
                      }}
                    >
                      <img
                        className="icon-grey"
                        src={
                          require("assets/images/landing-pages/faq-account-grey.svg")
                            .default
                        }
                        alt="icon"
                      />
                      <img
                        className="icon-green"
                        src={
                          require("assets/images/landing-pages/faq-account-green.svg")
                            .default
                        }
                        alt="icon"
                      />

                      {t("faq.yourAccountRegistration")}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "3",
                      })}
                      onClick={() => {
                        this.toggle("3");
                      }}
                    >
                      <img
                        className="icon-grey"
                        src={
                          require("assets/images/landing-pages/faq-feature-grey.svg")
                            .default
                        }
                        alt="icon"
                      />
                      <img
                        className="icon-green"
                        src={
                          require("assets/images/landing-pages/faq-feature-green.svg")
                            .default
                        }
                        alt="icon"
                      />

                      {t("faq.productFeatures")}
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
            </div>
          </div>
          <div className="faq-main-wrapper" id="faq-tabs">
            <div className="container">
              <TabContent activeTab={this.state.activeTab}>
                <div id="faq1"></div>
                <TabPane tabId="1">
                  <Accordion allowZeroExpanded allowMultipleExpanded>
                    <AccordionItem uuid="general-a">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.0.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.generalFaq.0.answer")}{" "}
                          <span
                            className="link-btn"
                            onClick={(e) =>
                              this.onClickDownloadBtn(
                                constants.faqRequestType.HelpGuideRequest
                              )
                            }
                          >
                            {t("faq.generalFaq.0.answerText1")}
                          </span>
                          ).{" "}
                        </p>
                        <p> {t("faq.generalFaq.0.answerText2")} </p>
                        <p>
                          {" "}
                          {t("faq.generalFaq.0.answerText3")}{" "}
                          <Link className="link-btn" to="/physician">
                            {t("faq.generalFaq.0.answerText4")}
                          </Link>
                          ,{" "}
                          <Link className="link-btn" to="/dentist">
                            {t("faq.generalFaq.0.answerText5")}
                          </Link>
                          ,{" "}
                          <Link className="link-btn" to="/pharmacist">
                            {t("faq.generalFaq.0.answerText6")}
                          </Link>
                          ,{" "}
                          <Link className="link-btn" to="/personnel">
                            {t("faq.generalFaq.0.answerText7")}
                          </Link>
                          ,{" "}
                          <Link className="link-btn" to="/patient">
                            {t("faq.generalFaq.0.answerText8")}
                          </Link>
                          ,{" "}
                          <Link
                            className="link-btn"
                            to="/healthcare-enterprise"
                          >
                            {t("faq.generalFaq.0.answerText9")}
                          </Link>
                          ,{" "}
                          <Link className="link-btn" to="/supplier">
                            {t("faq.generalFaq.0.answerText10")}
                          </Link>
                          .
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="general-b">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.1.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.generalFaq.1.answer")}{" "}
                          <span
                            onClick={(e) =>
                              this.onClickDownloadBtn(
                                constants.faqRequestType.ChecklistRequest
                              )
                            }
                            className="link-btn"
                          >
                            {t("faq.generalFaq.1.answerText1")}
                          </span>
                          .{" "}
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="general-c">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.2.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.generalFaq.2.answer")} </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="general-d">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.3.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.generalFaq.3.answer")} </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="feature-e">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.4.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p id="faq1">
                          {" "}
                          {t("faq.generalFaq.4.answer")}{" "}
                          <Link to="/pricing" className="link-btn">
                            {t("faq.generalFaq.4.answerText1")}
                          </Link>
                          .{" "}
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="general-f">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.5.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.generalFaq.5.answer")} </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="general-g">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.6.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.generalFaq.6.answer")} </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="general-h">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.7.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.generalFaq.7.answer")}{" "}
                          <Link to="/contact" className="link-btn">
                            {t("faq.generalFaq.7.answerText1")}
                          </Link>
                          .{" "}
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>

                    <AccordionItem uuid="general-i" className="d-none">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.8.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.generalFaq.8.answer")}{" "}
                          <span
                            onClick={this.props.SignupClick}
                            className="link-btn"
                          >
                            {t("faq.generalFaq.8.answerText1")}
                          </span>{" "}
                          {t("faq.generalFaq.8.answerText2")}{" "}
                          <span
                            className="link-btn"
                            onClick={(e) =>
                              this.onClickMoreInfoBtn(
                                constants.faqRequestType.HelpGuideRequest
                              )
                            }
                          >
                            {t("faq.generalFaq.8.answerText3")}
                          </span>
                          .{" "}
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="general-j">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.9.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.generalFaq.9.answer")}{" "}
                          <Link to="/contact" className="link-btn">
                            {t("faq.generalFaq.9.answerText1")}
                          </Link>
                          .{" "}
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="general-k">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.10.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.generalFaq.10.answer")}{" "}
                          <Link to="/contact" className="link-btn">
                            {t("faq.generalFaq.10.answerText1")}
                          </Link>
                          .{" "}
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="general-l">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.11.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.generalFaq.11.answer")}{" "}
                          <Link to="/terms-conditions" className="link-btn">
                            {t("faq.generalFaq.11.answerText1")}
                          </Link>
                          .{" "}
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="general-m">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.12.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.generalFaq.12.answer")}{" "}
                          <Link to="/privacy-policy" className="link-btn">
                            {t("faq.generalFaq.12.answerText1")}
                          </Link>
                          .{" "}
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="general-n">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.generalFaq.13.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.generalFaq.13.answer")}{" "}
                          <Link to="/contact" className="link-btn">
                            {t("faq.generalFaq.13.answerText1")}
                          </Link>
                          .{" "}
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                  </Accordion>
                </TabPane>
                <TabPane tabId="2">
                  <div id="faq2"></div>
                  <Accordion allowZeroExpanded allowMultipleExpanded>
                    <AccordionItem uuid="account-a">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.0.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.accountFaq.0.answer")}{" "}
                          <Link to="/" className="link-btn">
                            {" "}
                            {t("faq.accountFaq.0.answerText1")}
                          </Link>
                          .
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-b">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.1.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.accountFaq.1.answer")}</p>
                        <ol className="order-list">
                          <li>
                            {t("faq.accountFaq.1.answerText1")}{" "}
                            <span
                              onClick={this.props.SignupClick}
                              className="link-btn"
                            >
                              {t("faq.accountFaq.1.answerText2")}
                            </span>
                            .
                          </li>
                          <li>
                            {t("faq.accountFaq.1.answerText3")}{" "}
                            <span
                              onClick={this.props.SignupClick}
                              className="link-btn"
                            >
                              {t("faq.accountFaq.1.answerText4")}
                            </span>
                            .
                          </li>
                        </ol>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-c">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.2.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.accountFaq.2.answer")}</p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-d">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.3.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.accountFaq.3.answer")}</p>{" "}
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-e">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.4.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.accountFaq.4.answer")}</p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-f">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.5.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.accountFaq.5.answer")}</p>{" "}
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-g">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.6.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.accountFaq.6.answer")}</p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-h">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.7.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.accountFaq.7.answer")}</p>{" "}
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-i">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.8.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.accountFaq.8.answer")}</p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-j">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.9.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.accountFaq.9.answer")}{" "}
                          <span
                            onClick={this.props.LoginClick}
                            className="link-btn"
                          >
                            {" "}
                            {t("faq.accountFaq.9.answerText1")}
                          </span>{" "}
                          {t("faq.accountFaq.9.answerText2")}
                        </p>{" "}
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-k">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.10.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.accountFaq.10.answer")}{" "}
                          <Link to="/contact" className="link-btn">
                            {" "}
                            {t("faq.accountFaq.10.answerText1")}
                          </Link>
                          .
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-l">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.11.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.accountFaq.11.answer")}</p>{" "}
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-m">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.12.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.accountFaq.12.answer")}{" "}
                          <Link to="/contact" className="link-btn">
                            {" "}
                            {t("faq.accountFaq.12.answerText1")}
                          </Link>
                          .
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-n">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.13.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.accountFaq.13.answer")}</p>{" "}
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-o">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.14.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.accountFaq.14.answer1")}{" "}
                          <a
                            href={constants.DOWNLOADLINK.playStore}
                            target="_blank"
                            className="link-btn"
                            rel="noreferrer"
                          >
                            {" "}
                            {t("faq.accountFaq.14.answerText1")}
                          </a>
                          &nbsp;,&nbsp;
                          <a
                            href={constants.DOWNLOADLINK.appStore}
                            target="_blank"
                            className="link-btn"
                            rel="noreferrer"
                          >
                            {" "}
                            {t("faq.accountFaq.14.answerText1_1")}
                          </a>
                        </p>
                        <p>
                          {" "}
                          {t("faq.accountFaq.14.answer2")}{" "}
                          <a
                            href={constants.DOWNLOADLINKFORPATIENT.playStore}
                            target="_blank"
                            className="link-btn"
                            rel="noreferrer"
                          >
                            {" "}
                            {t("faq.accountFaq.14.answerText2")}
                          </a>
                          &nbsp;,&nbsp;
                          <a
                            href={constants.DOWNLOADLINKFORPATIENT.appStore}
                            target="_blank"
                            className="link-btn"
                            rel="noreferrer"
                          >
                            {" "}
                            {t("faq.accountFaq.14.answerText2_1")}
                          </a>
                        </p>
                        <p>
                          {" "}
                          {t("faq.accountFaq.14.answer3")}{" "}
                          <a
                            href={constants.DOWNLOADLINKFORSUPPLY.playStore}
                            target="_blank"
                            className="link-btn"
                            rel="noreferrer"
                          >
                            {" "}
                            {t("faq.accountFaq.14.answerText3")}
                          </a>
                          &nbsp;,&nbsp;
                          <a
                            href={constants.DOWNLOADLINKFORSUPPLY.appStore}
                            target="_blank"
                            className="link-btn"
                            rel="noreferrer"
                          >
                            {" "}
                            {t("faq.accountFaq.14.answerText3_1")}
                          </a>
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-p">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.15.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.accountFaq.15.answer")}{" "}
                          <span
                            onClick={this.props.SignupClick}
                            className="link-btn"
                          >
                            {" "}
                            {t("faq.accountFaq.15.answerText1")}
                          </span>
                          .
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-q">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.16.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.accountFaq.16.answer")}{" "}
                          <span
                            onClick={this.props.SignupClick}
                            className="link-btn"
                          >
                            {" "}
                            {t("faq.accountFaq.16.answerText1")}
                          </span>
                          .
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-r">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.17.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.accountFaq.17.answer")}</p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-s">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.18.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.accountFaq.18.answer")}{" "}
                          <span
                            onClick={this.props.SignupClick}
                            className="link-btn"
                          >
                            {" "}
                            {t("faq.accountFaq.18.answerText1")}
                          </span>
                          .
                        </p>
                        <p> {t("faq.accountFaq.18.answerText2")} </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-t">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.19.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.accountFaq.19.answer")}</p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-u">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.20.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.accountFaq.20.answer")}{" "}
                          <Link to="/pricing" className="link-btn">
                            {" "}
                            {t("faq.accountFaq.20.answerText1")}
                          </Link>
                          .
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="account-v">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.accountFaq.21.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.accountFaq.21.answer")}{" "}
                          <span
                            onClick={this.props.LoginClick}
                            className="link-btn"
                          >
                            {" "}
                            {t("faq.accountFaq.21.answerText1")}
                          </span>{" "}
                          {t("faq.accountFaq.21.answerText2")}
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                  </Accordion>
                </TabPane>
                <TabPane tabId="3">
                  <div id="faq3"></div>
                  <Accordion allowZeroExpanded allowMultipleExpanded>
                    <AccordionItem uuid="feature-a">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.productFeaturesFaq.0.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.productFeaturesFaq.0.answer")}{" "}
                          <Link to="/contact" className="link-btn">
                            {" "}
                            {t("faq.productFeaturesFaq.0.answerText1")}
                          </Link>
                          .{" "}
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="feature-b">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.productFeaturesFaq.1.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.productFeaturesFaq.1.answer")}{" "}
                          <Link to="/contact" className="link-btn">
                            {" "}
                            {t("faq.productFeaturesFaq.1.answerText1")}
                          </Link>
                          .{" "}
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="feature-c">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.productFeaturesFaq.2.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p>
                          {" "}
                          {t("faq.productFeaturesFaq.2.answer")}{" "}
                          <Link to="/contact" className="link-btn">
                            {" "}
                            {t("faq.productFeaturesFaq.2.answerText1")}
                          </Link>
                          .{" "}
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="feature-d">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.productFeaturesFaq.3.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.productFeaturesFaq.3.answer")} </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem uuid="feature-e">
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          {" "}
                          {t("faq.productFeaturesFaq.4.ques")}{" "}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p> {t("faq.productFeaturesFaq.4.answer")} </p>
                        <p>
                          <Link className="link-btn" to="/physician">
                            {t("faq.generalFaq.0.answerText4")}
                          </Link>
                          ,{" "}
                          <Link className="link-btn" to="/dentist">
                            {t("faq.generalFaq.0.answerText5")}
                          </Link>
                          ,{" "}
                          <Link className="link-btn" to="/pharmacist">
                            {t("faq.generalFaq.0.answerText6")}
                          </Link>
                          ,{" "}
                          <Link className="link-btn" to="/personnel">
                            {t("faq.generalFaq.0.answerText7")}
                          </Link>
                          ,{" "}
                          <Link className="link-btn" to="/patient">
                            {t("faq.generalFaq.0.answerText8")}
                          </Link>
                          ,{" "}
                          <Link
                            className="link-btn"
                            to="/healthcare-enterprise"
                          >
                            {t("faq.generalFaq.0.answerText9")}
                          </Link>
                          ,{" "}
                          <Link className="link-btn" to="/supplier">
                            {t("faq.generalFaq.0.answerText10")}
                          </Link>
                          .
                        </p>
                      </AccordionItemPanel>
                    </AccordionItem>
                  </Accordion>
                </TabPane>
              </TabContent>
            </div>
          </div>
          <HomeContact companyInformation={this.props.companyInformation} />
        </div>
        {this.state.openModal && (
          <DownloadModal
            isDownloadModalOpen={this.state.openModal}
            setIsDownloadModalOpen={this.onCloseModal}
            type={this.state.type}
          />
        )}
        {this.state.openMoreInfoModal && (
          <MoreInfoModal
            isMoreInfoModalOpen={this.state.openMoreInfoModal}
            setIsMoreInfoModalOpen={this.onCloseModal}
            type={this.state.type}
          />
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = ({
  userProfile: { profile },
  pageContent: {
    isLoading,
    pageContent,
    contactContent,
    testimonialList,
    companyInformation,
  },
  errors: { isError },
}) => ({
  isLoading,
  isError,
  profile,
  pageContent,
  contactContent,
  testimonialList,
  companyInformation,
});

export default connect(mapStateToProps, { getCompanyInformation })(
  withTranslation()(_isLoading(Faq))
);
