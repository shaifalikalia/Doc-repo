import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getpersonnel, setOwnerStatus } from "actions/index";
import { Modal, ModalBody } from "reactstrap";

/*components*/
import _isLoading from "hoc/isLoading";
import Empty from "components/Empty";
import Table from "components/table";
import Toast from "components/Toast";
import Select from "react-select";
import { withTranslation } from "react-i18next";
import { PersonnelRoutesContext } from "../PersonnelRoutesContext";
import { encodeId } from "utils";

const options = [
  { value: null, label: "All Members" },
  { value: true, label: "Active Members" },
  { value: false, label: "Inactive Members" },
];

class MangePersonnel extends Component {
  static contextType = PersonnelRoutesContext;

  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      deactivateModal: false,
      userId: null,
      isToastView: false,
      pageNumber: 1,
      plandeactivateModal: false,
      searchType: "",
    };
  }

  componentDidMount() {
    this.getPersonnel();
    this.searchInput = React.createRef();
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  getPersonnel = () => {
    let _options = {
      PageSize: 10,
      PageNumber: this.context.pageNumber,
    };

    if (this.context.searchTerm) _options.searchTerm = this.context.searchTerm;

    if (
      this.context.filter.value === true ||
      this.context.filter.value === false
    )
      _options.status = this.context.filter.value;

    this.props.getpersonnel(_options);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.userStatusMessage !== this.props.userStatusMessage) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true });
      setTimeout(() => {
        if (!this.props.isStatusError) {
          this.setState({ isToastView: false });
        }
      }, 2500);
    }
  }

  columns = [
    {
      attrs: { datatitle: "Personnel Name" },
      dataField: "firstName",
      text: this.props.t("superAdmin.personnelName"),
      formatter: (cellContent, row, rowIndex) => (
        <Link
          to={`/personnel/${encodeId(row.id)}`}
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
      attrs: { datatitle: "Active Offices" },
      dataField: "activeInOfficesCount",
      text: this.props.t("superAdmin.activeOffices"),
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
      dataField: "isActive",
      text: "",
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          {cellContent ? (
            <span
              className="pointer"
              style={{ fontSize: "12px", color: "#e76f2a" }}
              title="Deactivate"
              onClick={() => this.handleDeactivateModalOpen(row.id)}
            >
              <u>Deactivate</u>
            </span>
          ) : (
            <span
              style={{ fontSize: "12px" }}
              className="pointer"
              title="Activate"
              onClick={() => this.handleStatus(true, row.id)}
            >
              <u>Activate</u>
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

  handleStatus = (status, id = null) => {
    const payload = {
      userId: this.state.userId ? this.state.userId : id,
      status: status,
      pageNumber: this.state.pageNumber,
      isPersonnel: true,
    };

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
          <p>
            {this.props.t("superAdmin.personnelDeactivationWarningMessage")}
          </p>
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

  handlePagination = (page) => {
    this.context.setPageNumber(page);

    let _options = {
      PageSize: 10,
      PageNumber: page,
    };

    if (this.context.searchTerm) _options.searchTerm = this.context.searchTerm;

    if (
      this.context.filter &&
      (this.context.filter.value === true ||
        this.context.filter.value === false)
    )
      _options.status = this.context.filter.value;

    this.props.getpersonnel(_options);
  };

  toastHide = () => {
    this.setState({ isToastView: false });
  };

  handleSearchFilter = (e) => {
    this.context.setSearchTerm(e.target.value);
    this.context.setPageNumber(1);

    let _options = {
      PageSize: 10,
      PageNumber: 1,
      searchTerm: e.target.value,
    };

    if (
      this.context.filter &&
      (this.context.filter.value === true ||
        this.context.filter.value === false)
    )
      _options.status = this.context.filter.value;

    this.props.getpersonnel(_options);
  };

  handleMemberType = (data) => {
    this.context.setFilter(data);
    this.context.setPageNumber(1);

    let _options = {
      PageSize: 10,
      PageNumber: 1,
      status: data.value,
    };

    if (this.context.searchTerm) _options.searchTerm = this.context.searchTerm;

    this.props.getpersonnel(_options);
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
    const { personelList, isLoadError, isStatusError, userStatusMessage, t } =
      this.props;
    const { isToastView } = this.state;

    return (
      <div className="personnel-list-block">
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
                <h2 className="title">{t("superAdmin.managePersonnel")}</h2>
              </div>
            </div>

            <div className="filter-section">
              <div className="member-filter">
                <span className="ico">
                  <img
                    src={require("assets/images/user-icon.svg").default}
                    alt="icon"
                  />
                </span>
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={options}
                  value={this.context.filter}
                  onChange={this.handleMemberType}
                  isSearchable={false}
                />
              </div>
              <div
                className="search-box"
                onClick={this.showSearch}
                ref={this.searchInput}
              >
                <input
                  type="text"
                  placeholder={t("superAdmin.searchMember")}
                  onInput={this.handleSearchFilter}
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
              data={(personelList && personelList.data) || []}
              handlePagination={this.handlePagination}
              keyField="id"
              pageNumber={personelList && this.context.pageNumber}
              totalItems={personelList && personelList.pagination.totalItems}
            />

            {isLoadError || (personelList && personelList.data.length == 0) ? (
              <Empty Message={t("superAdmin.emptyPersonnelListMessage")} />
            ) : null}
            {this.DeactivateConfirm()}
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
    personelList,
    isLoading,
    isLoadError,
    isStatusError,
    userStatusMessage,
  },
  errors: { isError },
}) => ({
  statusMessage,
  isLoading,
  isError,
  profile,
  personelList,
  isLoadError,
  isStatusError,
  userStatusMessage,
});

export default connect(mapStateToProps, { getpersonnel, setOwnerStatus })(
  _isLoading(withTranslation()(MangePersonnel))
);
