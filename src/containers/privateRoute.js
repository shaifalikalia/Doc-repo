import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import constants from "./../constants";
import qs from "query-string";
import moment from "moment";
import { getStorage, removeStorage } from "utils";

const freePackageAccessibleRoutes = [
  constants.routes.accountOwner.offices,
  constants.routes.editProfile,
  constants.routes.changePassword,
  constants.routes.accountOwner.managePlan,
  constants.routes.termsAndConditions,
  constants.routes.privacyPolicy,
  constants.routes.accountOwner.editOffice,
  constants.routes.accountOwner.changePlan,
  constants.routes.accountOwner.addSubscription,
  constants.routes.accountOwner.selectOffice,
  constants.routes.accountOwner.profile,
];

const subscriptionTerminatedAccessibleRoutes = [
  constants.routes.accountOwner.offices,
  constants.routes.addSubscription,
  constants.routes.onlineHelp,
  constants.routes.accountOwner.selectOffice,
  constants.routes.help,
  constants.routes.faq,
];
class PrivateRoutes extends Component {
  render() {
    const { role, userSubscription, countryId } = this.props.profile || {};
    const { location } = this.props;

    if (
      userSubscription &&
      userSubscription.packageType === constants.packageTypes.free
    ) {
      const index = freePackageAccessibleRoutes.findIndex(
        (it) => location.pathname === it
      );

      if (index === -1) {
        return (
          <Redirect exact from="/" to={constants.routes.accountOwner.offices} />
        );
      }
    }

    if (role?.systemRole === constants.systemRoles.accountOwner) {
      const { profileSetupStep } = this.props.profile;
      const { date } =
        getStorage(constants.localStorageKeys.paymentMethod) || {};
      if (
        profileSetupStep === "subscriptionTerminated" &&
        !subscriptionTerminatedAccessibleRoutes.includes(location.pathname)
      ) {
        return (
          <Redirect exact from="/" to={constants.routes.accountOwner.offices} />
        );
      } else if (
        profileSetupStep === "1" &&
        location.pathname !== constants.routes.account
      ) {
        return <Redirect exact from="/" to={constants.routes.account} />;
      } else if (
        profileSetupStep === "2" &&
        location.pathname !== constants.routes.addSubscription &&
        location.pathname !== constants.routes.accountOwner.selectOffice
      ) {
        return <Redirect from="/" to={constants.routes.addSubscription} />;
      } else if (
        profileSetupStep === "3" &&
        location.pathname !== constants.routes.setupCard
      ) {
        return <Redirect from="/" to={constants.routes.setupCard} />;
      } else if (date && moment(moment().format("YYYY-MM-DD")).isSame(date)) {
        removeStorage([constants.localStorageKeys.paymentMethod]);
        return <Redirect to={constants.routes.accountOwner.manageCards} />;
      }
    }

    if (role?.systemRole === constants.systemRoles.vendor) {
      const { profileSetupStep } = this.props.profile;

      if (
        profileSetupStep === constants.vendor.step.addProfileDetails &&
        location.pathname !== constants.routes.vendor.accountSetup
      ) {
        return (
          <Redirect exact from="/" to={constants.routes.vendor.accountSetup} />
        );
      }

      if (
        profileSetupStep === constants.vendor.step.purchaseSubscription &&
        location.pathname !== constants.routes.vendor.vendorPurchaseSubscription
      ) {
        return (
          <Redirect
            exact
            from="/"
            to={constants.routes.vendor.vendorPurchaseSubscription}
          />
        );
      }

      if (
        profileSetupStep === constants.vendor.step.addCardDetails &&
        location.pathname !== constants.routes.vendor.cardSetup
      ) {
        return (
          <Redirect exact from="/" to={constants.routes.vendor.cardSetup} />
        );
      }

      if (
        profileSetupStep === constants.vendor.step.bankDetails &&
        location.pathname !== constants.routes.vendor.bankSetup
      ) {
        return (
          <Redirect exact from="/" to={constants.routes.vendor.bankSetup} />
        );
      }

      if (
        profileSetupStep === constants.vendor.step.completed &&
        (location.pathname == constants.routes.vendor.cardSetup ||
          location.pathname == constants.routes.vendor.accountSetup)
      ) {
        return <Redirect to="/" />;
      }

      const { date } =
        getStorage(constants.localStorageKeys.paymentMethod) || {};

      if (date && moment(moment().format("YYYY-MM-DD")).isSame(date)) {
        removeStorage([constants.localStorageKeys.paymentMethod]);
        return (
          <Redirect
            exact
            to={`${constants.routes.vendor.editProfile}?isCardView=true`}
          />
        );
      }
    }

    if (role?.systemRole === constants.systemRoles.patient) {
      const appointmentData = localStorage.getItem("book_appointment_data");
      if (appointmentData !== null) {
        const { doctorId, officeId, date } = JSON.parse(appointmentData);

        if (moment(moment().format("YYYY-MM-DD")).isSame(date)) {
          return (
            <Redirect
              exact
              from="/"
              to={{
                pathname: constants.routes.doctor,
                search: qs.stringify({ doctorId, officeId }),
              }}
            />
          );
        } else {
          localStorage.removeItem("book_appointment_data");
        }
      }

      let filledQuestionnaireData = sessionStorage.getItem(
        constants.localStorageKeys.filledQuestionnaireData
      );
      if (filledQuestionnaireData) {
        filledQuestionnaireData = JSON.parse(filledQuestionnaireData);
        const { DoctorId, OfficeId } = filledQuestionnaireData;
        return (
          <Redirect
            exact
            from="/"
            to={{
              pathname: constants.routes.questionnaireForm,
              search: qs.stringify({ doctorId: DoctorId, officeId: OfficeId }),
            }}
          />
        );
      }

      let waitingListFormData = sessionStorage.getItem(
        constants.localStorageKeys.waitingListFormData
      );
      if (waitingListFormData) {
        waitingListFormData = JSON.parse(waitingListFormData);
        const { doctorId, officeId } = waitingListFormData;
        return (
          <Redirect
            exact
            from="/"
            to={{
              pathname: constants.routes.watingListRequest,
              search: qs.stringify({ doctorId, officeId }),
            }}
          />
        );
      }

      let requestAppointmentData = sessionStorage.getItem(
        constants.localStorageKeys.requestAppointmentData
      );
      if (requestAppointmentData) {
        requestAppointmentData = JSON.parse(requestAppointmentData);
        const { isGoogleDoctor, doctorId, officeId, googleDoctor } =
          requestAppointmentData;
        if (isGoogleDoctor) {
          return (
            <Redirect
              exact
              from="/"
              to={{
                pathname: constants.routes.requestAnAppointment,
                state: {
                  doctor: googleDoctor,
                },
              }}
            />
          );
        } else {
          return (
            <Redirect
              exact
              from="/"
              to={{
                pathname: constants.routes.requestAnAppointment,
                search: qs.stringify({ doctorId, officeId }),
              }}
            />
          );
        }
      }

      if (countryId === null) {
        return <Redirect exact from="/" to={constants.routes.setLocation} />;
      }
    }

    const { roles: allowedSystemRoles } = this.props;
    if (allowedSystemRoles.includes(role?.systemRole)) {
      return (
        <Route
          exact={this.props.exact}
          component={this.props.component}
          path={this.props.path}
        />
      );
    }

    return (
      <>
        {role?.systemRole === constants.systemRoles.accountOwner && (
          <Redirect exact from="*" to="/404" />
        )}
        {role?.systemRole === constants.systemRoles.staff && (
          <Redirect exact from="/" to={constants.routes.staff.offices} />
        )}
        {role?.systemRole === constants.systemRoles.superAdmin && (
          <Redirect exact from="/" to="manage-owner" />
        )}
        {role?.systemRole === constants.systemRoles.patient && (
          <Redirect exact from="/" to={constants.routes.doctors} />
        )}
        {role?.systemRole === constants.systemRoles.vendor && (
          <Redirect exact from="/" to={constants.routes.vendor.dashboard} />
        )}
      </>
    );
  }
}

const mapStateToProps = ({ userProfile: { profile, isLoading } }) => ({
  profile,
  isLoading,
});

export default connect(mapStateToProps, null)(withRouter(PrivateRoutes));
