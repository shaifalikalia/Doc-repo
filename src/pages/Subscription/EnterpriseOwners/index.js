import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getenterpriseOwners } from "actions/index";

/*components*/
import _isLoading from "hoc/isLoading";
import Empty from "components/Empty";
import Table from "components/table";
import { withTranslation } from "react-i18next";

class EnterPriseOwners extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getenterpriseOwners({
        PackageId: parseInt(this.props.match.params.id),
        PageSize: 10,
        PageNumber: 1,
      });
    }
    if (!this.props.location.state) {
      this.props.history.push("/enterprise-plans");
    }
  }

  columns = [
    {
      attrs: { datatitle: "Name" },
      dataField: "userName",
      text: this.props.t("form.fields.name"),
    },
    {
      attrs: { datatitle: "Email Address" },
      dataField: "userEmail",
      text: this.props.t("form.fields.emailAddress"),
    },
    {
      dataField: "Actions",
      text: "",
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <Link
            to={{
              pathname: `/edit-owner/${row.id}`,
              state: { editOwner: true, userId: this.props.match.params.id },
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
    });
  };

  render() {
    const { ownersList, isLoadError, t } = this.props;

    return (
      <div className="enterprise-plans">
        <div className="container">
          <button className="back-btn">
            <Link to="/enterprise-plans">
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
                  {this.props.location.state && (
                    <span>{this.props.location.state.name}</span>
                  )}
                </h2>
              </div>
              <div className="col-md-6 text-md-right">
                <Link
                  to={{
                    pathname: `/add-owner/${this.props.match.params.id}`,
                  }}
                  className="button button-round button-shadow button-width-large"
                  title={t("superAdmin.addNewAccountOwner")}
                >
                  {t("superAdmin.addNewAccountOwner")}
                </Link>
              </div>
            </div>
          </div>

          <div className="data-list">
            <Table
              columns={this.columns}
              data={(ownersList && ownersList.data) || []}
              handlePagination={this.handlePagination}
              keyField="id"
              pageNumber={ownersList && ownersList.pagination.currentPage}
              totalItems={ownersList && ownersList.pagination.totalItems}
            />
            {isLoadError || (ownersList && ownersList.data.length == 0) ? (
              <Empty
                Message={t("superAdmin.enterpriseOwnersEmptyListMessage")}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  sub: { statusMessage, isLoading, ownersList, isLoadError, enterprisePlans },
  errors: { isError },
}) => ({
  statusMessage,
  isLoading,
  isError,
  profile,
  ownersList,
  isLoadError,
  enterprisePlans,
});

export default connect(mapStateToProps, { getenterpriseOwners })(
  _isLoading(withTranslation()(EnterPriseOwners))
);
