import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

/*components*/
import Select from "react-select";
import StaffCard from "./components/StaffCard";
import _isLoading from "hoc/isLoading";
import Empty from "components/Empty";
/*actions*/
import {
  getstaffMembers,
  getstaffMembersScroll,
  getOfficesDetail,
} from "actions/index";
import { withTranslation } from "react-i18next";
import constants from "./../../constants";
import { decodeId, encodeId } from "utils";

const options = [
  { value: "1", label: "Active Members" },
  { value: "2", label: "Inactive Members" },
  { value: "3", label: "Pending Members" },
  { value: "4", label: "All Members" },
];

class Staff extends Component {
  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      hasMore: true,
      memberTyppe: 4,
      searchType: "",
    };
  }

  componentDidMount() {
    const payload = {
      officeId: parseInt(decodeId(this.props.match.params.id)),
      type: 4,
      searchTerm: "",
      pageNo: 1,
      pageSize: 10,
      sortBy: null,
      sortOrder: null,
    };

    this.props.getstaffMembers({ ...payload });
    this.searchInput = React.createRef();
    document.addEventListener("mousedown", this.handleClickOutside);

    this.props.getOfficesDetail({ Id: decodeId(this.props.match.params.id) });
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  goBackToStaffOfficeAdmin = () => {
    const officeId = this.props.location?.state?.officeData?.id;
    const isAdmin = this.props.location?.state?.officeData?.isAdmin;

    if (isAdmin) {
      this.props.history.push({
        pathname: constants.routes.staff.officeAdmin.replace(
          ":officeId",
          encodeId(officeId)
        ),
        state: this.props.location.state,
      });
    } else {
      this.props.history.push({
        pathname: constants.routes.accountOwner.officeOptions.replace(
          ":officeId",
          this.props.match.params.id
        ),
        state: {
          officeName:
            this.props.location.state && this.props.location.state.officeName,
        },
      });
    }
  };

  handleMemberType = (data) => {
    this.setState({ hasMore: true });
    this.setState({ memberTyppe: parseInt(data.value), searchType: "" });
    const payload = {
      officeId: parseInt(decodeId(this.props.match.params.id)),
      type: parseInt(data.value),
      searchTerm: "",
      pageNo: 1,
      pageSize: 10,
      sortBy: null,
      sortOrder: null,
    };
    this.props.getstaffMembers({ ...payload });
  };

  fetchMoreData = () => {
    if (
      this.props.pagnation &&
      this.props.pagnation.currentPage !== this.props.pagnation.totalPages
    ) {
      const payload = {
        officeId: parseInt(decodeId(this.props.match.params.id)),
        type: this.state.memberTyppe,
        pageNo: this.props.pagnation.currentPage + 1,
        searchTerm: this.state.searchType,
        pageSize: 10,
        sortBy: null,
        sortOrder: null,
      };

      this.props.getstaffMembersScroll({ ...payload });
    }

    if (
      this.props.pagnation &&
      this.props.pagnation.currentPage === this.props.pagnation.totalPages
    ) {
      this.setState({ hasMore: false });
    }
  };

  handleSerachFilter = (e) => {
    const payload = {
      officeId: parseInt(decodeId(this.props.match.params.id)),
      type: this.state.memberTyppe,
      searchTerm: e.target.value,
      pageNo: 1,
      pageSize: 10,
      sortBy: null,
      sortOrder: null,
    };

    this.props.getstaffMembers({ ...payload });
    this.setState({ searchType: e.target.value, hasMore: true });
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
    const { staffMembers, isLoading, t, officeDetail } = this.props;
    const officeActive = officeDetail?.isActive;

    let starffDataList = null;

    if (staffMembers.length > 0) {
      starffDataList = staffMembers.map((item, index) => (
        <div className="col-xl-3 col-lg-4 col-md-6" key={index}>
          <StaffCard
            data={item}
            OfficeId={decodeId(this.props.match.params.id)}
          />
        </div>
      ));
    } else if (staffMembers.length === 0 && !isLoading) {
      starffDataList = (
        <div className="empty-list-block">
          <div className="col-12">
            {this.props.profile &&
            this.props.profile.profileSetupStep !== "packageExpired" &&
            this.props.profile.profileSetupStep !== "subscriptionTerminated" &&
            this.props.officeDetail &&
            officeActive ? (
              <Fragment>
                <Empty Message={t("accountOwner.addMoreStaff")} />
                <Link to={`/AddStaff/${this.props.match.params.id}`}>
                  <button
                    className="button button-round button-border button-dark"
                    title={t("accountOwner.addStaff")}
                  >
                    {t("accountOwner.addStaff")}
                  </button>
                </Link>
              </Fragment>
            ) : (
              <Empty Message={t("noStaffMemberFound")} />
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="staff-listing-block">
        <div className="container">
          <button className="back-btn" onClick={this.goBackToStaffOfficeAdmin}>
            <span className="ico">
              <img
                src={require("assets/images/arrow-back-icon.svg").default}
                alt="arrow"
              />
            </span>
            {t("back")}
          </button>

          <div className="row no-gutters align-items-center mt-2">
            <div className="col-md-7">
              <h2 className="title">{this.props.officeDetail?.name || null}</h2>
              <p className="sub-title">{t("staffMembers")}</p>
            </div>
            {staffMembers && staffMembers?.length > 0 && officeActive && (
              <div className="col-md-5 text-md-right">
                <Link
                  to={`/AddStaff/${this.props.match.params.id}`}
                  className="button button-round button-width-large add-button"
                  title={t("accountOwner.addStaff")}
                >
                  {t("accountOwner.addStaff")}
                </Link>
              </div>
            )}
          </div>

          <div className="filter-section d-flex justify-content-between flex-column flex-lg-row custom-filter-section">
            <div className="member-filter order-2 order-lg-1">
              <span className="ico">
                <img
                  src={require("assets/images/user-icon.svg").default}
                  alt="icon"
                />
              </span>
              <div className="custom-cursor-pointer">
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={options}
                  defaultValue={options[3]}
                  onChange={this.handleMemberType}
                  isSearchable={false}
                />
              </div>
            </div>

            <div
              className="search-box custom-search order-1 order-lg-2 mb-3 mb-lg-0 mt-0"
              onClick={this.showSearch}
              ref={this.searchInput}
            >
              <input
                type="text"
                placeholder={t("accountOwner.searchStaff")}
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

          <div className="data-list">
            <InfiniteScroll
              dataLength={staffMembers && staffMembers.length}
              next={this.fetchMoreData}
              hasMore={this.state.hasMore}
            >
              <div className="row gutters-14">{starffDataList}</div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  offices: { officeDetail },
  staff: { staffMembers, isLoading, pagnation },
  errors: { isError },
}) => ({
  staffMembers,
  isLoading,
  isError,
  pagnation,
  profile,
  officeDetail,
});

export default connect(mapStateToProps, {
  getstaffMembers,
  getstaffMembersScroll,
  getOfficesDetail,
})(_isLoading(withTranslation()(Staff)));
