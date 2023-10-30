import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getPackage } from "actions/index";

/*components*/
import _isLoading from "hoc/isLoading";
import Empty from "components/Empty";
import Table from "components/table";
import { withTranslation } from "react-i18next";
import { convertIntoTwoDecimal, setStorage, getStorage } from "utils";
import { debounce } from "lodash";
import ToggleSwitch from "components/ToggleSwitch";
import "./EnterPrisePlans.scss";
import constants from "../../../constants";

const acticeTab = {
  CAD: 1,
  USD: 2,
};

class EnterPrisePlans extends Component {
  state = {
    searchType:
      getStorage(constants.sessionStoragecache.ownerEnterPriseListng)
        ?.searchType || null,
    activePrice:
      getStorage(constants.sessionStoragecache.ownerEnterPriseListng)
        ?.activePrice || acticeTab.CAD,
    pageNumber:
      getStorage(constants.sessionStoragecache.ownerEnterPriseListng)
        ?.pageNumber || 1,
  };

  componentDidMount() {
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.searchInput = React.createRef();
    document.addEventListener("mousedown", this.handleClickOutside);
    this.props.getPackage({
      Type: "enterprise",
      IsPaginated: true,
      PageSize: 10,
      PageNumber: this.state.pageNumber,
    });
  }

  componentDidUpdate() {
    setStorage(
      setStorage(
        constants.sessionStoragecache.ownerEnterPriseListng,
        this.state
      )
    );
  }

  columnsCad = [
    {
      attrs: { datatitle: "Enterprise Plan Name" },
      dataField: "name",
      text: this.props.t("superAdmin.enterprisePlanName"),
      formatter: (cellContent, row, rowIndex) => (
        <Link
          to={{
            pathname: `/owners/${row.id}`,
            state: row,
          }}
        >
          <span>
            <u>{cellContent}</u>
          </span>
        </Link>
      ),
    },
    {
      attrs: { datatitle: "Enterprise Plan Name" },
      dataField: "setupFeeChargeInCad",
      text: this.props.t("superAdmin.setUpFees"),
      formatter: (cellContent, row, rowIndex) => (
        <span>{convertIntoTwoDecimal(cellContent)}</span>
      ),
    },
    {
      attrs: { datatitle: "Office Charges/mo" },
      dataField: "perOfficeChargeInCad",
      text:
        this.props.t("superAdmin.officeCharges") +
        "/" +
        this.props.t("superAdmin.mo"),
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {this.props.t("superAdmin.cad")} {convertIntoTwoDecimal(cellContent)}
        </span>
      ),
    },
    {
      attrs: { datatitle: "Permanent Staff Charges/mo" },
      dataField: "perPermanentStaffMemberChargeInCad",
      text:
        this.props.t("superAdmin.permanentStaffCharges") +
        "/" +
        this.props.t("superAdmin.mo"),
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {this.props.t("superAdmin.cad")} {convertIntoTwoDecimal(cellContent)}
        </span>
      ),
    },
    {
      attrs: { datatitle: "Temporary Staff Charges/mo" },
      dataField: "perTemporaryStaffMemberChargeInCad",
      text:
        this.props.t("superAdmin.temporaryStaffCharges") +
        "/" +
        this.props.t("superAdmin.mo"),
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {this.props.t("superAdmin.cad")} {convertIntoTwoDecimal(cellContent)}
        </span>
      ),
    },
    {
      attrs: { datatitle: "Placement Charges" },
      dataField: "perPlacementChangeInCad",
      text: this.props.t("superAdmin.placementCharges"),
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {this.props.t("superAdmin.cad")} {convertIntoTwoDecimal(cellContent)}
        </span>
      ),
    },
    {
      dataField: "Actions",
      text: "",
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <Link
            to={{
              pathname: `/edit-enterprise-plan`,
              state: row,
            }}
          >
            <span className="edit-link">{this.props.t("edit")}</span>
          </Link>
        </Fragment>
      ),
    },
  ];

  columnsUsd = [
    {
      attrs: { datatitle: "Enterprise Plan Name" },
      dataField: "name",
      text: this.props.t("superAdmin.enterprisePlanName"),
      formatter: (cellContent, row, rowIndex) => (
        <Link
          to={{
            pathname: `/owners/${row.id}`,
            state: row,
          }}
        >
          <span>
            <u>{cellContent}</u>
          </span>
        </Link>
      ),
    },
    {
      attrs: { datatitle: "Enterprise Plan Name" },
      dataField: "setupFeeChargeInUsd",
      text: this.props.t("superAdmin.setUpFees"),
      formatter: (cellContent, row, rowIndex) => (
        <span>{convertIntoTwoDecimal(cellContent)}</span>
      ),
    },
    {
      attrs: { datatitle: "Office Charges/mo" },
      dataField: "perOfficeChargeInUsd",
      text:
        this.props.t("superAdmin.officeCharges") +
        "/" +
        this.props.t("superAdmin.mo"),
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {this.props.t("superAdmin.usd")} {convertIntoTwoDecimal(cellContent)}
        </span>
      ),
    },
    {
      attrs: { datatitle: "Permanent Staff Charges/mo" },
      dataField: "perPermanentStaffMemberChargeInUsd",
      text:
        this.props.t("superAdmin.permanentStaffCharges") +
        "/" +
        this.props.t("superAdmin.mo"),
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {this.props.t("superAdmin.usd")} {convertIntoTwoDecimal(cellContent)}
        </span>
      ),
    },
    {
      attrs: { datatitle: "Temporary Staff Charges/mo" },
      dataField: "perTemporaryStaffMemberChargeInUsd",
      text:
        this.props.t("superAdmin.temporaryStaffCharges") +
        "/" +
        this.props.t("superAdmin.mo"),
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {this.props.t("superAdmin.usd")} {convertIntoTwoDecimal(cellContent)}
        </span>
      ),
    },
    {
      attrs: { datatitle: "Placement Charges" },
      dataField: "perPlacementChangeInUsd",
      text: this.props.t("superAdmin.placementCharges"),
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {this.props.t("superAdmin.usd")} {convertIntoTwoDecimal(cellContent)}
        </span>
      ),
    },
    {
      dataField: "Actions",
      text: "",
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <Link
            to={{
              pathname: `/edit-enterprise-plan`,
              state: row,
            }}
          >
            <span className="edit-link">{this.props.t("edit")}</span>
          </Link>
        </Fragment>
      ),
    },
  ];

  handlePagination = (page) => {
    this.props.getPackage({
      Type: "enterprise",
      IsPaginated: true,
      PageSize: 10,
      PageNumber: page,
      searchTerm: this.state.searchType,
    });
    this.setState({ pageNumber: page });
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

  debounceSearch = debounce((searchText) => {
    this.props.getPackage({
      Type: "enterprise",
      IsPaginated: true,
      PageSize: 10,
      PageNumber: 1,
      searchTerm: searchText,
    });
  }, 1000);

  handleSerachFilter = (e) => {
    this.setState({ searchType: e.target.value });
    this.debounceSearch(e.target.value);
  };

  render() {
    const { enterprisePlans, isLoadError, t } = this.props;
    const isDataExist = enterprisePlans?.data?.length > 0 ? true : false;
    const { activePrice } = this.state;

    return (
      <div className="enterprise-plans">
        <div className="container">
          <button className="back-btn">
            <Link to="/subscription-management">
              <span className="ico">
                <img
                  src={require("assets/images/arrow-back-icon.svg").default}
                  alt="arrow"
                />
              </span>
              {t("back")}
            </Link>
          </button>

          <div className="header">
            <div className="row no-gutters align-items-center">
              <div className="col-md-6">
                <h2 className="title">
                  {t("superAdmin.enterpriseOfficePlans")}
                </h2>
              </div>
              <div className="col-md-6 text-md-right">
                <Link
                  to="/add-enterprise-plan"
                  className="button button-round button-shadow button-width-large"
                  title={t("superAdmin.addNewPlan")}
                >
                  {t("superAdmin.addNewPlan")}
                </Link>
              </div>
            </div>
            <div className="parent-currency-container ">
              <div className="filter-section">
                <div
                  className="search-box"
                  onClick={this.showSearch}
                  ref={this.searchInput}
                >
                  <input
                    type="text"
                    placeholder={t("superAdmin.searchPlans")}
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
              </div>{" "}
              <div className="currency-container ">
                <label className="currency">{t("cad")}</label>
                <ToggleSwitch
                  label="sales-rep-status"
                  value={this.state.activePrice === acticeTab.USD}
                  onChange={(event) => {
                    this.setState({
                      activePrice: event.target.checked
                        ? acticeTab.USD
                        : acticeTab.CAD,
                    });
                  }}
                />
                <label className="currency">{t("usd")}</label>
              </div>
            </div>
          </div>
          <div className="data-list">
            {acticeTab.CAD === activePrice && isDataExist && (
              <Table
                columns={this.columnsCad}
                data={enterprisePlans ? enterprisePlans.data : []}
                handlePagination={this.handlePagination}
                keyField="id"
                pageNumber={
                  enterprisePlans && enterprisePlans.pagination.currentPage
                }
                totalItems={
                  enterprisePlans && enterprisePlans.pagination.totalItems
                }
              />
            )}

            {acticeTab.USD === activePrice && isDataExist && (
              <Table
                columns={this.columnsUsd}
                data={enterprisePlans ? enterprisePlans.data : []}
                handlePagination={this.handlePagination}
                keyField="id"
                pageNumber={
                  enterprisePlans && enterprisePlans.pagination.currentPage
                }
                totalItems={
                  enterprisePlans && enterprisePlans.pagination.totalItems
                }
              />
            )}

            {(isLoadError || !isDataExist) && (
              <Empty Message={t("superAdmin.emptyEnterprisePlanListMessage")} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  sub: { statusMessage, isLoading, enterprisePlans, isLoadError },
}) => ({
  statusMessage,
  isLoading,
  profile,
  enterprisePlans,
  isLoadError,
});

export default connect(mapStateToProps, { getPackage })(
  _isLoading(withTranslation()(EnterPrisePlans))
);
