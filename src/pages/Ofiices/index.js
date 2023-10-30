import React, { Component } from "react";
/*components*/
import SetupOffice from "./components/SetupOffice";
import Office from "./components/Office";
import { connect } from "react-redux";
import _isLoading from "hoc/isLoading";
import Toast from "components/Toast";
import InfiniteScroll from "react-infinite-scroll-component";
import { Modal, ModalBody } from "reactstrap";
import Text from "components/Text";
import crossIcon from "./../../assets/images/cross.svg";
/*actions*/
import { getOffices, getOfficesScroll } from "actions/index";
import { withTranslation } from "react-i18next";
import constants from "./../../constants";
import editProfileWarningIcon from "./../../assets/images/info-icon.png";
import crossIconGrey from "./../../assets/images/mir_cross_grey.png";

import { Link } from "react-router-dom";
import EmptyOfficeDownloadApp from "./EmptyOfficeDownloadApp";
import CustomModal from "components/CustomModal";

class OfficesComp extends Component {
  state = {
    isToastView: false,
    hasMore: true,
    managerPopup: false,
    managerList: [],
    onlineToastView: sessionStorage.getItem(constants.lsKeys.OwnerOnlineToast)
      ? false
      : true,
    subscriptionTerminatedModal: false,
  };

  componentDidMount() {
    const Payload = {
      Id: this.props.profile && this.props.profile.id,
      pageNumber: 1,
      pageSize: 10,
    };
    this.props.getOffices(Payload);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.statusMessage !== this.props.statusMessage) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true, hasMore: true });
      setTimeout(() => {
        if (!this.props.isLoadError && !this.props.isOfficeLoadList) {
          this.setState({ isToastView: false });
        }
      }, 1500);
    }
  }

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

  listHide = () => {
    this.setState({ managerList: [], managerPopup: false });
  };

  onlineToastViewHide = () => {
    sessionStorage.setItem(
      constants.lsKeys.OwnerOnlineToast,
      constants.lsKeys.OwnerOnlineToast
    );
    this.setState({ onlineToastView: false });
  };

  showSelectedManagers = (data) => {
    const managerList = [];
    const managerNames = data.managersNames
      ? data.managersNames.split(", ")
      : [];
    const managerImages = data.managerImages
      ? data.managerImages.split(", ")
      : [];
    if (managerNames.length > 0) {
      managerNames.forEach((v, i) => {
        managerList.push({ name: v, image: managerImages[i] });
      });
    }
    this.setState({ managerList, managerPopup: true });
  };
  render() {
    const {
      Offices,
      statusMessage,
      isLoadError,
      profile,
      isOfficeLoadList,
      t,
    } = this.props;
    //Subscription Terminated Modal Functionality
    const isSubscriptionTerminated = !!(
      profile && profile.profileSetupStep === "subscriptionTerminated"
    );
    const setSubscriptionTerminatedModal = (value) => {
      this.setState({
        subscriptionTerminatedModal: value,
      });
    };
    const showSubscriptionTerminatedModal = () => {
      if (isSubscriptionTerminated) {
        setSubscriptionTerminatedModal(true);
      }
    };
    /////////////////////////////////////////////////
    const { isToastView, managerPopup, managerList } = this.state;
    let officeDataList = null;
    if (Offices && Offices.length) {
      officeDataList = Offices.map((item) => (
        <div className="col-lg-4 col-md-6" key={item.id}>
          {" "}
          <Office
            data={item}
            currentPage={Offices.length}
            showSelectedManagers={this.showSelectedManagers}
            isSubscriptionTerminated={isSubscriptionTerminated}
            showSubscriptionTerminatedModal={showSubscriptionTerminatedModal}
          />
        </div>
      ));
    }
    const managerListPopup = (
      <Modal
        isOpen={managerPopup}
        toggle={this.listHide}
        className="modal-dialog-centered"
        modalClassName="custom-modal office-manager-modal"
      >
        <span className="close-btn" onClick={this.listHide}>
          <img src={crossIcon} alt="close" />
        </span>
        <ModalBody>
          <Text size="25px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {" "}
              {t("accountOwner.officeManagers")}
            </span>{" "}
          </Text>
          <ul className="manager-list">
            {managerList.map((item, index) => (
              <li key={index}>
                <div className="staff-img">
                  <img
                    src={
                      item.image === "null"
                        ? require("assets/images/default-image.svg").default
                        : item.image
                    }
                    alt="staff-img"
                    onError={(i) =>
                      (i.target.src =
                        require("assets/images/default-image.svg").default)
                    }
                  />
                </div>
                <Text size="14px" color="#102c42" weight="600">
                  {item.name}
                </Text>
              </li>
            ))}
          </ul>
        </ModalBody>
      </Modal>
    );

    const ToastView = () => {
      if (!this.state.onlineToastView) return null;
      return (
        <div className="edit-profile-warning-container container mb-4">
          <div className="edit-profile-warning-bg ">
            <img
              className="edit-profile-warning-icon"
              src={editProfileWarningIcon}
              alt="warning icon"
            />
            <div className="edit-profile-warning-text">
              {t("accountOwner.editProfileWarningMessage")}&nbsp;
              <strong>
                {!isSubscriptionTerminated && (
                  <Link
                    to={constants.routes.editProfile}
                    className="edit-profile-warning-text"
                  >
                    {t("accountOwner.editProfile")}
                  </Link>
                )}
                {isSubscriptionTerminated && (
                  <span
                    onClick={showSubscriptionTerminatedModal}
                    className="link-btn font-bold edit-profile-warning-text"
                  >
                    {t("accountOwner.editProfile")}
                  </span>
                )}
              </strong>
              <p className="mb-0">
                {" "}
                {t("accountOwner.NeedHelpAcMsg")}&nbsp;
                <strong>
                  <Link
                    to={constants.routes.onlineHelp}
                    className="edit-profile-warning-text"
                  >
                    {t("accountOwner.OnlineHelpTitle")}
                  </Link>
                </strong>
              </p>
            </div>
            <div onClick={this.onlineToastViewHide} className="pointer">
              <img
                src={crossIconGrey}
                className="close-icon"
                alt="cross icon"
              />
            </div>
          </div>
        </div>
      );
    };
    return (
      <div className="office-listing-block pb-0">
        <ToastView />
        {managerList.length > 0 && managerPopup && managerListPopup}
        {isToastView && statusMessage && (
          <Toast
            message={statusMessage}
            handleClose={this.toastHide}
            errorToast={isLoadError || isOfficeLoadList ? true : false}
          />
        )}
        <div className="container cus_page">
          <h2>{t("myOffices")}</h2>
          <div className="data-list">
            <InfiniteScroll
              dataLength={Offices && Offices.length}
              next={this.fetchMoreData}
              hasMore={this.state.hasMore}
            >
              <div className="row gutters-14">
                {officeDataList}
                {this.props.profile &&
                  Offices &&
                  this.props.profile.officesAvailableToAdd > 0 &&
                  this.props.profile.profileSetupStep !== "packageExpired" &&
                  this.props.profile.profileSetupStep !==
                    "subscriptionTerminated" && (
                    <div className="col-lg-4  col-md-6">
                      <SetupOffice />
                    </div>
                  )}
              </div>
            </InfiniteScroll>
          </div>

          {profile &&
            profile.userSubscription &&
            profile.userSubscription.packageType ===
              constants.packageTypes.free && (
              <div className="free-package-container">
                <div className="free-package-banner">
                  <p className="free-package-title">
                    {t("accountOwner.freeAccountBannerText")}
                  </p>
                  <div className="upgrade-bg">
                    <p className="upgrade-text">
                      {t("accountOwner.freeAccountUpgradeText")}
                    </p>
                    <Link
                      to={constants.routes.accountOwner.managePlan}
                      className="button button-round button-shadow"
                    >
                      {t("accountOwner.freeAccountUpgradeButtonText")}
                    </Link>
                  </div>
                </div>
              </div>
            )}
        </div>
        <EmptyOfficeDownloadApp />
        <CustomModal
          isOpen={this.state.subscriptionTerminatedModal}
          setIsOpen={setSubscriptionTerminatedModal}
          title={t("accountOwner.subscriptionTerminated")}
          subTitle1={t("accountOwner.subscriptionTerminatedDesc")}
          rightBtnText={t("ok")}
        />
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  offices: {
    Offices,
    isLoading,
    statusMessage,
    isLoadError,
    isOfficeLoadList,
    pagnation,
  },
  errors: { isError },
}) => ({
  Offices,
  isLoading,
  isError,
  profile,
  statusMessage,
  isLoadError,
  isOfficeLoadList,
  pagnation,
});

export default connect(mapStateToProps, { getOffices, getOfficesScroll })(
  _isLoading(withTranslation()(OfficesComp))
);
