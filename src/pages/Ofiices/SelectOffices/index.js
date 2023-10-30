import React, { Component, Fragment } from "react";

/*components*/
import OfficeCard from "../components/Office-Card";
import { connect } from "react-redux";
import _isLoading from "hoc/isLoading";
import Toast from "components/Toast";
import InfiniteScroll from "react-infinite-scroll-component";
import constants from "./../../../constants";

/*actions*/
import {
  getProfile,
  getOffices,
  getMyPlan,
  setEnaleOffice,
  getOfficesScroll,
  AddsubPackage,
} from "actions/index";

import { withTranslation } from "react-i18next";
import Loader from "components/Loader";
import { handleError } from "utils";

class SelectOffice extends Component {
  state = {
    officeIds: [],
    isToastView: false,
    hasMore: true,
  };

  componentDidMount() {
    const Payload = {
      Id: this.props.profile && this.props.profile.id,
      pageNumber: 1,
      pageSize: 10,
    };
    if (
      this.props.profile.role.systemRole ===
        constants.systemRoles.accountOwner &&
      !this.props.location.state
    ) {
      this.props.history.push("/");
    }
    this.props.getOffices(Payload);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.statusMessage !== this.props.statusMessage) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true });
      setTimeout(() => {
        if (!this.props.isLoadError) {
          window.location.reload();
          this.props.history.push("/");
        }
      }, 2000);
    }
  }

  handleSelectOffice = (event, id) => {
    if (event.target.checked) {
      const newValue = [...this.state.officeIds, id];
      this.setState({ officeIds: newValue });
    } else {
      let oldValue = [...this.state.officeIds].filter((item) => item !== id);
      this.setState({ officeIds: oldValue });
    }
  };

  handleActiveOffice = () => {
    if (Array.isArray(this.state.officeIds) && !this.state.officeIds.length) {
      handleError(
        { message: this.props.t("selectOfficeIds") },
        { duration: 3000 }
      );
      return;
    }
    const payload = {
      packageId: this.props.location.state.packageId,
      officeIds: this.state.officeIds,
    };
    this.props.AddsubPackage({ ...payload });
  };

  fetchMoreData = () => {
    if (
      this.props.pagnation &&
      this.props.pagnation.currentPage !== this.props.pagnation.totalPages
    ) {
      const Payload = {
        Id: this.props.profile && this.props.profile.id,
        pageNumber: this.props.pagnation.currentPage + 1,
        pageSize: 10,
      };

      this.props.getOfficesScroll({ ...Payload });
    }

    if (
      this.props.pagnation &&
      this.props.pagnation.currentPage === this.props.pagnation.totalPages
    ) {
      this.setState({ hasMore: false });
    }
  };

  toastHide = () => {
    this.setState({ isToastView: false });
  };

  render() {
    const { Offices } = this.props;
    let officeDataList = null;

    const { isToastView } = this.state;
    const { statusMessage, isLoadError, t, isLoading } = this.props;

    if (Offices && Offices.length) {
      officeDataList = Offices.map((item, index) => (
        <div className="col-lg-4  col-md-6" key={item.id}>
          <OfficeCard data={item} Clicked={this.handleSelectOffice} />
        </div>
      ));
    }

    return (
      <div className="office-listing-block choose-office-block">
        {isLoading && <Loader />}
        {isToastView && statusMessage && (
          <Toast
            message={statusMessage}
            handleClose={this.toastHide}
            errorToast={isLoadError ? true : false}
          />
        )}
        <div className="container">
          <div className="row no-gutters align-items-center">
            <div className="col-md-9">
              {this.props.location.state &&
              this.props.location.state.type === "single-office" ? (
                <Fragment>
                  <h2>{t("accountOwner.chooseOfficeTitle1")}</h2>
                  <h4 className="sub-heading">
                    {t("accountOwner.chooseOfficeDescription1")}
                  </h4>
                </Fragment>
              ) : (
                <Fragment>
                  <h2>{t("accountOwner.chooseOfficeTitle2")}</h2>
                  <h4 className="sub-heading">
                    {t("accountOwner.chooseOfficeDescription2")}
                  </h4>
                </Fragment>
              )}
            </div>
            <div className="col-md-3 text-md-right">
              <button
                className="button button-round button-shadow button-width-large contiune-button"
                title="Continue"
                onClick={this.handleActiveOffice}
              >
                {t("continue")}
              </button>
            </div>
          </div>

          <div className="data-list">
            <InfiniteScroll
              dataLength={Offices && Offices.length}
              next={this.fetchMoreData}
              hasMore={this.state.hasMore}
            >
              <div className="row">{officeDataList}</div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  offices: { Offices, pagnation, isLoading },
  sub: { statusMessage, isLoadError },
  errors: { isError },
}) => ({
  Offices,
  isLoading,
  isError,
  profile,
  statusMessage,
  isLoadError,
  pagnation,
});

export default connect(mapStateToProps, {
  getOffices,
  getProfile,
  getMyPlan,
  setEnaleOffice,
  getOfficesScroll,
  AddsubPackage,
})(_isLoading(withTranslation()(SelectOffice)));
