import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getpagecontent, updatepagecontent } from "actions/index";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

/*components*/
import Select from "components/Select";
import _isLoading from "hoc/isLoading";
import Toast from "components/Toast";
import { withTranslation } from "react-i18next";
import constants from "../../../constants";

class ManageContent extends Component {
  editorConfig = {
    fontSize: {
      options: [9, 11, 13, "default", 17, 19, 21],
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },

    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "blockQuote",
      "fontSize",
      "fontColor",
      "FontBackgroundColor",
    ],
  };
  state = {
    pages: [
      { id: "TermsAndConditions", name: "Terms and Conditions", value: 1 },
      { id: "PrivacyPolicy", name: "Privacy Policy", value: 2 },
      { id: "AboutUs", name: "About Us", value: 3 },
      { id: "Email", name: "Email", value: 6 },
      { id: "Phone", name: "Phone", value: 7 },
      { id: "Address", name: "Address", value: 8 },
      {
        id: "TermsAndConditionsForPatient",
        name: "Terms and Conditions For Patient",
        value: 16,
      },
      {
        id: "PrivacyPolicyForPatient",
        name: "Privacy Policy  For Patient",
        value: 17,
      },
      {
        id: "OnlineHelpForPatient",
        name: "Online Help For Patient",
        value: 19,
      },
      { id: "FAQForPatient", name: "FAQ For Patient", value: 18 },
      { id: "FAQForAccountOwner", name: "FAQ For Account Owner", value: 20 },
      { id: "FAQForStaff", name: "FAQ For Staff", value: 22 },
      {
        id: "OnlineHelpForAccountOwner",
        name: "Online Help For Account Owner",
        value: 21,
      },
      { id: "OnlineHelpForStaff", name: "Online Help For Staff", value: 23 },
      { id: "OurMission", name: "Our Mission", value: 24 },
    ],
    currentPage: "TermsAndConditions",
    isProps: true,
    isActive: false,
    currentPageContent: null,
    isToastView: false,
  };

  componentDidMount() {
    this.props.getpagecontent({ id: constants.cmsPageKey.TermsAndConditions });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.statusMessage !== this.props.statusMessage) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true });
      setTimeout(() => {
        if (!this.props.isLoadError) {
          this.setState({ isToastView: false });
        }
      }, 2000);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (state.isProps && props.dataContent) {
      return {
        isActive: props.dataContent.isActive,
        currentPageContent: props.dataContent.content,
      };
    }
    return null;
  }

  handlePage = (event) => {
    const { value } = event.target;
    this.setState({ isProps: true, currentPage: value });
    this.props.getpagecontent({ id: value });
  };

  handlePageStatus = (event) => {
    this.setState({ isProps: false, isActive: event.target.checked });
  };
  handlePageContent = (data) => {
    this.setState({ isProps: false, currentPageContent: data });
  };

  handleSaveContent = () => {
    const { currentPage, currentPageContent, isActive, pages } = this.state;

    const payload = {
      id: pages.find((e) => e.id === currentPage)?.value,
      pageName: this.props.dataContent.pageName,
      content: currentPageContent,
      isActive,
    };

    this.props.updatepagecontent({ ...payload });
  };

  toastHide = () => {
    this.setState({ isToastView: false });
  };

  render() {
    const { currentPage, isActive, isToastView } = this.state;
    const { dataContent, statusMessage, isLoadError, t } = this.props;
    return (
      <div className="manage-content-block">
        {isToastView && statusMessage && (
          <Toast
            message={statusMessage}
            handleClose={this.toastHide}
            errorToast={isLoadError ? true : false}
          />
        )}
        <div className="container container-smd">
          <h2 className="title">{t("superAdmin.manageContent")}</h2>
          <div className="form-wrapper">
            <div className="content-field-group">
              <Select
                Title={t("superAdmin.contentType")}
                Options={this.state.pages}
                selectedOption={currentPage}
                HandleChange={this.handlePage}
              />
              {currentPage != 1 &&
                currentPage != 2 &&
                currentPage != 16 &&
                currentPage != 17 && (
                  <div className="active-checkbox">
                    <div className="ch-checkbox">
                      <label>
                        <input
                          type="checkbox"
                          name="isAdmin"
                          onChange={this.handlePageStatus}
                          checked={isActive}
                        />
                        <span>{t("superAdmin.active")}</span>
                      </label>
                    </div>
                  </div>
                )}
              <div className="content-editor">
                <label>{t("form.fields.content")}</label>
                <div className="document-editor">
                  <CKEditor
                    onReady={(editor) => {
                      editor.ui
                        .getEditableElement()
                        .parentElement.insertBefore(
                          editor.ui.view.toolbar.element,
                          editor.ui.getEditableElement()
                        );
                    }}
                    onChange={(event, editor) => {
                      this.handlePageContent(editor.getData());
                    }}
                    editor={DecoupledEditor}
                    data={dataContent && dataContent.content}
                    config={this.editorConfig}
                  />
                </div>
              </div>

              <div className="btn-field">
                <div className="row gutters-12">
                  <div className="col-md-auto col">
                    <button
                      className="button button-round button-shadow button-min-130"
                      title={t("save")}
                      onClick={this.handleSaveContent}
                    >
                      {t("save")}
                    </button>
                  </div>
                  <div className="col-md-auto col">
                    <Link to="/">
                      <button
                        className="button button-round button-border button-dark"
                        title={t("cancel")}
                      >
                        {t("cancel")}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  pageContent: { dataContent, isLoading, statusMessage, isLoadError },
  errors: { isError },
}) => ({
  dataContent,
  isLoading,
  isError,
  profile,
  statusMessage,
  isLoadError,
});

export default connect(mapStateToProps, { getpagecontent, updatepagecontent })(
  _isLoading(withTranslation()(ManageContent))
);
