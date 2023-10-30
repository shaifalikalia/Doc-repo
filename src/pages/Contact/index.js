import React, { Component } from "react";
import { connect } from "react-redux";
import { getContactConent, getCompanyInformation } from "actions";
/*components*/
import _isLoading from "hoc/isLoading";
import ScheduleForm from "components/Home-contact/components/schedule-form";
import ReachUs from "components/Home-contact/components/reach-us";
import { withTranslation, Trans } from "react-i18next";
class Contact extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getCompanyInformation();
  }
  render() {
    const { t } = this.props;
    let email =
      (this.props.companyInformation && this.props.companyInformation.email) ||
      "";

    return (
      <div className="app-page">
        <div className="contact-banner"></div>
        <div className="contact-schedule contact-section">
          <div className="container">
            <div className="schedule-block">
              <h2>{t("scheduleADemo")}</h2>
              <h4>{t("scheduleADemoText")}</h4>
              <ScheduleForm />
            </div>
          </div>
        </div>
        <div className="support-block-section reach-us-support">
          <div className="container">
            <div className="row no-gutters">
              <div className="col-md-6">
                <div className="support-content reach-us-block">
                  <h2>{t("support")}</h2>
                  <p>
                    <Trans i18nKey="supportText">
                      Having any questions or query? <br /> Drop an email or
                      call us.
                    </Trans>
                  </p>
                  <div class="contact-dtl">
                    <div class="content-container">
                      <ul>
                        <li>
                          <a href={`mailto:${email}`}>{email}</a>
                        </li>
                        <li>
                          {this.props.companyInformation &&
                            this.props.companyInformation.phone}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="reach-us-content">
                  <ReachUs companyInformation={this.props.companyInformation} />
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
  pageContent: { isLoading, pageContent, contactContent, companyInformation },
  errors: { isError },
}) => ({
  isLoading,
  isError,
  profile,
  pageContent,
  contactContent,
  companyInformation,
});

export default connect(mapStateToProps, {
  getContactConent,
  getCompanyInformation,
})(_isLoading(withTranslation()(Contact)));
