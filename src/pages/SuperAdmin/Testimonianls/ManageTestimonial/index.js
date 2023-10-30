import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getTestimonialList,
  getTestimonialCat,
  setTestimonialStatus,
} from "actions/index";
import Select from "react-select";

/*components*/
import _isLoading from "hoc/isLoading";
import Empty from "components/Empty";
import Table from "components/table";
import Toast from "components/Toast";
import { withTranslation } from "react-i18next";

class ManageTestimonial extends Component {
  state = {
    pageNumber: 1,
    filterTye: null,
    isProps: true,
    isToastView: false,
  };

  componentDidMount() {
    this.props.getTestimonialCat();
    this.props.getTestimonialList({
      PageSize: 10,
      PageNumber: 1,
      testimonialCategoryId: null,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.statusMessage !== this.props.statusMessage) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true });
      setTimeout(() => {
        if (!this.props.isStatusError) {
          this.setState({ isToastView: false });
        }
      }, 2000);
    }
  }

  handleMemberType = (data) => {
    this.setState({ filterTye: data.value });
    if (data.value !== 0) {
      this.props.getTestimonialList({
        PageSize: 10,
        PageNumber: 1,
        testimonialCategoryId: data.value,
      });
    } else {
      this.props.getTestimonialList({
        PageSize: 10,
        PageNumber: 1,
        testimonialCategoryId: null,
      });
    }
  };

  handlePagination = (page) => {
    this.setState({ pageNumber: page });
    this.props.getTestimonialList({
      PageSize: 10,
      PageNumber: page,
      testimonialCategoryId:
        this.state.filterTye !== "0" ? this.state.filterTye : null,
    });
  };

  columns = [
    {
      attrs: { datatitle: "Name" },
      dataField: "name",
      text: this.props.t("form.fields.name"),
      formatter: (cellContent, row, rowIndex) => (
        <span>
          {row && (
            <img
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                marginRight: "10px",
                borderRadius: "50%",
              }}
              src={
                row.imageUrl
                  ? `${row.imageUrl}`
                  : require("assets/images/default-image.svg").default
              }
              alt="img"
            />
          )}{" "}
          {row && row.name}
        </span>
      ),
    },
    {
      attrs: { datatitle: "Designation" },
      dataField: "designation",
      text: this.props.t("superAdmin.designation"),
    },
    {
      attrs: { datatitle: "Category" },
      dataField: "category.title",
      text: this.props.t("superAdmin.category"),
    },
    {
      attrs: { datatitle: "Description" },
      dataField: "content",
      text: this.props.t("superAdmin.description"),
    },

    {
      dataField: "",
      text: this.props.t("superAdmin.actions"),
      formatter: (cellContent, row, rowIndex) => (
        <Fragment>
          <Link
            to={{
              pathname: `/edit-testimonial`,
              state: row,
            }}
          >
            <span
              className="pointer"
              style={{
                fontSize: "12px",
                color: "#587e85",
                marginRight: "10px",
              }}
              title={this.props.t("superAdmin.edit")}
            >
              <u>{this.props.t("superAdmin.edit")}</u>
            </span>
          </Link>

          {row.isActive ? (
            <span
              className="pointer"
              style={{ fontSize: "12px", color: "#587e85" }}
              title={this.props.t("superAdmin.disable")}
              onClick={() => this.handleSetstatus(row.id, false)}
            >
              <u>{this.props.t("superAdmin.disable")}</u>
            </span>
          ) : (
            <span
              className="pointer"
              style={{ fontSize: "12px", color: "#587e85" }}
              title={this.props.t("superAdmin.enable")}
              onClick={() => this.handleSetstatus(row.id, true)}
            >
              <u>{this.props.t("superAdmin.enable")}</u>
            </span>
          )}
        </Fragment>
      ),
    },
  ];

  handleSetstatus = (id, status) => {
    const payload = {
      testimonialId: id,
      status,
      testimonialCategoryId: this.state.filterTye,
      pageNumber: this.state.pageNumber,
    };
    this.props.setTestimonialStatus({ ...payload });
  };

  toastHide = () => {
    this.setState({ isToastView: false });
  };

  render() {
    const {
      catList,
      TestimonialList,
      isLoadError,
      statusMessage,
      isStatusError,
      t,
    } = this.props;
    const { isToastView } = this.state;

    let options = [{ value: 0, label: "All Testimonials" }];

    if (catList) {
      catList.forEach((item) => {
        options.push({ value: item.id, label: item.title });
      });
    }

    return (
      <div className="testmonial-list-block">
        {isToastView && statusMessage && (
          <Toast
            message={statusMessage}
            handleClose={this.toastHide}
            errorToast={isStatusError ? true : false}
          />
        )}
        <div className="container">
          <div className="header">
            <div className="row no-gutters align-items-center">
              <div className="col-md-6">
                <h2 className="title">{t("superAdmin.manageTestimonials")}</h2>
              </div>
              <div className="col-md-6 text-md-right">
                <Link
                  to="/add-testimonial"
                  className="button button-round button-shadow button-width-large"
                  title="Add Testimonial"
                >
                  {t("superAdmin.addTestimonial")}
                </Link>
              </div>

              {catList && (
                <div className="col-md-6">
                  <div className="cat-filter">
                    <Select
                      className="react-select-container"
                      classNamePrefix="react-select"
                      options={options}
                      defaultValue={options[0]}
                      onChange={this.handleMemberType}
                      isSearchable={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="data-list">
            <Table
              columns={this.columns}
              data={(TestimonialList && TestimonialList.data) || []}
              handlePagination={this.handlePagination}
              keyField="id"
              pageNumber={
                TestimonialList && TestimonialList.pagination.currentPage
              }
              totalItems={
                TestimonialList && TestimonialList.pagination.totalItems
              }
            />

            {isLoadError ||
            (TestimonialList && TestimonialList.data.length == 0) ? (
              <Empty Message={t("superAdmin.emptyTestimonialListMesssage")} />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  Testimonials: {
    statusMessage,
    isLoading,
    TestimonialList,
    catList,
    isLoadError,
    isStatusError,
  },
}) => ({
  statusMessage,
  isLoading,
  TestimonialList,
  isLoadError,
  catList,
  isStatusError,
});

export default connect(mapStateToProps, {
  getTestimonialList,
  getTestimonialCat,
  setTestimonialStatus,
})(_isLoading(withTranslation()(ManageTestimonial)));
