const constants = {
  subscriptionTerminated: "subscriptionTerminated",
  staffActionEvents: {
    activation: 0,
    deactivation: 1,
    removal: 2,
    removalAsAdmin: 3,
  },
  packageTypes: {
    trial: "trial",
    free: "free",
  },
  routes: {
    home: "/",
    paymentfailed: "/paymentfailed",
    findDoctors: "/find-doctors",
    officeStaffs: "/offices-Staff",
    appVersionList: "/app-version",
    appVersionForm: "/app-version/form",
    specialtyList: "/specialty",
    specialtyForm: "/specialty/form",
    account: "/account",
    addSubscription: "/add-subscription",
    paymentDetailsNew: "/payment-details-new",
    setupCard: "/setup-card",
    doctors: "/doctors",
    searchDoctorBySpecialty: "/doctor-by-specialty",
    doctor: "/doctor",
    watingListRequest: "/doctor/waiting-list-form",
    setLocation: "/set-location",
    doctorOffices: "/doctor/:doctorId/offices",
    editProfile: "/edit-profile",
    changePassword: "/change-password",
    termsAndConditions: "/terms-conditions",
    privacyPolicy: "/privacy-policy",
    termsAndConditionsPatient: "/terms-conditions-for-patient",
    privacyPolicyPatient: "/privacy-policy-for-patient",
    viewProfile: "/profile",
    doctorReviews: "/doctor/reviews",
    requestAnAppointment: "/doctor/request-appointment",
    downloadIcs: "/download-ics",
    chatModule: "/team-conversation",
    questionnaireForm: "/questionnaire-form",
    getStarted: "/getstarted",
    familyMembers: "/family-members",
    addNewMember: "/add-new-member",
    editMember: "/edit-member/:memberId",
    viewMember: "/view-member/:memberId",
    demoRequestPage: "/demo-request-page",
    demoRequestThank: "/demo-request-thank-page",

    blogs: {
      blog1: "/blogs/9-reasons-why-dentists-are-automating-their-practice",
      blog2: "/blogs/top-9-ways-for-you-and-your-staff-to-avoid-burnout",
      blog3:
        "/blogs/top-9-benefits-of-streamlining-and-automating-workflows-in-your-dental-practice",
      blog4:
        "/blogs/communication-with-your-team-how-to-be-hands-offand-still-be-hands-on",
      blog5:
        "/blogs/3-effective-ways-technology-can-help-you-efficiently-manage-staff-in-your-practice",
      blog6:
        "/blogs/8-ways-leading-dental-practices-enhance-their-staff-experience",
      blog7: "/blogs/6-ways-to-recruit-and-retain-practice-employees-in-2023",
    },
    landingPages: {
      guideDownloadPage: "/landing-pages/guide-download-page",
      guideThankPage: "/landing-pages/guide-thank-page",
      ebookDownloadPage: "/landing-pages/ebook-download-page",
      ebookThankPage: "/landing-pages/ebook-thank-page",
      guideDownloadPageFb: "/landing-pages/guide-download-page-fb",
      guideDownloadPageGgl: "/landing-pages/guide-download-page-ggl",
      guideDownloadPageSm: "/landing-pages/guide-download-page-sm",
      ebookDownloadPageFb: "/landing-pages/ebook-download-page-fb",
      ebookDownloadPageGgl: "/landing-pages/ebook-download-page-ggl",
      ebookDownloadPageSm: "/landing-pages/ebook-download-page-sm",
    },
    vendor: {
      dashboard: "/vendor-dashboard",
      manageOrders: "/manage-orders",
      manageCatalogue: "/manage-catalogue",
      manageCustomers: "/manage-customers",
      promotion: "/promotion",
      promoCodes: "/promocodes",
      topup: "/topup",
      supportHelpdesk: "/support-helpdesk",
      manageSalesRep: "/manage-sales-rep",
      manageInvoices: "/manage-invoices",
      addNewItem: "/add-new-item",
      catalogueDetail: "/catalogue-detail",
      addNewTicket: "/add-new-ticket",
      ticketDetail: "/vendor-ticket-detail/:id",
      customerDetail: "/customer-detail/:id",
      inviteCustomers: "/invite-customers",
      vendorProfile: "/vendor-profile",
      orderDetail: "/order-detail/:orderId",
      addPromoCode: "/add-new-promocode",
      addPromotion: "/add-new-promotion",
      promotionDetail: "/promotion-detail/:promotionId",
      inviteSalesRep: "/invite-sales-rep",
      editSalesRep: "/edit-sales-rep",
      salesRepDetail: "/sales-rep-detail",
      accountSetup: "/vendor-account-setup",
      editProfile: "/vendor-edit-profile",
      cardSetup: "/vendor-card-setup",
      bankSetup: "/vendor-bank-setup",
      paymentSuccess: "/vendor-payment-success",

      manageSubscription: "/manage-subscription",
      manageVendorCards: "/manage-vendor-cards",
      editVendorCards: "/edit-vendor-cards",
      changeSubscription: "/change-subscription",
      vendorPurchaseSubscription: "/vendor-purchase-subscription",
    },
    accountOwner: {
      offices: "/offices",
      officeOptions: "/office/:officeId",
      staffGrid: "/staff/:officeId",
      preferences: "/office/:officeId/preferences",
      geoFence: "/office/:officeId/geo-fence",
      managePlan: "/manage-plan",
      viewFeatures: "/view-plan",
      editOffice: "/editOffice",
      manageCards: "/manage-cards",
      changePlan: "/change-plan",
      addSubscription: "/add-subscription",
      selectOffice: "/Select-Office",
      profile: "/profile",
      editProfile: "/edit-profile",
      contracts: "/contracts/:officeId",
      staffContracts: "/staff-contracts/:officeId/:staffId",
      newContract: "/new-contract/:officeId/:staffId",
      editContract: "/edit-contract/:officeId/:staffId/:contractId",
      viewContract: "/view-contract/:officeId/:contractId",
      timesheet: "/timesheet/:officeId",
      leaves: "/leaves/:officeId",
    },

    staff: {
      offices: "/staff-offices",
      officeOptions: "/staff-office/:officeId",
      officeAdmin: "/staff-admin/:officeId",
      officeContracts: "/office-contracts/:officeId",
      viewContract: "/view-staff-contract/:officeId/:contractId",
      timesheet: "/staff-office/:officeId/timesheet",
      timesheetSummary: "/timesheet-summary",
      timesheetViewDetail: "/timesheet-view-detail",
      staffListingTimesheet: "/timesheet/:officeId",
      timesheetDetail: "/timeheet/:officeId/timesheet-detail/:userId",
      timesheetDateDetail: "/timesheet-date-detail",
      leaves: "/leaves/:officeId",
      applyLeaves: "/apply-leaves/:officeId",
    },

    superAdmin: {
      patientList: "/manage-patients",
      reviews: "/reviews",
      patientReviews: "/reviews/patient/:patientId",
      doctorReviews: "/reviews/doctor/:doctorId",
      broadCastMessages: "/broadcast-messages",
      createBroadCastMessage: "/create-broadcast-message",
      appointmentRequestList: "/appointment-request-list",
      vendorSubscriptionPlans: "/vendor-subscription-plans",
      appointmentRequestDetail: "/appointment-request-detail/:requestId",
      feedback: "/feedbackandsuggestions",
      feedbackView: "/feedbackview/:feedbackId",
      SupportAndHelp: "/support",
      supportTicketDetail: "/ticket-detail/:ticketId",
      editSubscription: "/edit-subscription/:subscriptionId",
      categories: "/categories",
      tax: "/tax",
      sales: "/sales",
      trialSubscription: "/trial-subscription",
      basicSubscription: "/basic-subscription",
      vendorSubscriptionView: "/view-subscription/:subscriptionType",

      enterpriseSubscription: "/enterprise-subscription",
      manageVendors: "/manage-vendors",
      VendorDetails: "/vendor-details/:vendorId",
      VendorProfile: "/admin-vendor-profile",
      TopUpPromotions: "/top-up-promotions",
      helpDesk: "/help-desk",
      ticketDetails: "/helpdesk-ticket-details",
      manageCommissions: "/manage-commissions",
      manageSalesRepAdmin: "/manage-sale-representatives",
      accountBasicSubscription: "/subscription-details/:subscriptionType",
      editAccountBasicSubscription: "/update-subscription/:subscriptionType",
      manageFeatures: "/manage-features",
      editBasicSubscription: "/edit-subscription",

      editVendorSubscription: "/edit-vendor-subscription/:subscriptionType",
      addNewPlan: "/add-vendor-enterprise-plan",
      editEnterPricePlan: "/edit-vendor-enterprise-plan",
      enterpriseSubscriptionDetails: "/enterprise-subscription-details",
      addNewVendor: "/add-new-vendor",
      editAssignedVendor: "/edit-assigned-vendor",
      vendorSubscriptionDetails: "/vendor-subscription-details",
      editSubscriptionForVendors: "/edit-vendor-subscription-price",
      vendorTransactionHistory: "/vendor-transaction-history",
    },

    scheduler: {
      calendar: "/scheduler",
      addEvent: "/add-event",
      editEvent: "/edit-event/:eventId",
      eventDetails: "/event-details/:eventId",
      eventRequestDetails: "/event-request-details/:eventId",
      EventWorkingDetails: "/event-working-details/:eventId",
      addBusySlot: "/add-busy-slots",
      editBusySlot: "/edit-busy-slots/:busySlotId",
      busySlotDetail: "/busy-slot-detail/:busySlotId",
      eventDetailsOnly: "/event-details-only/:eventId",
    },

    notification: {
      notificationDetail: "/notification",
    },

    help: "/help",
    faq: "/faq",
    onlineHelp: "/onlineHelp",
    feedback: "/feedback",
  },

  systemRoles: {
    superAdmin: 1,
    accountOwner: 2,
    staff: 3,
    patient: 4,
    vendor: 5,
  },

  localStorageKeys: {
    agenda: {
      officeFilter: "agenda-office-filter",
    },
    waitingListFormData: "request-waiting-list-form-data",
    requestAppointmentData: "request-appointment-form-data",
    staffAvailablilityFilter: "staff-availability-filter",
    doctorListLocation: "saved-geolocation",
    selectedChatAccountOwner: "selected-chat-account-owner",
    questionnaireResponse: "questionnaire-response",
    filledQuestionnaireData: "filled-questionnaire-data",
    selectedAppointmentDate: "selected-appointment-date",
    activeChatTab: "active-chat-tab",
    paymentMethod: "paymentMethod",
  },

  helpPages: {
    onlineHelp: [
      { id: "OnlineHelpForStaff", role: 3 },
      { id: "OnlineHelpForAccountOwner", role: 2 },
      { id: "OnlineHelpForPatient", role: 4 },
    ],

    Faq: [
      { id: "FAQForStaff", role: 3 },
      { id: "FAQForAccountOwner", role: 2 },
      { id: "FAQForPatient", role: 4 },
    ],
  },

  regex: {
    // eslint-disable-next-line
    validURL:
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    validIP:
      /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  },

  deviceTypes: [
    {
      id: 1,
      title: "Android",
    },
    {
      id: 2,
      title: "iOS",
    },
  ],

  notificationRedirectionCode: {
    eventAcceptAndReject: 136,
    eventJoinandInvite: 137,
    PulishEvent: 146,
    RequestToJoin: 144,
    EventEmployee: 145,
    EventRequestToJoin: 148,
  },

  appTypes: [
    {
      id: 1,
      title: "Personnel/Account Owner App",
    },
    {
      id: 2,
      title: "Patient App",
    },
    {
      id: 3,
      title: "Supply App",
    },
  ],

  timesheetStatuses: [
    {
      id: 1,
      title: "Pending",
    },
    {
      id: 2,
      title: "Waiting for Approval",
    },
    {
      id: 3,
      title: "Approved",
    },
    {
      id: 4,
      title: "Rejected",
    },
    {
      id: 5,
      title: "Paid",
    },
  ],

  SchedulerStatuses: [
    {
      id: 1,
      title: "pending",
    },
    {
      id: 2,
      title: "accepted",
    },
    {
      id: 3,
      title: "rejected",
    },
    {
      id: 4,
      title: "cancelled",
    },
  ],
  SchedulerStatuseWorkingEvents: [
    {
      id: 1,
      title: "pending",
    },
    {
      id: 2,
      title: "accepted",
    },
    {
      id: 3,
      title: "rejected",
    },
  ],

  appointmentTimeTypes: {
    Morning: 1,
    Afternoon: 2,
    Evening: 3,
    Anytime: 4,
  },

  googleDoctorsStatusFilter: {
    All: 1,
    Pending: 2,
    Completed: 3,
  },

  agendaType: {
    APPOINTMENT: 1,
    LEAVE: 2,
    BUSY_SLOT: 3,
    EVENT: 4,
    BLOCKED: 5,
  },

  appointmentStatus: {
    Pending: 1,
    Accepted: 2,
    Rejected: 3,
    Cancelled: 4,
    Completed: 5,
    NoShow: 6,
    Confirmed: 7,
    Overdue: 8,
    Upcoming: 9,
    Converted: 10,
  },

  agendaTitleLength: 80,

  SCHEDULERSTATUS: {
    PENDING: 1,
    ACCEPT: 2,
    REJECT: 3,
  },

  SCHEDULEREVENTTYPE: {
    All: "FOR_JOIN_ALL_FUTURE_EVENTS",
    SPECFIC: "FOR_JOIN_SPECFIC_EVENTS",
    SINGLEDAY: 1,
    SPECFICDATES: 4,
    AllWeekDay: 2,
    ACCEPT: "ACCEPT",
    REJECT: "REJECT",
    REASONOFREJECT: "REASONOFREJECT",
  },
  titles: [
    {
      id: 2,
      text: "Mr.",
    },
    {
      id: 5,
      text: "Ms.",
    },
    {
      id: 1,
      text: "Dr.",
    },
    {
      id: 6,
      text: "None",
    },
  ],

  titleIds: {
    mr: 2,
    ms: 5,
    dr: 1,
  },

  animation: {
    hoverScale: 1.05,
  },

  lsKeys: {
    bookAppointmentData: "book_appointment_data",
    staffOnlineToast: "staffOnlineToast",
    OwnerOnlineToast: "OwnerOnlineToast",
  },
  containerName: {
    CONTAINER_NAME_CONTRACTS: "contracts",
    CONTAINER_NAME_CONTRACTS_SIGNATURE: "contract-signatures",
  },
  appLinks: {
    patientAndroidAppStoreLink:
      process.env.REACT_APP_PATIENT_ANDROID_APP_STORE_LINK,
    patientIosAppStoreLink: process.env.REACT_APP_PATIENT_IOS_APP_STORE_LINK,
  },

  NOTIFICATIONREADED: "NOTIFICATIONREADED",
  NOTIFICATIONUNREAD: "NOTIFICATIONUNREAD",
  SUBSCRIPTIONMODULEADDED: "SUBSCRIPTIONMODULEADDED",
  SUBSCRIPTIONMODULEREMOVED: "SUBSCRIPTIONMODULEREMOVED",
  OWNERMESSAENGERMODULEADDED: "OWNERMESSAENGERMODULEADDED",
  OWNERMESSAENGERMODULEREMOVED: "OWNERMESSAENGERMODULEREMOVED",

  wordLimits: {
    REJECTOINREQUESTJOIN: 400,
    ADDOFFICEADDRESS: 150,
  },

  MAPKEY: {
    COUNTRY: "country",
    ADMINISTRATIVE: "administrative_area_level_1",
    LOCALITY: "locality",
    POSTALCODE: "postal_code",
  },

  GOOGLEPLACETYPE: [
    "doctor",
    "dentist",
    "hospital",
    "pharmacy",
    "physiotherapist",
  ],
  INITIAL_GOOGLE_RADIUS: 10000,
  EXTENDED_GOOGLE_RADIUS: 20000,
  COUNTRY: {
    US: "US",
    CA: "CA",
    USLATLNG: { lat: 38.34, lng: -100.69 },
    CALATLNG: { lat: 57.89, lng: -101.61 },
    CABOUNDS: {
      north: 83.23324,
      south: 41.6751050889,
      west: -140.99778,
      east: -52.6480987209,
    },
    USBOUNDS: {
      north: 71.3577635769,
      south: 18.91619,
      west: -171.791110603,
      east: -66.96466,
    },
  },
  NOTINGOOGLE: "NOTINGOOGLE",
  ADDOFFICEADDRESS: 150,
  messageLimit: 400,

  JOBTYPE: {
    Temporary: 1,
    Permanent: 2,
  },

  DOWNLOADLINK: {
    playStore:
      "https://play.google.com/store/apps/details?id=com.miraxis.healthhubapp&hl=en_IN&gl=US",
    appStore: "https://apps.apple.com/in/app/miraxis-healthhub/id1548418438",
  },
  DOWNLOADLINKFORPATIENT: {
    playStore:
      "https://play.google.com/store/apps/details?id=com.miraxis.healthhubpatientapp",
    appStore: "https://apps.apple.com/be/app/miraxis-patients/id1614384418",
  },
  DOWNLOADLINKFORSUPPLY: {
    playStore:
      "https://play.google.com/store/apps/details?id=com.miraxis.healthhubsupply",
    appStore: "https://apps.apple.com/us/app/miraxis-supply/id6451264069",
  },
  weekday: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

  chat: {
    internal: "internal",
    external: "external",
    unArchived: "unhidden_only",
    archived: "hidden_only",
    latestLastMessage: "latest_last_message",
    chatListLimit: 100,
    chatGroupImageSizeInMbs: 10,
    ALL_OFFICES: 0,
    externalChatTitleLength: 120,
    groupNameLimit: 100,
    acceptForGroupImage: ".jpg,.jpeg,.png",
    acceptForMessageInput:
      ".jpg,.jpeg,.png,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx",
    allowedTypesForGroupImage: ["image/png", "image/jpg", "image/jpeg"],
    allowedTypesForMessage: [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "text/csv",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    allowedTypesForDocs: [
      "text/csv",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  },
  vendor: {
    step: {
      addProfileDetails: "1",
      purchaseSubscription: "2",
      addCardDetails: "3",
      bankDetails: "4",
      completed: "completed",
    },
    productDetails: "product-details",
    productImageContainer: "product-images",
    acceptForProductImage: ".jpg,.jpeg,.png",
    productImageSizeInMbs: 5,
    allowedTypesForProductImage: ["image/png", "image/jpg", "image/jpeg"],
    cache: {
      salesRepList: "sales-rep-list-cache",
      catalogueList: "catalogue-list-cache",
      salesRepDetail: "sales-rep-detail-cache",
      manageOrderslisting: "manage-orders-listing-cache",
      promoCodesList: "promo-codes-list-cache",
      editingValue: "editing-value",
      manageOrders: "Manage_Orders",
      manageSalesRepAdmin: "Manage_Sales_Rep_Admin",
      orderDetail: "order-detail-cache",
      salesRepVendorInAdmin: "sales-rep-cache-in-venodr-admin",
      orderDetailsTabs: "order-details-tab-in-venodr-admin",
      orderHistoryFilter: "order-history-filter-cache",
      customerOrderList: "customer-order-list-cache",
      manageCustomersList: "manage-customers-list-cache",
      manageCommissionsCache: "Manage_Commissions_cache",
      supportHelpVendorCache: "Support_help_vendor-cache",
      superAdminTopUp: "super-admin-top-up-promotion-cache",
      promotionTabCache: "promotion-tab-cache",
      promotionPaginationCache: "promotion-tab-pagination-cache",
      vendorDashBoardDateCache: "Vendor-dashboard-date-cache",
      vendorInvoiceCache: "Vendor-Invoice-Cache",
      vendorEnterpriceCache: "Vendor-Enterprice-Cache",
      vendorEnterPriceAssignCache: "Vendor-Enterprice-Assign-Cache",
    },
    enums: {
      orderStatus: {
        all: 0,
        pending: 1,
        accepted: 2,
        shipped: 4,
        partiallyShipped: 5,
        delivered: 6,
        cancelled: 7,
        list: [
          { name: "All", id: null },
          { name: "Pending", id: 1 },
          { name: "Accepted", id: 2 },
          { name: "Partially Accepted", id: 3 },
          { name: "Shipped", id: 4 },
          { name: "Partially Shipped", id: 5 },
          { name: "Delivered", id: 6 },
          { name: "Cancelled", id: 7 },
        ],
      },
      paymentMethod: {
        billMeLater: 1,
        paidOnline: 2,
        list: [
          { id: null, name: "All" },
          { id: 1, name: "Bill Me Later" },
          { id: 2, name: "Online by Credit Card" },
        ],
      },
      paymentStatus: {
        notPaid: 1,
        paid: 2,
        list: [
          { id: null, name: "All" },
          { id: 1, name: "Not Paid" },
          { id: 2, name: "Paid" },
        ],
      },
    },
  },

  arrow: {
    NEXT: 1,
    PREVIOUS: 2,
  },

  PopUp: {
    innerPopUp: 1,
    outerPopUp: 2,
  },
  staffAvalibility: "staffAvalibility",
  staffAvalibilityDate: "staffAvalibilityDateKey",
  EVENT_DATE_SESSION_KEY: "Event_DATE_KEY",
  EVENT_TYPE_SESSION_KEY: "Event_TYPE_KEY",

  ticketStatus: {
    resolved: 3,
    progress: 2,
    pending: 1,
  },
  calanderActions: ["next", "next2", "prev", "prev2"],
  calanderActionKey: {
    drillDown: "drillDown",
    year: "year",
  },
  cmsPageKey: {
    TermsAndConditions: "TermsAndConditions",
    PrivacyPolicy: "PrivacyPolicy",
    AboutUs: "AboutUs",
    Testimonials: " Testimonials",
    ContactUs: "ContactUs",
    Email: "Email",
    Phone: "Phone",
    Address: "Address",
    TermsAndConditionForContractTemplate:
      "TermsAndConditionForContractTemplate",
    TermsAndConditionOfContractForStaff: "TermsAndConditionOfContractForStaff",
    TermsAndConditionsForPatient: "TermsAndConditionsForPatient",
    PrivacyPolicyForPatient: "PrivacyPolicyForPatient",
    TermsAndConditionsForVendor: "TermsAndConditionsForVendor",
    PrivacyPolicyForVendor: "PrivacyPolicyForVendor",
    FAQForAccountOwner: "FAQForAccountOwner",
    OnlineHelpForPatient: "OnlineHelpForPatient",
    OnlineHelpForAccountOwner: "OnlineHelpForAccountOwner",
    OnlineHelpForStaff: "OnlineHelpForStaff",
    FAQForPatient: "FAQForPatient",
    FAQForStaff: "FAQForStaff",
    OurMission: "OurMission",
  },
  requestEventStatus: {
    Pending: 1,
    Accepted: 2,
    Reject: 3,
    Cancel: 4,
  },
  OnlineFaqPages: [
    "/owner/faq",
    "/patient/faq",
    "/staff/faq",
    "/owner/help",
    "/patient/help",
    "/staff/help",
    "/blogs/9-reasons-why-dentists-are-automating-their-practice",
    "/blogs/top-9-ways-for-you-and-your-staff-to-avoid-burnout",
    "/blogs/top-9-benefits-of-streamlining-and-automating-workflows-in-your-dental-practice",
    "/blogs/communication-with-your-team-how-to-be-hands-offand-still-be-hands-on",
    "/blogs/3-effective-ways-technology-can-help-you-efficiently-manage-staff-in-your-practice",
    "/blogs/8-ways-leading-dental-practices-enhance-their-staff-experience",
    "/blogs/6-ways-to-recruit-and-retain-practice-employees-in-2023",
    "/landing-pages/guide-download-page",
    "/landing-pages/guide-thank-page",
    "/landing-pages/ebook-download-page",
    "/landing-pages/ebook-thank-page",
    "/getstarted",
    "/landing-pages/guide-download-page-fb",
    "/landing-pages/guide-download-page-ggl",
    "/landing-pages/guide-download-page-sm",
    "/landing-pages/ebook-download-page-fb",
    "/landing-pages/ebook-download-page-ggl",
    "/landing-pages/ebook-download-page-sm",
    "/demo-request-page",
    "/demo-request-thank-page",
  ],
  faqRequestType: {
    HelpGuideRequest: 1,
    ChecklistRequest: 2,
  },
  categoryType: {
    add: 1,
    edit: 2,
  },
  selectType: {
    selectAll: 1,
    selectQuantity: 2,
  },
  taxTypeModal: {
    add: 1,
    edit: 2,
  },
  taxType: {
    oneTax: 1,
    ProvienceTax: 2,
  },

  orderStatus: {
    all: 0,
    Pending: 1,
    Accepted: 2,
    PartiallyAccepted: 3,
    Shipped: 4,
    PartiallyShipped: 5,
    Delivered: 6,
    Cancelled: 7,
    UnPaid: 8,

    newShipment: true,
  },

  orderStatusTitle: [
    {
      title: "Pending",
      value: 1,
    },
    {
      title: "Accepted",
      alt: "Not Shipped",
      value: 2,
    },
    {
      title: "Partially Accepted",
      value: 3,
    },
    {
      title: "Shipped",
      value: 4,
    },
    {
      title: "Partially Shipped",
      value: 5,
    },
    {
      title: "Delivered",
      value: 6,
    },
    {
      title: "Cancelled",
      value: 7,
    },
  ],

  paymentMethod: [
    { value: 1, title: "Bill Me Later" },
    { value: 2, title: "Online by Credit Card" },
  ],

  paymentStatus: [
    { value: 1, title: "Not Paid" },
    { value: 2, title: "Paid" },
  ],

  paymentStatusObj: {
    paid: 2,
    notPaid: 2,
  },

  paymentMethodObj: {
    billMeLater: 1,
    paid: 2,
  },

  orderDetails: {
    ACCEPT: "ACCEPT",
    DECLINE: "DECLINE",
    AcceptPartially: "ACCEPTPARTIALLY",
  },
  vendorDetailsTab: {
    orderHistory: "1",
    salesRep: "2",
  },

  hubspotFormPages: {
    ebookDownloadPage: "ebookDownloadPage",
    fbHubspotPage: "fbHubspotPage",
    gglHubspotPage: "gglHubspotPage",
    smHubspotPage: "smHubspotPage",
    guideDownloadPage: "guideDownloadPage",
    fbGuideHubspotPage: "fbGuideHubspotPage",
    gglGuideHubspotPage: "gglGuideHubspotPage",
    smGuideHubspotPage: "smGuideHubspotPage",
  },
  vendorTicketType: [
    {
      value: null,
      label: "All Tickets",
      class: "",
    },
    {
      value: 1,
      label: "Pending",
      class: "pending",
    },
    {
      value: 2,
      label: "In Progress",
      class: "inProgress",
    },
    {
      value: 3,
      label: "Resolved",
      class: "resolved",
    },
  ],

  genderOptions: [
    { name: "Male", id: 1 },
    { name: "Female", id: 2 },
    { name: "Other", id: 3 },
  ],

  relationOptions: [
    { name: "Father ", id: 1 },
    { name: "Mother", id: 2 },
    { name: "Daughter", id: 3 },
    { name: "Son", id: 4 },
    { name: "Husband", id: 5 },
    { name: "Wife", id: 6 },
    { name: "Others", id: 7 },
  ],

  familyMembers: {
    cache: {
      familyMemberlisting: "family-member-listing-cache",
      familyMemberAddedYoulisting: "family-member-listing-cache",
      selectedMemberData: "selected-member-data",
    },
    inviteStatus: {
      Pending: 1,
      Accepted: 2,
      Rejected: 3,
      NotRegister: 4,
    },
  },

  familyMemberTabStatus: {
    addedMembers: 1,
    membersAddedYou: 2,
  },

  subscriptionType: {
    basic: 1,
    advanced: 2,
    professional: 3,
    free: 4,
    trial: 5,
    enterprise: 6,
  },
  subscriptionTypesArray: [1, 2, 3],
  sessionStoragecache: {
    subscriptionDetails: "subscription-plan-Details-cache-tab",
    officeKey: "OFFFICE_KEY_CACHE",
    ownerEnterPriseListng: "owner-EnterPrise-Listng-cache",
  },

  subscriptionModuleType: {
    Default: 1,
    LinkedWithFeature: 2,
    Textual: 3,
  },

  OfficeTimesheetStatus: [
    {
      value: null,
      label: "All",
    },
    {
      value: 1,
      label: "Pending For Approval",
    },
    {
      value: 2,
      label: "Approved",
    },
    {
      value: 3,
      label: "Rejected",
    },
    {
      value: 4,
      label: "Partially Paid",
    },
    {
      value: 5,
      label: "Paid",
    },
    {
      value: 6,
      label: "Pending",
    },
  ],

  TimesheetListingStatus: [
    {
      value: null,
      label: "All",
    },
    {
      value: 2,
      label: "Pending For Approval",
    },
    {
      value: 3,
      label: "Approved",
    },
    {
      value: 4,
      label: "Rejected",
    },
    {
      value: 5,
      label: "Paid",
    },
  ],

  TimesheetType: {
    AllDay: 1,
    Hourly: 2,
  },

  Timesheet: {
    cache: {
      staffMemberTimesheetlisting: "staff-member-timesheet-listing-cache",
      timesheetListingCache: "timesheet-listing-cache",
    },
  },

  LeaveStatus: [
    {
      value: null,
      label: "All",
    },
    {
      value: 1,
      label: "Pending",
    },
    {
      value: 2,
      label: "Approved",
    },
    {
      value: 3,
      label: "Rejected",
    },
  ],

  LeaveTypeStatus: [
    {
      value: null,
      label: "All",
    },
    {
      value: 1,
      label: "Casual",
    },
    {
      value: 2,
      label: "Medical",
    },
    {
      value: 3,
      label: "Vacation",
    },
  ],

  Leave: {
    cache: {
      staffLeavelisting: "staff-leave-listing-cache",
      leaveListing: "leave-listing-cache",
    },
  },

  leavesAndTimesheet: {
    cache: {
      list: "list-leaves-and-timesheet",
    },
  },

  WeekDays: [
    {
      id: 7,
      day: " Sun ",
    },
    {
      id: 1,
      day: " Mon ",
    },
    {
      id: 2,
      day: " Tue ",
    },
    {
      id: 3,
      day: " Wed ",
    },
    {
      id: 4,
      day: " Thu ",
    },
    {
      id: 5,
      day: " Fri ",
    },
    {
      id: 6,
      day: " Sat ",
    },
  ],

  subscriptionPlan: [
    { value: 1, name: "Basic" },
    { value: 2, name: "Advanced" },
    { value: 3, name: "Professional" },
    { value: 4, name: "Free" },
    { value: 5, name: "Trial" },
    { value: 6, name: "Enterprise " },
  ],

  currenyArray: [
    { value: 1, name: "CAD" },
    { value: 2, name: "USD" },
  ],

  curreny: {
    CAD: 1,
    USD: 2,
  },
  radioTypeSubscription: {
    SINGLE: 1,
    MULTIPLE: 2,
  },
  moduleNameWithId: {
    formAndContracts: 15,
    teamLiveChat: 11,
    scheduler: 9,
  },
};

export const isModuleAccessable = (arrayOfModules, currentModuleId) => {
  try {
    if (Array.isArray(arrayOfModules) && arrayOfModules.length) {
      let module = arrayOfModules.find((item) => item.id === currentModuleId);
      if (module) {
        return module?.isAvailable;
      }
    }
    return false;
  } catch (err) {
    console.log(err);
  }
};

export function getcurreny(id) {
  let currency = constants.currenyArray.find((item) => item.value == id)?.name;
  return currency ? currency : "--";
}

export function getsubcriptionPlanTitle(id) {
  let subName = constants.subscriptionPlan.find(
    (item) => item.value == id
  )?.name;
  return subName ? subName : "--";
}

export function getDeviceTypeById(deviceTypeId) {
  let deviceType = constants.deviceTypes.find((it) => it.id === deviceTypeId);
  return deviceType === undefined ? { id: 0, title: "Unknown" } : deviceType;
}

export function getAppTypeById(appTypeId) {
  let appType = constants.appTypes.find((it) => it.id === appTypeId);
  return appType === undefined ? { id: 0, title: "Unknown" } : appType;
}

export function getTimesheetStatusById(timesheetStatusId) {
  let timesheetStatus = constants.timesheetStatuses.find(
    (it) => it.id === timesheetStatusId
  );
  return timesheetStatus === undefined
    ? { id: 0, title: "Unknown" }
    : timesheetStatus;
}

export function getSchedulerStatusById(schedulerStatusId) {
  let schedulerStatus = constants.SchedulerStatuses.find(
    (it) => it.id === schedulerStatusId
  );
  return schedulerStatus === undefined
    ? { id: 0, title: "Unknown" }
    : schedulerStatus.title;
}

export const orderStatus = (statusId, alt = false) => {
  const status = constants.orderStatusTitle.find(
    (orderStatusTitle) => orderStatusTitle.value === statusId
  );
  if (status) {
    return alt ? status?.alt : status?.title;
  }

  return "Unknown";
};

export const paymentMethodStatus = (paymentMethodId) => {
  const status = constants.paymentMethod.find(
    (paymentMethod) => paymentMethod.value === paymentMethodId
  );
  if (status) {
    return status?.title;
  }

  return "Unknown";
};

export const paymentStatus = (paymentMethodId) => {
  const status = constants.paymentStatus.find(
    (item) => item.value === paymentMethodId
  );
  if (status) {
    return status?.title;
  }

  return "Unknown";
};

export const getClassNameVenodorTicket = (ticketStatus) => {
  let className = constants.vendorTicketType.find(
    (item) => item.value === ticketStatus
  )?.class;
  if (className) return className;
  else return "";
};

export const getStatusVenodorTicket = (ticketStatus) => {
  let className = constants.vendorTicketType.find(
    (item) => item.value === ticketStatus
  )?.label;
  if (className) return className;
  else return "--";
};

export const getKeyValueFromList = (list, id, key) => {
  const status = list.find((item) => item.id === id);
  if (status) {
    return status?.[key];
  }

  return "--";
};

export default constants;
