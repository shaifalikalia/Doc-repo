import React from "react";
import "./../../ThankYouDownload.scss";

import { withTranslation } from "react-i18next";

const AboutMiraxis = (props) => {
  return (
    <div className="about-miraxis-section" id="contact">
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <div className="about-miraxis">
              <h2>About Miraxis</h2>
              <p>
                <span className="heading">Miraxis</span> simplifies the everyday
                tasks of healthcare management—for one practice or multiple
                clinics—through its innovative fully-integrated, all-in-one
                platform, helping dentists, physicians, pharmacists, office
                managers, healthcare administrators, personnel, vendors, and
                patients connect, collaborate, and thrive. More than just
                another practice management software, Miraxis automatically
                integrates a full range of healthcare management
                workflows—including staff management, payroll, patient
                scheduling, practice management, ordering, inventory management,
                patient communication, and more—to bring order to the chaos of
                the business of healthcare and empower the industry to practice
                smarter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(AboutMiraxis);
