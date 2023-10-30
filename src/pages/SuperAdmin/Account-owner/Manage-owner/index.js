import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getaccountowner,
  setOwnerStatus,
  setcancelPlan,
  getOwnersPlans,
} from "actions/index";
import { Modal, ModalBody } from "reactstrap";

/*components*/
import _isLoading from "hoc/isLoading";
import Empty from "components/Empty";
import Table from "components/table";
import Toast from "components/Toast";
import Select from "react-select";
import { withTranslation } from "react-i18next";
import { AccountOwnerRoutesContext } from "../AccountOwnerRoutesContext";
import { encodeId } from "utils";

// I have set -ve values for roles as this options
// will be appended by package list and their ids
// might have the same values as 2, 4, 6. To avoid
// collision I have kept them as -ve.
const filterOptions = [
  { value: "All", label: "All Members" },
  { value: "active", label: "Active Members", isStatus: true },
  { value: "inactive", label: "Inactive Members", isStatus: true },
  { value: -2, label: "Dental Members", RoleId: true },
  { value: -4, label: "Physician Members", RoleId: true },
  { value: -6, label: "Pharmacist Members", RoleId: true },
];

class MangeAccountOwner extends Component {
  static contextType = AccountOwnerRoutesContext;

  state = {
    deactivateModal: false,
    userId: null,
    isToastView: false,
    plandeactivateModal: false,
    options: filterOptions,
    selectedFilterValue: filterOptions[0],
    pageNumber: 1,
  };

  componentDidMount() {
    this.getAccountOwners();
    this.props.getOwnersPlans();
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.searchInput = React.createRef();
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.ownerPackageList && !state.options.some((it) => it.packageId)) {
      let newOptions = props.ownerPackageList.map((item) => {
        return { value: item.id, label: item.name, packageId: true };
      });

      return {
        options: [...state.options, ...newOptions],
      };
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userStatusMessage !== this.props.userStatusMessage) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true });
      setTimeout(() => {
        if (!this.props.isStatusError) {
          this.setState({ isToastView: false });
        }
      }, 2000);
    }
  }

  columns = [
    {
      attrs: { datatitle: "Account Owner Name" },
      dataField: "firstName",
      text: this.props.t("superAdmin.accountOwnerName"),
      formatter: (cellContent, row, rowIndex) => (
        <Link
          to={`account-owner/${encodeId(row.id)}`}
          className="table-row-main-link"
        >
          <span>
            {row && row.firstName} {row && row.lastName}
          </span>
        </Link>
      ),
    },
    {
      attrs: { datatitle: "Email Address" },
      dataField: "emailId",
      text: this.props.t("form.fields.emailAddress"),
    },
    {
      attrs: { datatitle: "Role" },
      dataField: "role.title",
      text: this.props.t("superAdmin.role"),
    },
    {
      attrs: { datatitle: "Contact No." },
      dataField: "contactNumber",
      text: this.props.t("superAdmin.contactNo"),
      formatter: (cellContent) => {
        if (!cellContent) return "-";
        return cellContent;
      },
    },
    {
      attrs: { datatitle: "Current Active Plan" },
      dataField: "subscription.packageName",
      text: this.props.t("superAdmin.currentActivePlan"),
      formatter: (cellContent) => {
        if (!cellContent) return "-";
        return cellContent;
      },
    },
    {
      attrs: { datatitle: "Status" },
      dataField: "isActive",
      text: this.props.t("superAdmin.status"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          {cellContent
            ? this.props.t("superAdmin.active")
            : this.props.t("superAdmin.inactive")}
        </Fragment>
      ),
    },
    {
      dataField: "subscription",
      dataField: "isActive",
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          {cellContent ? (
            <span
              className="pointer"
              style={{ fontSize: "12px", color: "#e76f2a" }}
              title={this.props.t("deactivate")}
              onClick={() => this.handleDeactivateModalOpen(row.id)}
            >
              <u>{this.props.t("deactivate")}</u>
            </span>
          ) : (
            <span
              style={{ fontSize: "12px" }}
              className="pointer"
              title={this.props.t("activate")}
              onClick={() => this.handleStatus(true, row.id)}
            >
              <u>{this.props.t("activate")}</u>
            </span>
          )}

          {row &&
            row.subscription &&
            row.subscription.packageType === "enterprise" &&
            row.subscription.isActive && (
              <span
                style={{
                  fontSize: "12px",
                  display: "inline-block",
                  marginLeft: "10px",
                }}
                className="pointer"
                title={this.props.t("superAdmin.cancelPlan")}
                onClick={() => this.handleplandeactivateModalOpen(row.id)}
              >
                <u>{this.props.t("superAdmin.cancelPlan")}</u>
              </span>
            )}
        </Fragment>
      ),
    },
  ];

  handleDeactivateModalClose = () => {
    this.setState({ deactivateModal: false, userId: null });
  };

  handleDeactivateModalOpen = (id) => {
    this.setState({ deactivateModal: true, userId: id });
  };

  handleplandeactivateModalClose = (id) => {
    this.setState({ plandeactivateModal: false, userId: null });
  };

  handleplandeactivateModalOpen = (id) => {
    this.setState({ plandeactivateModal: true, userId: id });
  };

  handleStatus = (status, id = null) => {
    const payload = {
      userId: this.state.userId ? this.state.userId : id,
      status: status,
      pageNumber: this.context.pageNumber || this.state.pageNumber,
      isPersonnel: false,
    };

    if (this.context.filter?.isStatus) this.context.setFilter(null);

    this.setState({ deactivateModal: false, userId: null });
    this.props.setOwnerStatus({ ...payload });
  };

  DeactivateConfirm = () => (
    <Modal
      isOpen={this.state.deactivateModal}
      className="modal-dialog-centered deactivate-modal"
      modalClassName="custom-modal"
      toggle={this.handleDeactivateModalClose}
    >
      <span className="close-btn" onClick={this.handleDeactivateModalClose}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <div className="content-block">
          <p>{this.props.t("superAdmin.ownerDeactivateWarningMessage")}</p>
          <button
            className="button button-round button-min-100 margin-right-2x"
            title={this.props.t("ok")}
            onClick={() => this.handleStatus(false, null)}
          >
            {this.props.t("ok")}
          </button>
          <button
            class="button button-round button-border button-dark"
            title={this.props.t("cancel")}
            onClick={this.handleDeactivateModalClose}
          >
            {this.props.t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );

  planDeactivateConfirm = () => (
    <Modal
      isOpen={this.state.plandeactivateModal}
      className="modal-dialog-centered deactivate-modal"
      modalClassName="custom-modal"
      toggle={this.handleplandeactivateModalClose}
    >
      <span className="close-btn" onClick={this.handleplandeactivateModalClose}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <div className="content-block">
          <p>{this.props.t("superAdmin.ownerPlanDeactivateWarningMessage")}</p>
          <button
            className="button button-round button-shadow  button-min-100  w-sm-100 mb-2 mr-md-3"
            title={this.props.t("ok")}
            onClick={this.handleCancelPlan}
          >
            {this.props.t("ok")}
          </button>
          <button
            class="button button-round button-border button-dark btn-mobile-link"
            title={this.props.t("cancel")}
            onClick={this.handleplandeactivateModalClose}
          >
            {this.props.t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );

  handlePagination = (page) => {
    this.context.setPageNumber(page);
    this.setState({ pageNumber: page });

    let options = {
      PageSize: 10,
      PageNumber: page,
      searchTerm: this.context.searchTerm,
    };

    if (this.context.filter) {
      if (this.context.filter.RoleId)
        options.roleId = this.context.filter.value * -1;

      if (this.context.filter.packageId)
        options.packageId = this.context.filter.value;

      if (this.context.filter.isStatus)
        options.status = this.context.filter.value;
    }

    this.props.getaccountowner(options);
  };

  handleCancelPlan = () => {
    const payload = {
      userId: this.state.userId,
      pageNumber: this.state.pageNumber,
    };

    this.setState({ plandeactivateModal: false, userId: null });
    this.props.setcancelPlan({ ...payload });
    this.getAccountOwners();
  };

  toastHide = () => {
    this.setState({ isToastView: false });
  };

  handleSerachFilter = (e) => {
    this.context.setPageNumber(1);
    this.context.setSearchTerm(e.target.value);

    let options = {
      PageSize: 10,
      PageNumber: 1,
      searchTerm: e.target.value,
    };

    if (this.context.filter) {
      if (this.context.filter.RoleId)
        options.roleId = this.context.filter.value * -1;

      if (this.context.filter.packageId)
        options.packageId = this.context.filter.value;

      if (this.context.filter.isStatus)
        options.status = this.context.filter.value;
    }

    this.props.getaccountowner(options);
  };

  handleMemberType = (data) => {
    this.context.setFilter(data);
    this.context.setPageNumber(1);

    let options = {
      PageSize: 10,
      PageNumber: 1,
    };

    if (data.RoleId) options.roleId = data.value * -1;

    if (data.packageId) options.packageId = data.value;

    if (data.isStatus) options.status = data.value;

    if (this.context.searchTerm) options.searchTerm = this.context.searchTerm;

    this.props.getaccountowner(options);
  };

  getAccountOwners = () => {
    let options = {
      PageSize: 10,
      PageNumber: this.context.pageNumber,
    };

    if (this.context.searchTerm) options.searchTerm = this.context.searchTerm;

    if (this.context.filter) {
      if (this.context.filter.isStatus)
        options.status = this.context.filter.value;

      if (this.context.filter.packageId)
        options.packageId = this.context.filter.value;

      if (this.context.filter.RoleId)
        options.roleId = this.context.filter.value * -1;
    }

    this.props.getaccountowner(options);
  };

  showSearch = () => {
    if (window.innerWidth < 768) {
      this.searchInput.current.classList.add("open");
    }
  };

  setWrapperRef = (node) => {
    this.searchInput = node;
  };

  handleClickOutside = (event) => {
    if (
      this.searchInput &&
      this.searchInput.current &&
      !this.searchInput.current.contains(event.target) &&
      window.innerWidth < 768
    ) {
      this.searchInput.current.classList.remove("open");
    }
  };

  render() {
    const { ownerList, isLoadError, isStatusError, userStatusMessage, t } =
      this.props;
    const { isToastView } = this.state;

    return (
      <div className="owners-list-block">
        {isToastView && userStatusMessage && (
          <Toast
            message={userStatusMessage}
            handleClose={this.toastHide}
            errorToast={isStatusError ? true : false}
          />
        )}

        <div className="container">
          <div className="header">
            <div className="row no-gutters align-items-center">
              <div className="col-md-6">
                <h2 className="title">{t("superAdmin.manageAccountOwners")}</h2>
              </div>
            </div>
            <div className="filter-section">
              <div className="member-filter">
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={this.state.options}
                  value={this.context.filter}
                  onChange={this.handleMemberType}
                />
              </div>
              <div
                className="search-box"
                onClick={this.showSearch}
                ref={this.searchInput}
              >
                <input
                  type="text"
                  placeholder="Search Owner"
                  onInput={this.handleSerachFilter}
                  value={this.context.searchTerm}
                />
                <span className="ico">
                  <img
                    src={require("assets/images/search-icon.svg").default}
                    alt="icon"
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="data-list">
            <Table
              columns={this.columns}
              data={ownerList && ownerList.data ? ownerList.data : []}
              handlePagination={this.handlePagination}
              keyField="id"
              pageNumber={ownerList && this.context.pageNumber}
              totalItems={ownerList && ownerList.pagination.totalItems}
            />

            {isLoadError || (ownerList && ownerList.data.length <= 0) ? (
              <Empty Message={t("superAdmin.emptyOwnersListMessage")} />
            ) : null}
            {this.DeactivateConfirm()}
            {this.planDeactivateConfirm()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  auth: {
    statusMessage,
    ownerList,
    isLoading,
    isLoadError,
    isStatusError,
    userStatusMessage,
    ownerPackageList,
  },
  errors: { isError },
}) => ({
  statusMessage,
  isLoading,
  isError,
  profile,
  ownerList,
  isLoadError,
  isStatusError,
  userStatusMessage,
  ownerPackageList,
});

export default connect(mapStateToProps, {
  getaccountowner,
  setOwnerStatus,
  setcancelPlan,
  getOwnersPlans,
})(_isLoading(withTranslation()(MangeAccountOwner)));
