import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getAllCardByOffice } from "actions/index";
import ReactPaginate from "react-paginate";
/*components*/
import _isLoading from "hoc/isLoading";
import Empty from "components/Empty";
import { withTranslation } from "react-i18next";

class ManageCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchType: "",
    };
  }

  componentDidMount() {
    const payload = {
      PageSize: 5,
      PageNumber: 1,
    };

    if (
      this.props.profile &&
      this.props.profile.userSubscription.packageType === "trial"
    ) {
      this.props.history.push("/");
    } else {
      this.props.getAllCardByOffice({ ...payload });
    }
  }

  handleSerachFilter = (e) => {
    const payload = {
      PageSize: 5,
      PageNumber: 1,
      searchTerm: e.target.value,
    };

    this.props.getAllCardByOffice({ ...payload });
    this.setState({ searchType: e.target.value });
  };

  handlePageClick = (data) => {
    const payload = {
      PageSize: 5,
      PageNumber: data.selected + 1,
    };
    this.props.getAllCardByOffice({ ...payload });
  };

  render() {
    const { officecardList, isLoadError, t } = this.props;

    let officeCard = null;

    if (officecardList && officecardList.data.length > 0) {
      officeCard = (
        <ul>
          {officecardList.data.map((item) => {
            if (item.card && item.card.last4Digit) {
              return (
                <li key={item.id}>
                  <h4>
                    {item.name && `${t("accountOwner.for")} ${item.name}`}
                  </h4>
                  <label>{t("accountOwner.creditCardDetails")}</label>
                  <div className="row no-gutters">
                    <div className="col-md-8">
                      <div className="card_type">
                        <span className="_img">
                          {item.card.type === "mastercard" ? (
                            <img
                              src={
                                require("assets/images/master-card.svg").default
                              }
                              alt="img"
                            />
                          ) : item.card.type === "visa" ? (
                            <img
                              src={
                                require("assets/images/visa-card.svg").default
                              }
                              alt="img"
                            />
                          ) : item.card.type === "discover" ? (
                            <img
                              src={
                                require("assets/images/discover-card.svg")
                                  .default
                              }
                              alt="img"
                            />
                          ) : item.card.type === "amex" ? (
                            <img
                              src={
                                require("assets/images/american-express-card.svg")
                                  .default
                              }
                              alt="img"
                            />
                          ) : (
                            <img
                              src={
                                require("assets/images/credit-card.svg").default
                              }
                              alt="img"
                            />
                          )}
                        </span>
                        <span>
                          {item.card.last4Digit &&
                            `**** **** **** ${item.card.last4Digit}`}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <Link
                        to={{ pathname: `/change-card-detail/${item.id}` }}
                        className="_link"
                      >
                        {t("accountOwner.changeCardDetails")}
                      </Link>
                    </div>
                  </div>
                </li>
              );
            } else {
              return (
                <li key={item.id}>
                  <label>{t("accountOwner.creditCardDetails")}</label>
                  <div className="row no-gutters">
                    <div className="col-md-8">
                      <div className="card_type">
                        <span className="_img">
                          {item.type === "mastercard" ? (
                            <img
                              src={
                                require("assets/images/master-card.svg").default
                              }
                              alt="img"
                            />
                          ) : item.type === "visa" ? (
                            <img
                              src={
                                require("assets/images/visa-card.svg").default
                              }
                              alt="img"
                            />
                          ) : item.type === "discover" ? (
                            <img
                              src={
                                require("assets/images/discover-card.svg")
                                  .default
                              }
                              alt="img"
                            />
                          ) : item.type === "amex" ? (
                            <img
                              src={
                                require("assets/images/american-express-card.svg")
                                  .default
                              }
                              alt="img"
                            />
                          ) : (
                            <img
                              src={
                                require("assets/images/credit-card.svg").default
                              }
                              alt="img"
                            />
                          )}
                        </span>
                        <span>
                          {item.last4Digit &&
                            `**** **** **** ${item.last4Digit}`}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <Link
                        to={{ pathname: `/change-card-detail/${item.id}` }}
                        className="_link"
                      >
                        {t("accountOwner.changeCardDetails")}
                      </Link>
                    </div>
                  </div>
                </li>
              );
            }
          })}
        </ul>
      );
    }

    return (
      <div className="manage-cards-listing-block">
        <div className="container">
          <button className="back-btn">
            {/*  eslint-disable-next-line  */}
            <a className="_link" onClick={() => this.props.history.goBack()}>
              <span className="ico">
                <img
                  src={require("assets/images/arrow-back-icon.svg").default}
                  alt="arrow"
                />
              </span>
              {t("back")}
            </a>
          </button>
        </div>
        <div className="container container-smd">
          <h2 className="title">
            {this.props.profile &&
            this.props.profile.billingPreferenceType === 2
              ? t("accountOwner.manageCardHeading")
              : t("accountOwner.card")}
          </h2>

          {this.props.profile &&
            this.props.profile.billingPreferenceType === 2 && (
              <Fragment>
                {!isLoadError && (
                  <div className="filter-section">
                    <div className="search-box open">
                      <input
                        type="text"
                        placeholder={t("accountOwner.searchOfficeByName")}
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
                )}
              </Fragment>
            )}

          {officeCard && <div className="office-card-list">{officeCard}</div>}

          {isLoadError ||
          (officecardList && officecardList.data.length === 0) ? (
            <Empty Message="No  items found" />
          ) : null}

          {officecardList &&
            officecardList.pagination &&
            officecardList.pagination.totalPages > 1 && (
              <div className="custom-pagnation pagnation-block">
                {officecardList && (
                  <ReactPaginate
                    activeClassName={"active"}
                    breakClassName={"break-me"}
                    breakLabel={"..."}
                    containerClassName={"pagination"}
                    forcePage={officecardList.pagination.currentPage - 1}
                    marginPagesDisplayed={1}
                    nextLabel={">"}
                    onPageChange={this.handlePageClick}
                    pageCount={officecardList.pagination.totalPages}
                    pageRangeDisplayed={4}
                    previousLabel={"<"}
                    subContainerClassName={"pages pagination"}
                  />
                )}
              </div>
            )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  sub: { isLoading, statusMessage, officecardList, isLoadError },
  errors: { isError },
}) => ({
  isLoading,
  statusMessage,
  officecardList,
  isError,
  profile,
  isLoadError,
});

export default connect(mapStateToProps, { getAllCardByOffice })(
  _isLoading(withTranslation()(ManageCards))
);
