import React, { Component, Fragment } from "react";
import { AzureAD, AuthenticationState, MsalAuthProvider } from "react-aad-msal";

import {
  config as configSUSI,
  parameters as parametersSUSI,
  options as optionsSUSI,
} from "../services/authProvider";
import {
  config as configPR,
  parameters as parametersPR,
  options as optionsPR,
} from "../services/authProviderReset";
import {
  config as configSU,
  parameters as parametersSU,
  options as optionsSU,
} from "../services/authProviderSignup";

import { withRouter } from "react-router";

import HeaderFactory from "../components/Header/HeaderFactory";
import Helper from "utils/helper";
import Loader from "components/Loader";
import FreeTrialPopup from "components/FreeTrialModal";
import { Modal, ModalBody } from "reactstrap";
import Home from "pages/Home";
import Dentist from "pages/Dentist";
import Physician from "pages/Physican";
import Pharmacist from "pages/Pharmacist";
import Personnel from "pages/Personnel";
import Contact from "pages/Contact";
import NotFound from "components/notFound";
import SubscriptionPopup from "components/SubscriptionModal";
import Doctors from "../patient-scheduling/pages/Doctors";
import SearchDoctorBySpecialty from "../patient-scheduling/pages/SearchDoctorBySpecialty";
import SetLocation from "../patient-scheduling/pages/SetLocation";
import DoctorOffices from "../patient-scheduling/pages/Offices";

/*actions*/
import { connect } from "react-redux";
import {
  getProfile,
  getSubscriptionStatus,
  getCompanyInformation,
} from "actions/index";
import { createBrowserHistory } from "history";
import configureStore from "../store";
import { Route, Switch, Redirect } from "react-router-dom";
import Privacy from "pages/PrivacyPolicy";
import PrivacyPolicyPatient from "pages/PrivacyPolicyPatient";
import Terms from "pages/TermsCondtion";
import TermsCondtionPatient from "pages/TermsCondtionPatient";
import constants from "./../constants";
import FooterFactory from "components/Footer/FooterFactory";
import DoctorDetail from "patient-scheduling/pages/DoctorDetail";
import DoctorReviewsByOffice from "patient-scheduling/pages/Reviews";
import Patient from "pages/Patient";
import AboutUs from "pages/AboutUs";
import Overview from "pages/Overview";
import Faq from "pages/Faq";
import WaitingListForm from "patient-scheduling/pages/WaitingListForm";
import RequestAnAppointment from "patient-scheduling/pages/RequestAppointment";
import { getMessaging, getToken } from "firebase/messaging";
import app from "../firebase";
import DownloadIcs from "pages/DownloadIcs";
import QuestionnaireForm from "patient-scheduling/pages/QuestionnaireForm";
import OnlineAndFaq from "Help/OnlineAndFaq";
import Supplier from "pages/Supplier";
import HealthcareEnterprise from "pages/Healthcare-Enterprise";
import Products from "pages/Products";
import Features from "pages/Features";
import Pricing from "pages/pricing";
import { isSupported } from "firebase/messaging";
import { cloneDeep } from "lodash";
import GuideDownloadPage from "pages/ThankYouDownload/GuideDownloadPage";
import GuideThankPage from "pages/ThankYouDownload/GuideThankPage";
import EbookDownloadPage from "pages/ThankYouDownload/EbookDownloadPage";
import EbookThankPage from "pages/ThankYouDownload/EbookThankPage";
import PrivacyPolicyVendor from "pages/PrivacyPolicyVendor";
import TermsCondtionVendor from "pages/TermsCondtionVendor";
import GetStarted from "pages/Get-started";
import DemoRequestPage from "pages/DemoRequestPage";
import DemoRequestThank from "pages/DemoRequestPage/DemoRequestThank";
import PaymentFailed from "pages/PaymentFailed";
import FindDoctors from "pages/FindDoctors";
import MoveToOfficeStaff from "pages/MoveToOfficeStaff";

const history = createBrowserHistory();
const store = configureStore(history);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorType: false,
      isSignup: false,
      TrialExpiredModal: false,
      isTrialClose: false,
      isLogin: false,
      statusModal: false,
      provider: new MsalAuthProvider(configSU, parametersSU, optionsSU),
    };
  }

  signinHandler = () => {
    const provider = new MsalAuthProvider(
      configSUSI,
      parametersSUSI,
      optionsSUSI
    );
    this.setState({ isSignup: false, provider }, () => {
      provider.login();
    });
  };

  componentDidMount() {
    const seesionItem = localStorage.getItem("msal.login.error");

    if (seesionItem && seesionItem.includes("AADB2C90118")) {
        this.setState({ errorType: true });
        localStorage.clear();
      }

    // Handle signUp case
    if (seesionItem && seesionItem.includes("AADB2C90091")) {
          localStorage.clear();
          window.location.reload(true);
          this.setState({ isSignup: false });
    }

    if (seesionItem && seesionItem.includes("AADB2C90077")) {
      this.state.provider.logout();
      localStorage.clear();
      this.setState({ isSignup: false });
    }
    if (Helper.isLoggedIn()) {
      this.getTokenManageState();
    }
  }

  getTokenManageState = async () => {
    try {
      let isSupportBrowser = await isSupported();
      let token = "";
      if (isSupportBrowser) {
        token = await this.getFcmToken();
      }

      this.props.getProfile(token);
      this.props.getCompanyInformation();
      this.setState({ isLogin: true });
    } catch (error) {
      this.props.getProfile("");
      this.props.getCompanyInformation();
      this.setState({ isLogin: true });
    }
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.profile !== this.props.profile &&
      !this.props.subscriptionStatus
    ) {
      if (
        this.props.profile &&
        this.props.profile.userSubscription &&
        this.props.profile.userSubscription.packageType !== "trial" &&
        this.props.profile.userSubscription.isActive
      ) {
        this.props.getSubscriptionStatus();
      }
    }

    if (
      this.props.subscriptionStatus &&
      prevProps.subscriptionStatus !== this.props.subscriptionStatus
    ) {
      this.setState({
        statusModal:
          this.props.subscriptionStatus.overallStatus === "uncollectible"
            ? true
            : this.props.subscriptionStatus.overallStatus === "open"
            ? true
            : false,
      });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.profile &&
      props.profile.profileSetupStep === "packageExpired" &&
      !state.isTrialClose
    ) {
      return {
        TrialExpiredModal: true,
      };
    }
    if (
      props.profile &&
      props.profile.profileSetupStep === "2" &&
      props.profile.userSubscription &&
      !props.profile.userSubscription.isActive &&
      !state.isTrialClose
    ) {
      return {
        TrialExpiredModal: true,
      };
    }
    if (
      props.profile &&
      props.profile.profileSetupStep === "completed" &&
      props.profile.userSubscription &&
      props.profile.userSubscription.isActive
    ) {
      return {
        isTrialClose: false,
      };
    }
    return null;
  }

  signupHandler = () => {
    const parameters = cloneDeep(parametersSU);
    if (this.props.location.pathname === "/supplier") {
      parameters.extraQueryParameters = {
        role: "vendor",
      };
    }
    if (this.props.location.pathname === "/patient") {
      parameters.extraQueryParameters = {
        role: "patient",
      };
    }
    const provider = new MsalAuthProvider(configSU, parameters, optionsSU);
    this.setState({ isSignup: true, provider }, () => {
      provider.login();
    });
  };

  signinHandler = () => {
    const provider = new MsalAuthProvider(
      configSUSI,
      parametersSUSI,
      optionsSUSI
    );
    this.setState({ isSignup: false, provider }, () => {
      provider.login();
    });
  };

  getFcmToken = async () => {
    const messaging = getMessaging(app);
    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_PUBLIC_KEY,
      });
      return Promise.resolve(token);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    this.state.provider.logout();
  };

  closeModal = () => {
    this.setState({
      TrialExpiredModal: false,
      isTrialClose: true,
      statusModal: false,
    });
  };

  ConfirmModal = () => {
    const email =
      (this.props.companyInformation && this.props.companyInformation.email) ||
      "";
    const phone =
      (this.props.companyInformation && this.props.companyInformation.phone) ||
      "";

    return (
      <Modal
        isOpen={this.props.profileError}
        className="modal-dialog-centered account-deactivate-modal"
        size="md"
        modalClassName="custom-modal"
      >
        <ModalBody>
          <div className="text-center">
            <h4 className="title">{this.props.profileErrorMessage} </h4>
            <p>
              Email : {email} <br /> Phone : {phone}
            </p>
            <button
              className="button button-round button-shadow button-min-130"
              onClick={this.logout}
            >
              Logout
            </button>
          </div>
        </ModalBody>
      </Modal>
    );
  };

  errorModal = () => {
    const email =
      (this.props.companyInformation && this.props.companyInformation.email) ||
      "";
    const phone =
      (this.props.companyInformation && this.props.companyInformation.phone) ||
      "";

    return (
      <Modal
        isOpen={this.props.networkError}
        className="modal-dialog-centered account-deactivate-modal"
        size="md"
        modalClassName="custom-modal"
      >
        <ModalBody>
          <div className="text-center">
            <h4 className="title">{this.props.profileErrorMessage} </h4>
            <p>
              Email : {email} <br /> Phone : {phone}
            </p>
            <button
              className="button button-round button-shadow button-min-130"
              onClick={this.logout}
            >
              Logout
            </button>
          </div>
        </ModalBody>
      </Modal>
    );
  };

  render() {
    const { isLoading, isError } = this.props;
    const { TrialExpiredModal, statusModal } = this.state;

    if (this.state.errorType) {
      const provider = new MsalAuthProvider(configPR, parametersPR, optionsPR);
      return (
        <div className="main-wrapper">
          <AzureAD
            forceLogin={this.state.errorType}
            provider={provider}
          ></AzureAD>
        </div>
      );
    }

    if (!this.state.errorType) {
      return (
        <div className="main-wrapper">
          <AzureAD provider={this.state.provider} reduxStore={store}>
            {({ accountInfo, authenticationState, error, logout, login }) => (
              <React.Fragment>
                {constants.OnlineFaqPages.includes(
                  window.location.pathname
                ) && (
                  <>
                    <Switch>
                      <Route component={<>Home</>} exact path="/" />
                      <Route
                        render={(props) => (
                          <OnlineAndFaq data="FAQForAccountOwner" />
                        )}
                        path="/owner/faq"
                      />
                      <Route
                        render={(props) => <OnlineAndFaq data="FAQForStaff" />}
                        path="/staff/faq"
                      />
                      <Route
                        render={(props) => (
                          <OnlineAndFaq data="FAQForPatient" />
                        )}
                        path="/patient/faq"
                      />
                      <Route
                        render={(props) => (
                          <OnlineAndFaq data="OnlineHelpForAccountOwner" />
                        )}
                        path="/owner/help"
                      />
                      <Route
                        render={(props) => (
                          <OnlineAndFaq data="OnlineHelpForStaff" />
                        )}
                        path="/staff/help"
                      />
                      <Route
                        render={(props) => (
                          <OnlineAndFaq data="OnlineHelpForPatient" />
                        )}
                        path="/patient/help"
                      />

                      <Route
                        render={(props) => (
                          <GuideDownloadPage
                            hubspotType={
                              constants.hubspotFormPages.guideDownloadPage
                            }
                          />
                        )}
                        path={constants.routes.landingPages.guideDownloadPage}
                      />

                      <Route
                        render={(props) => (
                          <GuideDownloadPage
                            hubspotType={
                              constants.hubspotFormPages.fbGuideHubspotPage
                            }
                          />
                        )}
                        path={constants.routes.landingPages.guideDownloadPageFb}
                      />

                      <Route
                        render={(props) => (
                          <GuideDownloadPage
                            hubspotType={
                              constants.hubspotFormPages.gglGuideHubspotPage
                            }
                          />
                        )}
                        path={
                          constants.routes.landingPages.guideDownloadPageGgl
                        }
                      />

                      <Route
                        render={(props) => (
                          <GuideDownloadPage
                            hubspotType={
                              constants.hubspotFormPages.smGuideHubspotPage
                            }
                          />
                        )}
                        path={constants.routes.landingPages.guideDownloadPageSm}
                      />
                      <Route
                        component={GuideThankPage}
                        path={constants.routes.landingPages.guideThankPage}
                      />

                      <Route
                        render={(props) => (
                          <EbookDownloadPage
                            hubspotType={
                              constants.hubspotFormPages.ebookDownloadPage
                            }
                          />
                        )}
                        path={constants.routes.landingPages.ebookDownloadPage}
                      />

                      <Route
                        render={(props) => (
                          <EbookDownloadPage
                            hubspotType={
                              constants.hubspotFormPages.fbHubspotPage
                            }
                          />
                        )}
                        path={constants.routes.landingPages.ebookDownloadPageFb}
                      />

                      <Route
                        render={(props) => (
                          <EbookDownloadPage
                            hubspotType={
                              constants.hubspotFormPages.gglHubspotPage
                            }
                          />
                        )}
                        path={
                          constants.routes.landingPages.ebookDownloadPageGgl
                        }
                      />

                      <Route
                        render={(props) => (
                          <EbookDownloadPage
                            hubspotType={
                              constants.hubspotFormPages.smHubspotPage
                            }
                          />
                        )}
                        path={constants.routes.landingPages.ebookDownloadPageSm}
                      />

                      <Route
                        component={EbookThankPage}
                        path={constants.routes.landingPages.ebookThankPage}
                      />
                      <Route
                        component={GetStarted}
                        path={constants.routes.getStarted}
                      />
                      <Route
                        component={DemoRequestPage}
                        path={constants.routes.demoRequestPage}
                      />
                      <Route
                        component={DemoRequestThank}
                        path={constants.routes.demoRequestThank}
                      />
                    </Switch>
                  </>
                )}

                {authenticationState === AuthenticationState.Unauthenticated &&
                  !constants.OnlineFaqPages.includes(
                    window.location.pathname
                  ) && (
                    <div>
                      <HeaderFactory
                        onLogin={this.signinHandler}
                        onSignup={this.signupHandler}
                      />
                      <Switch>
                        <Route component={Home} exact path="/" />
                        <Route
                          render={(props) => (
                            <Dentist
                              {...props}
                              SignupClick={this.signupHandler}
                            />
                          )}
                          path="/dentist"
                        />
                        <Route
                          render={(props) => (
                            <AboutUs
                              {...props}
                              SignupClick={this.signupHandler}
                            />
                          )}
                          path="/about-us"
                        />
                        <Route
                          render={(props) => (
                            <Overview
                              {...props}
                              SignupClick={this.signupHandler}
                            />
                          )}
                          path="/overview"
                        />
                        <Route
                          render={(props) => (
                            <Faq
                              {...props}
                              SignupClick={this.signupHandler}
                              LoginClick={this.signinHandler}
                            />
                          )}
                          path="/faq"
                        />
                        <Route
                          render={(props) => (
                            <Patient
                              {...props}
                              SignupClick={this.signupHandler}
                            />
                          )}
                          path="/patient"
                        />

                        <Route
                          render={(props) => (
                            <Physician
                              {...props}
                              SignupClick={this.signupHandler}
                            />
                          )}
                          path="/physician"
                        />
                        <Route
                          render={(props) => (
                            <Pharmacist
                              {...props}
                              SignupClick={this.signupHandler}
                            />
                          )}
                          path="/pharmacist"
                        />
                        <Route
                          render={(props) => (
                            <Personnel
                              {...props}
                              SignupClick={this.signupHandler}
                            />
                          )}
                          path="/personnel"
                        />
                        <Route
                          render={(props) => (
                            <Supplier
                              {...props}
                              SignupClick={this.signupHandler}
                            />
                          )}
                          path="/supplier"
                        />
                        <Route
                          render={(props) => (
                            <HealthcareEnterprise
                              {...props}
                              SignupClick={this.signupHandler}
                            />
                          )}
                          path="/healthcare-enterprise"
                        />
                        <Route
                          render={(props) => (
                            <Products
                              {...props}
                              SignupClick={this.signupHandler}
                            />
                          )}
                          path="/products"
                        />
                        <Route
                          render={(props) => (
                            <Pricing
                              {...props}
                              SignupClick={this.signupHandler}
                            />
                          )}
                          path="/pricing"
                        />
                        <Route
                          render={(props) => (
                            <Features
                              {...props}
                              SignupClick={this.signupHandler}
                            />
                          )}
                          path="/features"
                        />

                        <Route component={Contact} path="/contact" />
                        <Route component={Privacy} path="/privacy-policy" />
                        <Route component={Terms} path="/terms-conditions" />
                        <Route
                          component={PrivacyPolicyPatient}
                          path="/privacy-policy-for-patient"
                        />
                        <Route
                          component={TermsCondtionPatient}
                          path="/terms-conditions-for-patient"
                        />

                        <Route
                          component={PrivacyPolicyVendor}
                          path="/privacy-policy-for-vendor"
                        />
                        <Route
                          component={TermsCondtionVendor}
                          path="/terms-conditions-for-vendor"
                        />

                        <Route
                          path={constants.routes.requestAnAppointment}
                          render={(props) => (
                            <RequestAnAppointment
                              {...props}
                              signIn={this.signinHandler}
                            />
                          )}
                        />
                        <Route
                          exact
                          component={Doctors}
                          path={constants.routes.doctors}
                        />
                        <Route
                          exact
                          component={SearchDoctorBySpecialty}
                          path={constants.routes.searchDoctorBySpecialty}
                        />
                        <Route
                          exact
                          path={constants.routes.doctor}
                          render={(props) => {
                            return (
                              <DoctorDetail
                                {...props}
                                signIn={this.signinHandler}
                              />
                            );
                          }}
                        />
                        <Route
                          exact
                          path={constants.routes.watingListRequest}
                          render={(props) => {
                            return (
                              <WaitingListForm
                                {...props}
                                signIn={this.signinHandler}
                              />
                            );
                          }}
                        />
                        <Route
                          exact
                          path={constants.routes.questionnaireForm}
                          render={(props) => {
                            return (
                              <QuestionnaireForm
                                {...props}
                                signIn={this.signinHandler}
                              />
                            );
                          }}
                        />
                        <Route
                          exact
                          component={SetLocation}
                          path={constants.routes.setLocation}
                        />
                        <Route
                          exact
                          component={DoctorOffices}
                          path={constants.routes.doctorOffices}
                        />
                        <Route
                          exact
                          component={DoctorReviewsByOffice}
                          path={constants.routes.doctorReviews}
                        />
                        <Route
                          exact
                          component={DownloadIcs}
                          path={constants.routes.downloadIcs}
                        />
                        <Route
                          exact
                          render={(props) => {
                            return (
                              <PaymentFailed
                                {...props}
                                signIn={this.signinHandler}
                              />
                            );
                          }}
                          path={constants.routes.paymentfailed}
                        />

                        <Route
                          exact
                          render={(props) => {
                            return (
                              <FindDoctors
                                {...props}
                                signIn={this.signinHandler}
                              />
                            );
                          }}
                          path={constants.routes.findDoctors}
                        />

                        <Route
                          exact
                          render={(props) => {
                            return (
                              <MoveToOfficeStaff
                                {...props}
                                signIn={this.signinHandler}
                              />
                            );
                          }}
                          path={constants.routes.officeStaffs}
                        />

                        <Route component={NotFound} path="/404" />
                        <Redirect from="*" to="/404" />
                      </Switch>

                      <FooterFactory />
                    </div>
                  )}

                {accountInfo &&
                  !constants.OnlineFaqPages.includes(
                    window.location.pathname
                  ) && (
                    <div>
                      {this.props.profile && (
                        <HeaderFactory
                          providerName={accountInfo.account.idToken.acr}
                        />
                      )}
                      <div className="main-content">
                        {isLoading && !isError ? (
                          <Loader />
                        ) : (
                          <Fragment>
                            {this.props.children}
                            {this.ConfirmModal()}
                            {this.errorModal()}
                          </Fragment>
                        )}
                        <FreeTrialPopup
                          data={this.props.profile}
                          show={
                            this.props.profile &&
                            this.props.profile.profileSetupStep ===
                              "packageExpired" &&
                            TrialExpiredModal
                              ? true
                              : this.props.profile &&
                                this.props.profile.profileSetupStep === "2" &&
                                this.props.profile.userSubscription &&
                                !this.props.profile.userSubscription.isActive &&
                                TrialExpiredModal
                              ? true
                              : false
                          }
                          closeModal={this.closeModal}
                        />
                        <SubscriptionPopup
                          show={statusModal}
                          closeModal={this.closeModal}
                        />
                      </div>
                      {this.props.profile && (
                        <FooterFactory role={this.props.profile.role} />
                      )}
                    </div>
                  )}
              </React.Fragment>
            )}
          </AzureAD>
        </div>
      );
    }
  }
}

const mapStateToProps = ({
  userProfile: {
    profile,
    isLoading,
    profileError,
    profileErrorMessage,
    networkError,
  },
  errors: { isError },
  pageContent: { companyInformation },
  sub: { subscriptionStatus },
}) => ({
  profile,
  isLoading,
  isError,
  profileError,
  profileErrorMessage,
  networkError,
  subscriptionStatus,
  companyInformation,
});

export default connect(mapStateToProps, {
  getProfile,
  getSubscriptionStatus,
  getCompanyInformation,
})(withRouter(App));
