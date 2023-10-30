import React, { useEffect, useState, createContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
/*components*/
import Account from "pages/Auth/components/Account";
import Offices from "pages/Ofiices";
import AddOffice from "pages/Ofiices/AddOffice";
import Staff from "pages/Staff";
import StaffDetail from "pages/Staff/StaffDetail";
import AddStaff from "pages/Staff/AddStaff";
import App from "./App";
import axios from "axios";
import { createBrowserHistory } from "history";
import PrivateRoutes from "./privateRoute";
import Helper from "utils/helper";
import MobileApp from "components/MobileApp";
import EditProfile from "pages/Auth/components/EditProfile";
import Profile from "pages/Auth/components/Profile";
import DemoRequest from "pages/SuperAdmin/DemoRequest";
import BroadcastMessages from "pages/SuperAdmin/BroadcastMessages";
import AddBroadcastMessage from "pages/SuperAdmin/BroadcastMessages/AddMessage";
import BroadcastMessageDetail from "pages/SuperAdmin/BroadcastMessages/Detail";
import ManageTestimonial from "pages/SuperAdmin/Testimonianls/ManageTestimonial";
import AddTestimonial from "pages/SuperAdmin/Testimonianls/AddTestimonial";
import Privacy from "pages/PrivacyPolicy";
import PrivacyPolicyPatient from "pages/PrivacyPolicyPatient";
import StaffRoles from "pages/StaffRoles";
import ManageContent from "pages/SuperAdmin/ManageContent";
import Terms from "pages/TermsCondtion";
import TermsCondtionPatient from "pages/TermsCondtionPatient";
import ChangePassword from "pages/Change-Password";
import NotFound from "components/notFound";
import CardDetails from "pages/Subscription/Card";
import AccountManageSubscription from "pages/Subscription/ManageSubscription";
import AddSubscription from "pages/Subscription/AddSubscription";
import SubscriptionMangement from "pages/Subscription/Mangement";
import PlanDetail from "pages/Subscription/PlanDetail";
import EnterPrisePlans from "pages/Subscription/EnterPrisePlans";
import AddEnterPrisePlan from "pages/Subscription/AddEnterprisePlan";
import EnterPriseOwners from "pages/Subscription/EnterpriseOwners";
import AddOwner from "pages/Subscription/AddOwner";
import EditPlans from "pages/Subscription/EditPlan";
import SubscriptionPlans from "pages/Subscription/SubPlans";
import SelectOffice from "pages/Ofiices/SelectOffices";
import MangeHolidays from "pages/Holidays/MangeHolidays";
import ManageCards from "pages/Subscription/ManageCards";
import ChangeCard from "pages/Subscription/ChangeCard";
import StaffList from "pages/SuperAdmin/Account-owner/StaffList";
import AccountOwnerRoutes from "pages/SuperAdmin/Account-owner/AccountOwnerRoutes";
import PersonnelRoutes from "pages/SuperAdmin/Personnel/PersonnelRoutes";
import AppVersionList from "pages/SuperAdmin/AppVersion/List";
import constants from "./../constants";
import AppVersionForm from "pages/SuperAdmin/AppVersion/Form";
import SpecialtyList from "pages/SuperAdmin/Specialty/List";
import SpecialtyForm from "pages/SuperAdmin/Specialty/Form";
import Doctors from "../patient-scheduling/pages/Doctors";
import SearchDoctorBySpecialty from "../patient-scheduling/pages/SearchDoctorBySpecialty";
import SetLocation from "../patient-scheduling/pages/SetLocation";
import DoctorOffices from "../patient-scheduling/pages/Offices";
import Timesheet from "staff/pages/Timesheet";
import TimesheetView from "staff/pages/TimesheetView";
import TimesheetViewDetails from "staff/pages/TimesheetViewDetails";

import { config, parameters, options } from "services/authProvider";
import { MsalAuthProvider } from "react-aad-msal";
import StaffOffices from "staff/pages/Offices";
import StaffOfficeOptions from "staff/pages/StaffOfficeOptions";
import AccountAdmin from "staff/pages/AccountAdmin";
import OfficeContracts from "staff/pages/OfficeContracts";
import ViewContract from "staff/pages/ViewContract";

import OfficeOptions from "accountOwner/pages/OfficeOptions";
import Preferences from "accountOwner/pages/Preferences";
import DefineGeoFence from "accountOwner/pages/DefineGeoFence";
import PatientList from "pages/SuperAdmin/PatientList";
import Reviews from "pages/SuperAdmin/Reviews";
import PatientReviews from "pages/SuperAdmin/PatientReviews";
import Contracts from "accountOwner/pages/Contracts";
import StaffContracts from "accountOwner/pages/Contracts/staffContracts";
import NewEmploymentContract from "accountOwner/pages/NewEmploymentContract";
import DoctorDetail from "patient-scheduling/pages/DoctorDetail";
import DoctorReviews from "pages/SuperAdmin/DoctorReviews";
import DoctorReviewsByOffice from "patient-scheduling/pages/Reviews";
import OwnerViewContract from "accountOwner/pages/OwnerViewContract";
import HourlyRateHistory from "pages/Staff/HourlyRateHistory";
import AddEvent from "accountOwner/pages/AddEvent";
import EventDetails from "accountOwner/pages/EventDetails";
import EventRequestDetails from "accountOwner/pages/EventRequestDetails";
import Scheduler from "accountOwner/pages/Scheduler";
import RequestAnAppointment from "patient-scheduling/pages/RequestAppointment";
import AddBusySlots from "BusySlots/AddBusySlots";
import BusySlotsDetail from "BusySlots/BusySlotsDetail";
import Notification from "notification/index";
import EventWorkingDetails from "accountOwner/pages/EventWorkingDetails";
import EditEvent from "accountOwner/pages/EditEvent";
import ManageCatalogue from "VendorManagement/pages/ManageCatalogue";
import AddNewItem from "VendorManagement/pages/ManageCatalogue/AddNewItem";
import CatalogueDetail from "VendorManagement/pages/ManageCatalogue/CatalogueDetail";
import TopUp from "VendorManagement/pages/TopUp";
import EditBusySlot from "BusySlots/EditBusySlot";
import SupportHelpdesk from "VendorManagement/pages/SupportHelpdesk";
import AddNewTicket from "VendorManagement/pages/SupportHelpdesk/AddNewTicket";
import VendorTicketDetail from "VendorManagement/pages/SupportHelpdesk/TicketDetail";
import CustomerDetail from "VendorManagement/pages/ManageCustomers/CustomerDetail";
import ManageCustomers from "VendorManagement/pages/ManageCustomers";
import Dashboard from "VendorManagement/pages/Dashboard";
import VendorProfile from "VendorManagement/pages/Dashboard/VendorProfile";
import ManageOrders from "VendorManagement/pages/ManageOrders";
import OrderDetail from "VendorManagement/pages/ManageOrders/OrderDetail";
import HelpPage from "Help";
import FeedbackPage from "Feedback";
import EventDetailsOnly from "../accountOwner/pages/EventDetailsOnly";
import OnlineHelp from "Help/OnlineHelp/OnlineHelp";
import Faq from "../Help/FAQ";
import InviteCustomers from "VendorManagement/pages/ManageCustomers/InviteCustomers";
import PromoCodes from "VendorManagement/pages/PromoCodes";
import AddNewPromoCode from "VendorManagement/pages/PromoCodes/AddNewPromoCode";
import ManageSaleRep from "VendorManagement/pages/ManageSaleRep";
import InviteNewSalesRep from "VendorManagement/pages/ManageSaleRep/InviteNewSalesRep";
import EditSalesRep from "VendorManagement/pages/ManageSaleRep/EditSalesRep";
import SalesRepDetail from "VendorManagement/pages/ManageSaleRep/SalesRepDetail";
import WaitingListForm from "patient-scheduling/pages/WaitingListForm";
import AppointmentRequests from "pages/SuperAdmin/AppointmentRequests";
import AppointmentRequestDetail from "pages/SuperAdmin/AppointmentRequestDetail";
import TeamConversation from "Messenger/pages/TeamConversation";
import Feedback from "../pages/SuperAdmin/FeedBack";
import FeedBackView from "../pages/SuperAdmin/FeedBack/FeedBackView";
import Promotion from "VendorManagement/pages/Promotion";
import PromotionDetail from "VendorManagement/pages/Promotion/PromotionDetail";
import AddNewPromotion from "VendorManagement/pages/Promotion/AddNewPromotion";
import ManageInvoices from "VendorManagement/pages/ManageInvoices";
import DownloadIcs from "pages/DownloadIcs";
import QuestionnaireForm from "patient-scheduling/pages/QuestionnaireForm";
import SupportHelp from "pages/SuperAdmin/Support-help";
import TicketDetail from "pages/SuperAdmin/Support-help/TicketDetail";
import EditSubscription from "pages/SuperAdmin/Account-owner/SubscriptionAndInvoices/EditSubscription";
import ManageCategories from "pages/SuperAdmin/VendorManagement/ManageCategories";
import TaxManagement from "pages/SuperAdmin/VendorManagement/TaxManagement";
import ManageSalesRep from "pages/SuperAdmin/VendorManagement/ManageSalesRep";
import ManageVendors from "pages/SuperAdmin/VendorManagement/ManageVendors";
import viewVendorDetails from "pages/SuperAdmin/VendorManagement/ManageVendors/components/VendorDetailTabs/ViewVendorDetails";
import VendorDetailTabs from "pages/SuperAdmin/VendorManagement/ManageVendors/components/VendorDetailTabs";
import VendorAccountSetup from "VendorManagement/pages/SetupAccount";
import ManageTopUp from "pages/SuperAdmin/VendorManagement/ManageTopUp";
import HelpDesk from "pages/SuperAdmin/VendorManagement/HelpDesk";
import AddCreditDetails from "VendorManagement/pages/AddBankDetails";
import AddBankDetails from "VendorManagement/pages/AddBankDetails/AddBankDetails";
import TicketDetails from "pages/SuperAdmin/VendorManagement/HelpDesk/TicketDetails";
import VendorEditProfile from "VendorManagement/pages/EditProfile/EditProfile";
import useHubspot from "hooks/useHubspot";
import PrivacyPolicyVendor from "pages/PrivacyPolicyVendor";
import TermsCondtionVendor from "pages/TermsCondtionVendor";
import ManageCommissions from "pages/SuperAdmin/VendorManagement/ManageCommissions";
import StaffListingTimesheet from "staff/pages/StaffListingTimesheet";
import TimesheetDetail from "staff/pages/StaffListingTimesheet/component/TimesheetDetail";
import TimesheetDateDetail from "staff/pages/StaffListingTimesheet/component/TimesheetDateDetail";
import StaffListingLeaves from "staff/pages/StaffListingLeaves";
import ApplyLeaves from "staff/pages/Leaves/component/ApplyLeaves";
import ManageSalesRepAdmin from "pages/SuperAdmin/VendorManagement/ManageSalesRep";
import FamilyMembers from "patient-scheduling/pages/FamilyMembers";
import AddEditMembers from "patient-scheduling/pages/FamilyMembers/components/AddEditMembers";
import ViewMemberDetail from "patient-scheduling/pages/FamilyMembers/components/ViewMemberDetail";
import PaymentSuccees from "VendorManagement/pages/PaymentSuccess";
import PaymentFailed from "pages/PaymentFailed";
import ViewFeatures from "pages/Subscription/ViewFeatures";
import AccountBasicSubscription from "pages/Subscription/AccountBasicSubscription";
import EditAccountBasicSubscription from "pages/Subscription/EditAccountBasicSubscription";
import ManageFeatures from "pages/Subscription/ManageFeatures";
import EditBasicSubscription from "pages/SuperAdmin/Account-owner/SubscriptionAndInvoices/EditBasicSubscription";
import UpdateSubscriptionModel from "components/UpdateSubscriptionModel";
import FindDoctors from "pages/FindDoctors";
import MoveToOfficeStaff from "pages/MoveToOfficeStaff";
import VendorSubscriptionPlans from "pages/SuperAdmin/VendorSubscriptionPlans";
// import TrialSubscription from 'pages/SuperAdmin/VendorSubscriptionPlans/components/TrialSubscription';
import BasicSubscription from "pages/SuperAdmin/VendorSubscriptionPlans/components/BasicSubscription";
import EditVendorSubscription from "pages/SuperAdmin/VendorSubscriptionPlans/components/BasicSubscription/EditVendorSubscription";
import EnterpriseSubscription from "pages/SuperAdmin/VendorSubscriptionPlans/components/EnterpriseSubscription";
import AddNewPlan from "pages/SuperAdmin/VendorSubscriptionPlans/components/EnterpriseSubscription/components/AddNewPlan";
import AddNewVendor from "pages/SuperAdmin/VendorSubscriptionPlans/components/EnterpriseSubscription/components/EnterpriseSubscriptionDetails/components/AddNewVendor";
import EnterPriseSubscriptionDetail from "pages/SuperAdmin/VendorSubscriptionPlans/components/EnterpriseSubscription/components/EnterpriseSubscriptionDetails/EnterPriseSubscriptionDetail";
import VendorSubscriptionDetail from "pages/SuperAdmin/VendorManagement/ManageVendors/components/VendorDetailTabs/VendorSubscriptionDetail";
import EditSubscriptionforVendors from "pages/SuperAdmin/VendorManagement/ManageVendors/components/VendorDetailTabs/EditSubscriptionforVendors";
import VendorTransactionHistory from "pages/SuperAdmin/VendorManagement/ManageVendors/components/VendorDetailTabs/VendorTransactionHistory";
import ManageVendorSubscription from "VendorManagement/pages/ManageVendorSubscription";
import ManageVendorCard from "VendorManagement/pages/ManageVendorSubscription/components/ManageVendorCard";
import ChangeSubscription from "VendorManagement/pages/ManageVendorSubscription/components/ChangeSubscription";
import VendorFreeTrial from "VendorManagement/VendorFreeTrial";
import EditVendorCards from "VendorManagement/pages/ManageVendorSubscription/components/EditVendorCards";
import CustomErorPage from "components/CustomErrorPage";
import { useHistory } from "react-router-dom";
import * as Sentry from "@sentry/react";

const history = createBrowserHistory();

const dashboardRoute = (isInterceptorInitialized) => (
  <App path="/" history={history}>
    <AllRoutes isInterceptorInitialized={isInterceptorInitialized} />
  </App>
);

function AllRoutes({ isInterceptorInitialized }) {
  if (!isInterceptorInitialized) {
    return null;
  }

  return (
    <Switch>
      {/* Vendor Module Pages */}
      <PrivateRoutes
        component={Dashboard}
        path={constants.routes.vendor.dashboard}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={ManageOrders}
        path={constants.routes.vendor.manageOrders}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={ManageCatalogue}
        path={constants.routes.vendor.manageCatalogue}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={ManageCustomers}
        path={constants.routes.vendor.manageCustomers}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={Promotion}
        path={constants.routes.vendor.promotion}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={PromoCodes}
        path={constants.routes.vendor.promoCodes}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={TopUp}
        path={constants.routes.vendor.topup}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={ManageVendorSubscription}
        path={constants.routes.vendor.manageSubscription}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={ChangeSubscription}
        path={constants.routes.vendor.changeSubscription}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={ManageVendorCard}
        path={constants.routes.vendor.manageVendorCards}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={EditVendorCards}
        path={constants.routes.vendor.editVendorCards}
        roles={[constants.systemRoles.vendor]}
      />

      <PrivateRoutes
        component={SupportHelpdesk}
        path={constants.routes.vendor.supportHelpdesk}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={ManageSaleRep}
        path={constants.routes.vendor.manageSalesRep}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={ManageInvoices}
        path={constants.routes.vendor.manageInvoices}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={PaymentSuccees}
        path={constants.routes.vendor.paymentSuccess}
        roles={[constants.systemRoles.vendor]}
      />

      <PrivateRoutes
        component={AddNewItem}
        path={constants.routes.vendor.addNewItem}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={CatalogueDetail}
        path={constants.routes.vendor.catalogueDetail}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={AddNewTicket}
        path={constants.routes.vendor.addNewTicket}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={VendorTicketDetail}
        path={constants.routes.vendor.ticketDetail}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={CustomerDetail}
        path={constants.routes.vendor.customerDetail}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={InviteCustomers}
        path={constants.routes.vendor.inviteCustomers}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={VendorProfile}
        path={constants.routes.vendor.vendorProfile}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={OrderDetail}
        path={constants.routes.vendor.orderDetail}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={AddNewPromoCode}
        path={constants.routes.vendor.addPromoCode}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={AddNewPromotion}
        path={constants.routes.vendor.addPromotion}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={PromotionDetail}
        path={constants.routes.vendor.promotionDetail}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={InviteNewSalesRep}
        path={constants.routes.vendor.inviteSalesRep}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={EditSalesRep}
        path={constants.routes.vendor.editSalesRep}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={SalesRepDetail}
        path={constants.routes.vendor.salesRepDetail}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={VendorAccountSetup}
        path={constants.routes.vendor.accountSetup}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={VendorEditProfile}
        path={constants.routes.vendor.editProfile}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={AddCreditDetails}
        path={constants.routes.vendor.cardSetup}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={AddBankDetails}
        path={constants.routes.vendor.bankSetup}
        roles={[constants.systemRoles.vendor]}
      />
      <PrivateRoutes
        component={VendorFreeTrial}
        path={constants.routes.vendor.vendorPurchaseSubscription}
        roles={[constants.systemRoles.vendor]}
      />

      {/* Account Owner Profile setup pages */}
      <PrivateRoutes
        component={Account}
        path={constants.routes.account}
        roles={[constants.systemRoles.accountOwner]}
      />
      <PrivateRoutes
        component={AddSubscription}
        path={constants.routes.addSubscription}
        roles={[constants.systemRoles.accountOwner]}
      />
      <PrivateRoutes
        component={CardDetails}
        path={constants.routes.setupCard}
        roles={[constants.systemRoles.accountOwner]}
      />

      <PrivateRoutes
        component={EditProfile}
        path="/edit-profile"
        roles={[
          constants.systemRoles.superAdmin,
          constants.systemRoles.accountOwner,
        ]}
      />
      <PrivateRoutes
        component={Profile}
        path="/profile"
        roles={[
          constants.systemRoles.staff,
          constants.systemRoles.accountOwner,
        ]}
      />
      <PrivateRoutes
        component={Offices}
        path="/Offices"
        roles={[constants.systemRoles.accountOwner]}
      />
      <PrivateRoutes
        component={SelectOffice}
        path="/Select-Office"
        roles={[constants.systemRoles.accountOwner]}
      />
      <PrivateRoutes
        component={AddOffice}
        path={["/AddOffice", "/editOffice"]}
        roles={[constants.systemRoles.accountOwner]}
      />
      <PrivateRoutes
        component={AddStaff}
        path={["/AddStaff/:id", "/editStaff/:id"]}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={Staff}
        path="/Staff/:id"
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={StaffDetail}
        path="/staff-detail"
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={HourlyRateHistory}
        path="/hourly-rate-history"
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={MobileApp}
        path="/app"
        roles={[constants.systemRoles.staff]}
      />
      <PrivateRoutes
        exact
        component={StaffList}
        path="/office/:officeId/staff"
        roles={[constants.systemRoles.superAdmin]}
      />

      {/* Contract pages */}
      <PrivateRoutes
        component={Contracts}
        path={constants.routes.accountOwner.contracts}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={StaffContracts}
        path={constants.routes.accountOwner.staffContracts}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={NewEmploymentContract}
        path={constants.routes.accountOwner.newContract}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={NewEmploymentContract}
        path={constants.routes.accountOwner.editContract}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        exact
        component={OwnerViewContract}
        path={constants.routes.accountOwner.viewContract}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />

      <PrivateRoutes
        component={AccountOwnerRoutes}
        path={[
          "/manage-owner",
          "/account-owner/:accountOwnerId",
          "/account-owner/:accountOwnerId/transaction-history",
          "/account-owner/:accountOwnerId/subscription-and-invoices",
        ]}
        roles={[constants.systemRoles.superAdmin]}
      />

      <PrivateRoutes
        component={PatientList}
        path={constants.routes.superAdmin.patientList}
        roles={[constants.systemRoles.superAdmin]}
      />

      <PrivateRoutes
        component={PersonnelRoutes}
        path={["/manage-personnel", "/personnel/:personnelId"]}
        roles={[constants.systemRoles.superAdmin]}
      />

      {/*  Appointment Request List for SuperAdmin*/}
      <PrivateRoutes
        exact
        component={AppointmentRequests}
        path={constants.routes.superAdmin.appointmentRequestList}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        exact
        component={AppointmentRequestDetail}
        path={constants.routes.superAdmin.appointmentRequestDetail}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={Feedback}
        path={constants.routes.superAdmin.feedback}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={FeedBackView}
        path={constants.routes.superAdmin.feedbackView}
        roles={[constants.systemRoles.superAdmin]}
      />

      {/* Chat Messanger for Account Owner and Staff */}
      <PrivateRoutes
        component={TeamConversation}
        path={constants.routes.chatModule}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />

      {/* App Version */}
      <PrivateRoutes
        exact
        component={AppVersionList}
        path={constants.routes.appVersionList}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        exact
        component={AppVersionForm}
        path={constants.routes.appVersionForm}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        exact
        component={AppVersionForm}
        path={constants.routes.appVersionForm + "/:appVersionId"}
        roles={[constants.systemRoles.superAdmin]}
      />

      {/* Speciality */}
      <PrivateRoutes
        exact
        component={SpecialtyList}
        path={constants.routes.specialtyList}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        exact
        component={SpecialtyForm}
        path={constants.routes.specialtyForm}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        exact
        component={SpecialtyForm}
        path={constants.routes.specialtyForm + "/:specialtyId"}
        roles={[constants.systemRoles.superAdmin]}
      />

      <PrivateRoutes
        component={StaffRoles}
        path="/staff-roles"
        roles={[
          constants.systemRoles.superAdmin,
          constants.systemRoles.accountOwner,
        ]}
      />

      {/* Patient Scheduling */}
      <Route exact component={Doctors} path={constants.routes.doctors} />
      <Route
        exact
        component={SearchDoctorBySpecialty}
        path={constants.routes.searchDoctorBySpecialty}
      />
      <Route exact component={DoctorDetail} path={constants.routes.doctor} />
      <Route
        exact
        component={WaitingListForm}
        path={constants.routes.watingListRequest}
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
        component={RequestAnAppointment}
        path={constants.routes.requestAnAppointment}
      />
      <Route
        component={QuestionnaireForm}
        path={constants.routes.questionnaireForm}
      />
      <Route component={FamilyMembers} path={constants.routes.familyMembers} />
      <Route component={AddEditMembers} path={constants.routes.addNewMember} />
      <Route component={AddEditMembers} path={constants.routes.editMember} />
      <Route component={ViewMemberDetail} path={constants.routes.viewMember} />

      {/* Common  */}
      <Route
        exact
        component={DownloadIcs}
        path={constants.routes.downloadIcs}
      />

      <PrivateRoutes
        component={ManageContent}
        path="/manage-content"
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={ManageSalesRepAdmin}
        path={constants.routes.superAdmin.manageSalesRepAdmin}
        roles={[constants.systemRoles.superAdmin]}
      />

      <PrivateRoutes
        component={ChangePassword}
        path="/change-password"
        roles={[
          constants.systemRoles.superAdmin,
          constants.systemRoles.accountOwner,
        ]}
      />
      <PrivateRoutes
        component={SubscriptionMangement}
        path="/subscription-management"
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={EnterPrisePlans}
        path="/enterprise-plans"
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={AddEnterPrisePlan}
        path={["/add-enterprise-plan", "/edit-enterprise-plan"]}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={PlanDetail}
        path={["/single-office", "/multiple-office"]}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={AccountBasicSubscription}
        path={constants.routes.superAdmin.accountBasicSubscription}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={EditAccountBasicSubscription}
        path={constants.routes.superAdmin.editAccountBasicSubscription}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={ManageFeatures}
        path={constants.routes.superAdmin.manageFeatures}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={EnterPriseOwners}
        path="/owners/:id"
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={AddOwner}
        path={["/add-owner/:id", "/edit-owner/:id"]}
        roles={[constants.systemRoles.superAdmin]}
      />

      <PrivateRoutes
        component={EditPlans}
        path="/edit-plan/:id"
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={AccountManageSubscription}
        path="/manage-plan"
        roles={[constants.systemRoles.accountOwner]}
      />
      <PrivateRoutes
        component={SubscriptionPlans}
        path="/change-plan"
        roles={[constants.systemRoles.accountOwner]}
      />
      <PrivateRoutes
        component={MangeHolidays}
        path="/manage-holidays"
        roles={[
          constants.systemRoles.superAdmin,
          constants.systemRoles.accountOwner,
        ]}
      />
      <PrivateRoutes
        component={DemoRequest}
        path="/demo-request"
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={BroadcastMessages}
        path={constants.routes.superAdmin.broadCastMessages}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={AddBroadcastMessage}
        path={constants.routes.superAdmin.createBroadCastMessage}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={BroadcastMessageDetail}
        path="/broadcast-message-detail/:id"
        roles={[constants.systemRoles.superAdmin]}
      />

      {/* Reviews */}
      <PrivateRoutes
        exact
        component={Reviews}
        path={constants.routes.superAdmin.reviews}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        exact
        component={DoctorReviews}
        path={constants.routes.superAdmin.doctorReviews}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        exact
        component={PatientReviews}
        path={constants.routes.superAdmin.patientReviews}
        roles={[constants.systemRoles.superAdmin]}
      />

      <PrivateRoutes
        component={ManageTestimonial}
        path="/manage-testimonial"
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={AddTestimonial}
        path={["/add-testimonial", "/edit-testimonial"]}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={ChangeCard}
        path="/change-card-detail/:id"
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.vendor,
        ]}
      />
      <PrivateRoutes
        component={ManageCards}
        path={constants.routes.accountOwner.manageCards}
        roles={[constants.systemRoles.accountOwner]}
      />
      <PrivateRoutes
        component={ViewFeatures}
        path={constants.routes.accountOwner.viewFeatures}
        roles={[constants.systemRoles.accountOwner]}
      />

      {/* Office related  */}
      <PrivateRoutes
        exact
        component={OfficeOptions}
        path={constants.routes.accountOwner.officeOptions}
        roles={[constants.systemRoles.accountOwner]}
      />
      <PrivateRoutes
        exact
        component={Preferences}
        path={constants.routes.accountOwner.preferences}
        roles={[constants.systemRoles.accountOwner]}
      />
      <PrivateRoutes
        exact
        component={DefineGeoFence}
        path={constants.routes.accountOwner.geoFence}
        roles={[constants.systemRoles.accountOwner]}
      />

      <PrivateRoutes
        component={StaffOffices}
        path={constants.routes.staff.offices}
        roles={[constants.systemRoles.staff]}
      />
      <PrivateRoutes
        exact
        component={StaffOfficeOptions}
        path={constants.routes.staff.officeOptions}
        roles={[constants.systemRoles.staff]}
      />
      <PrivateRoutes
        exact
        component={OfficeContracts}
        path={constants.routes.staff.officeContracts}
        roles={[constants.systemRoles.staff]}
      />
      <PrivateRoutes
        exact
        component={ViewContract}
        path={constants.routes.staff.viewContract}
        roles={[constants.systemRoles.staff]}
      />
      <PrivateRoutes
        exact
        component={AccountAdmin}
        path={constants.routes.staff.officeAdmin}
        roles={[constants.systemRoles.staff]}
      />
      <PrivateRoutes
        component={Timesheet}
        path={constants.routes.staff.timesheet}
        roles={[constants.systemRoles.staff]}
      />
      <PrivateRoutes
        component={StaffListingTimesheet}
        path={constants.routes.staff.staffListingTimesheet}
        roles={[
          constants.systemRoles.staff,
          constants.systemRoles.accountOwner,
        ]}
      />
      <PrivateRoutes
        component={TimesheetDateDetail}
        path={constants.routes.staff.timesheetDateDetail}
        roles={[
          constants.systemRoles.staff,
          constants.systemRoles.accountOwner,
        ]}
      />
      <PrivateRoutes
        component={TimesheetDetail}
        path={constants.routes.staff.timesheetDetail}
        roles={[
          constants.systemRoles.staff,
          constants.systemRoles.accountOwner,
        ]}
      />
      <PrivateRoutes
        component={TimesheetView}
        path={constants.routes.staff.timesheetSummary}
        roles={[constants.systemRoles.staff]}
      />
      <PrivateRoutes
        component={TimesheetViewDetails}
        path={constants.routes.staff.timesheetViewDetail}
        roles={[constants.systemRoles.staff]}
      />
      <PrivateRoutes
        component={StaffListingLeaves}
        path={constants.routes.staff.leaves}
        roles={[
          constants.systemRoles.staff,
          constants.systemRoles.accountOwner,
        ]}
      />
      <PrivateRoutes
        component={ApplyLeaves}
        path={constants.routes.staff.applyLeaves}
        roles={[constants.systemRoles.staff]}
      />

      {/* Scheduler related  */}
      <PrivateRoutes
        component={Scheduler}
        path={constants.routes.scheduler.calendar}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={AddEvent}
        path={constants.routes.scheduler.addEvent}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={EventDetails}
        path={constants.routes.scheduler.eventDetails}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={AddBusySlots}
        path={constants.routes.scheduler.addBusySlot}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={EditBusySlot}
        path={constants.routes.scheduler.editBusySlot}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={EventDetailsOnly}
        path={constants.routes.scheduler.eventDetailsOnly}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />

      {/* EditBusySlot */}
      <PrivateRoutes
        component={BusySlotsDetail}
        path={constants.routes.scheduler.busySlotDetail}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={EventRequestDetails}
        path={constants.routes.scheduler.eventRequestDetails}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={EventWorkingDetails}
        path={constants.routes.scheduler.EventWorkingDetails}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={EditEvent}
        path={constants.routes.scheduler.editEvent}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />

      {/* Help and Feedback Modules */}
      <Route exact component={HelpPage} path={constants.routes.help} />
      <Route exact component={Faq} path={constants.routes.faq} />
      <Route exact component={OnlineHelp} path={constants.routes.onlineHelp} />

      <PrivateRoutes
        exact
        component={FeedbackPage}
        path={constants.routes.feedback}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
          constants.systemRoles.patient,
        ]}
      />

      <PrivateRoutes
        component={Notification}
        path={constants.routes.notification.notificationDetail}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.staff,
        ]}
      />
      <PrivateRoutes
        component={SupportHelp}
        path={constants.routes.superAdmin.SupportAndHelp}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={TicketDetail}
        path={constants.routes.superAdmin.supportTicketDetail}
        roles={[constants.systemRoles.superAdmin]}
      />

      {/* {Subscription module} */}
      <PrivateRoutes
        component={EditSubscription}
        path={constants.routes.superAdmin.editSubscription}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={EditBasicSubscription}
        path={constants.routes.superAdmin.editBasicSubscription}
        roles={[constants.systemRoles.superAdmin]}
      />

      {/* superAdmin vendor section */}
      <PrivateRoutes
        component={HelpDesk}
        path={constants.routes.superAdmin.helpDesk}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={ManageCategories}
        path={constants.routes.superAdmin.categories}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={TaxManagement}
        path={constants.routes.superAdmin.tax}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={ManageSalesRep}
        path={constants.routes.superAdmin.sales}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={ManageVendors}
        path={constants.routes.superAdmin.manageVendors}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={VendorSubscriptionPlans}
        path={constants.routes.superAdmin.vendorSubscriptionPlans}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={VendorDetailTabs}
        path={constants.routes.superAdmin.VendorDetails}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={viewVendorDetails}
        path={constants.routes.superAdmin.VendorProfile}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={ManageTopUp}
        path={constants.routes.superAdmin.TopUpPromotions}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={TicketDetails}
        path={constants.routes.superAdmin.ticketDetails}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={ManageCommissions}
        path={constants.routes.superAdmin.manageCommissions}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={PaymentFailed}
        path={constants.routes.paymentfailed}
        roles={[
          constants.systemRoles.accountOwner,
          constants.systemRoles.vendor,
        ]}
      />
      <PrivateRoutes
        component={FindDoctors}
        path={constants.routes.findDoctors}
        roles={[constants.systemRoles.patient]}
      />
      <PrivateRoutes
        component={MoveToOfficeStaff}
        path={constants.routes.officeStaffs}
        roles={[constants.systemRoles.staff]}
      />

      <PrivateRoutes
        component={BasicSubscription}
        path={constants.routes.superAdmin.vendorSubscriptionView}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={EnterpriseSubscription}
        path={constants.routes.superAdmin.enterpriseSubscription}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={EditVendorSubscription}
        path={constants.routes.superAdmin.editVendorSubscription}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={AddNewPlan}
        path={[
          constants.routes.superAdmin.addNewPlan,
          constants.routes.superAdmin.editEnterPricePlan,
        ]}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={EnterPriseSubscriptionDetail}
        path={constants.routes.superAdmin.enterpriseSubscriptionDetails}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={AddNewVendor}
        path={[
          constants.routes.superAdmin.addNewVendor,
          constants.routes.superAdmin.editAssignedVendor,
        ]}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={VendorSubscriptionDetail}
        path={constants.routes.superAdmin.vendorSubscriptionDetails}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={EditSubscriptionforVendors}
        path={constants.routes.superAdmin.editSubscriptionForVendors}
        roles={[constants.systemRoles.superAdmin]}
      />
      <PrivateRoutes
        component={VendorTransactionHistory}
        path={constants.routes.superAdmin.vendorTransactionHistory}
        roles={[constants.systemRoles.superAdmin]}
      />

      {/* viewVendorDetails */}
      {/* superAdmin vendor section */}

      {/* SupportHelp */}
      <Redirect exact from="/" to="Offices" />
      <Route component={NotFound} path="/404" />
      <Route component={CustomErorPage} path="/error" />
      <Redirect from="*" to="/404" />
    </Switch>
  );
}

export const Store = createContext();
const Routes = () => {
  const pageHistory = useHistory();

  const [isBack, setIsBack] = useState("");
  const [isSubscriptionModel, setIsSubscriptionModel] = useState(false);
  const [isModelOpenForNotification, setIsModelOpenForNotification] =
    useState(false);

  const [isInterceptorInitialized, setIsInterceptorInitialized] =
    useState(false);
  useHubspot();
  useEffect(() => {
    if (Helper.isLoggedIn()) {
      const token = localStorage.getItem("msal.idtoken");
      axios.interceptors.request.use((request) => {
        request.headers.Authorization = `Bearer ${token}`;
        return request;
      });

      axios.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          if (error.response) {
            if (401 === error.response.status) {
              new MsalAuthProvider(config, parameters, options).logout();
            }

            if (
              error.response.status === 403 ||
              error.response.status === 500
            ) {
              pageHistory.push("/error");
            }

            if (error.response.status >= 400) {
              Sentry.captureException(error.response);
            }
          }

          return Promise.reject(error);
        }
      );

      setIsInterceptorInitialized(true);
    }
  }, []);

  return (
    <Store.Provider
      value={{
        isBack,
        setIsBack,
        isSubscriptionModel,
        setIsSubscriptionModel,
        isModelOpenForNotification,
        setIsModelOpenForNotification,
      }}
    >
      <UpdateSubscriptionModel />
      <Route render={() => dashboardRoute(isInterceptorInitialized)} />
    </Store.Provider>
  );
};
export default Routes;
