import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { getDemoRequest, markComplete } from "actions/index";
import Select from "react-select";
import moment from "moment";

/*components*/
import _isLoading from "hoc/isLoading";
import Empty from "components/Empty";
import Table from "components/table";
import Toast from "components/Toast";
import { withTranslation } from "react-i18next";

const options = [
  { value: "1", label: "All Requests" },
  { value: "2", label: "Pending" },
  { value: "3", label: "Completed" },
];

class DemoRequest extends Component {
  state = {
    pageNumber: 1,
    filterTye: null,
    isToastView: false,
    searchType: "",
  };

  componentDidMount() {
    this.props.getDemoRequest({
      PageSize: 10,
      PageNumber: 1,
      isPending: null,
    });
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.searchInput = React.createRef();
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.statusMessage !== this.props.statusMessage) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true });
      setTimeout(() => {
        if (!this.props.ismarkError) {
          this.setState({ isToastView: false });
        }
      }, 2000);
    }
  }

  columns = [
    {
      attrs: { datatitle: "Name" },
      dataField: "firstName",
      text: "Name",
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {row && row.firstName} {row && row.lastName}
        </span>
      ),
    },
    {
      attrs: { datatitle: "Email Address" },
      dataField: "email",
      text: "Email Address",
    },
    {
      attrs: { datatitle: "Contact No." },
      dataField: "contactNumber",
      text: "Contact No.",
    },
    {
      attrs: { datatitle: "Request Received" },
      dataField: "submittedOn",
      text: "Request Received",
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>{moment(cellContent).format("MMM DD , YYYY")}</Fragment>
      ),
    },
    {
      attrs: { datatitle: "Status" },
      dataField: "isPending",
      text: "Status",
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>{cellContent ? "Pending" : "Completed"}</Fragment>
      ),
    },
    {
      dataField: "isPending",
      text: "",
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          {cellContent ? (
            <span
              className="pointer"
              style={{ fontSize: "12px", color: "#587e85" }}
              title="Mark as complete"
              onClick={() => this.handleMarkComplete(row.id)}
            >
              <u>Mark as complete</u>
            </span>
          ) : null}
        </Fragment>
      ),
    },
  ];

  handleMarkComplete = (id) => {
    this.props.markComplete({
      demoRequestId: id,
      pageNumber: this.state.pageNumber,
      isPending:
        this.state.filterTye === "2"
          ? true
          : this.state.filterTye === "3"
          ? false
          : null,
    });
  };

  handleMemberType = (data) => {
    this.setState({ filterTye: data.value, searchType: "" });

    if (data.value !== "1") {
      this.props.getDemoRequest({
        PageSize: 10,
        PageNumber: 1,
        isPending: data.value === "2" ? true : false,
      });
    } else {
      this.props.getDemoRequest({
        PageSize: 10,
        PageNumber: 1,
        isPending: null,
      });
    }
  };

  handlePagination = (page) => {
    this.setState({ pageNumber: page });
    this.props.getDemoRequest({
      PageSize: 10,
      PageNumber: page,
      isPending:
        this.state.filterTye === "2"
          ? true
          : this.state.filterTye === "3"
          ? false
          : null,
    });
  };

  toastHide = () => {
    this.setState({ isToastView: false });
  };

  handleSerachFilter = (e) => {
    this.setState({ searchType: e.target.value });
    this.props.getDemoRequest({
      PageSize: 10,
      PageNumber: 1,
      isPending: null,
      searchTerm: e.target.value,
    });
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
    const { requestList, isLoadError, statusMessage, ismarkError, t } =
      this.props;
    const { isToastView } = this.state;
    return (
      <div className="demo-request-list-block">
        {isToastView && statusMessage && (
          <Toast
            message={statusMessage}
            handleClose={this.toastHide}
            errorToast={ismarkError ? true : false}
          />
        )}
        <div className="container">
          <div className="header">
            <h2 className="title">{t("superAdmin.demoRequests")}</h2>
            <div className="filter-section">
              <div className="member-filter request-filter">
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={options}
                  defaultValue={options[0]}
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
                  placeholder={t("superAdmin.searchDemoRequests")}
                  onInput={this.handleSerachFilter}
                  value={this.state.searchType}
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
              data={(requestList && requestList.data) || []}
              handlePagination={this.handlePagination}
              keyField="id"
              pageNumber={requestList && requestList.pagination.currentPage}
              totalItems={requestList && requestList.pagination.totalItems}
            />

            {isLoadError || (requestList && requestList.data.length == 0) ? (
              <Empty Message={t("superAdmin.emptyDemoRequestListMessage")} />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  demorequest: {
    statusMessage,
    isLoading,
    requestList,
    isLoadError,
    ismarkError,
  },
}) => ({
  statusMessage,
  isLoading,
  requestList,
  profile,
  isLoadError,
  ismarkError,
});

export default connect(mapStateToProps, { getDemoRequest, markComplete })(
  _isLoading(withTranslation()(DemoRequest))
);
