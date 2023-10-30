import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function HourlyRate({ t, staffDetails, selectedReview, officeId }) {
  return (
    <>
      {staffDetails && (
        <>
          <div className="data-box">
            <div className="media">
              <img
                src={require("assets/images/job-hour.svg").default}
                className="align-self-center"
                alt="job"
              />
              <div className="media-body">
                <label>{t("staff.hourlyRate")}</label>
                <h4>
                  {staffDetails.hourlyRate
                    ? staffDetails.hourlyRate.toFixed(2) +
                      " " +
                      t("superAdmin.cad")
                    : "-"}
                </h4>
                {staffDetails.staffMemberId ? (
                  <Link
                    to={{
                      pathname: "/hourly-rate-history",
                      state: {
                        detail: staffDetails,
                        OfficeId: officeId,
                      },
                    }}
                  >
                    <span className="link-btn mb-3">
                      {t("staff.seeHistory")}
                    </span>
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="data-box">
            <div className="media">
              <img
                src={require("assets/images/job-link.svg").default}
                className="align-self-center"
                alt="job"
              />
              <div className="media-body">
                <label>{t("staff.linkedPerformanceReview")}</label>
                <h4>
                  {selectedReview ? selectedReview : t("staff.noReviews")}
                </h4>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default withTranslation()(HourlyRate);
