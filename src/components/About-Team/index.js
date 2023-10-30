import React, { useState } from "react";
import { withTranslation } from "react-i18next";

const AboutTeam = ({ t }, props) => {
  const [isTeamActive1, setTeamActive1] = useState(false);
  const [isTeamActive2, setTeamActive2] = useState(false);
  const [isTeamActive3, setTeamActive3] = useState(false);
  const [isTeamActive4, setTeamActive4] = useState(false);

  const toggleTeamClass1 = () => {
    setTeamActive1(!isTeamActive1);
  };
  const toggleTeamClass2 = () => {
    setTeamActive2(!isTeamActive2);
  };
  const toggleTeamClass3 = () => {
    setTeamActive3(!isTeamActive3);
  };
  const toggleTeamClass4 = () => {
    setTeamActive4(!isTeamActive4);
  };
  return (
    <div className="team-card-wrapper">
      <div className="card-col">
        <div className="team-card">
          <span className="team-icon" onClick={toggleTeamClass1}>
            {!isTeamActive1 ? (
              <img
                src={
                  require("assets/images/landing-pages/add-white-icon.svg")
                    .default
                }
                alt="img"
              />
            ) : (
              <img
                src={
                  require("assets/images/landing-pages/minus-white-icon.svg")
                    .default
                }
                alt="img"
              />
            )}
          </span>
          <div className="team-name">Madjid Rassamanesh</div>
          <div className="designation-box">{t("userPages.founder")}</div>
          <div
            className={`team-hidden-box ${isTeamActive1 ? " show-team" : ""}`}
          >
            <img
              className="team-img"
              src={
                require("assets/images/landing-pages/client-img1.jpg").default
              }
              alt="img"
            />
            <div className="team-desc">
              Founder of Miraxis Healthcare Technology Solutions. Strategic
              technology executive with an outstanding reputation for leading
              teams of professionals through significant challenges in a variety
              of industries and delivering innovative market solutions that have
              impacted top and bottom lines for organizations, as well as have
              lasting effects in many other areas.
            </div>
          </div>
        </div>

        <div className="team-card">
          <span className="team-icon" onClick={toggleTeamClass2}>
            {!isTeamActive2 ? (
              <img
                src={
                  require("assets/images/landing-pages/add-white-icon.svg")
                    .default
                }
                alt="img"
              />
            ) : (
              <img
                src={
                  require("assets/images/landing-pages/minus-white-icon.svg")
                    .default
                }
                alt="img"
              />
            )}
          </span>
          <div className="team-name">Russell Johnson</div>
          <div className="designation-box">{t("userPages.founder")}</div>
          <div
            className={`team-hidden-box ${isTeamActive2 ? " show-team" : ""}`}
          >
            <img
              className="team-img"
              src={
                require("assets/images/landing-pages/client-img3.jpg").default
              }
              alt="img"
            />
            <div className="team-desc">
              Founder of Miraxis Healthcare Technology Solutions. Strategic
              technology executive with an outstanding reputation for leading
              teams of professionals through significant challenges in a variety
              of industries and delivering innovative market solutions that have
              impacted top and bottom lines for organizations, as well as have
              lasting effects in many other areas.
            </div>
          </div>
        </div>
      </div>
      <div className="card-col">
        <div className="team-card">
          <span className="team-icon" onClick={toggleTeamClass3}>
            {!isTeamActive3 ? (
              <img
                src={
                  require("assets/images/landing-pages/add-white-icon.svg")
                    .default
                }
                alt="img"
              />
            ) : (
              <img
                src={
                  require("assets/images/landing-pages/minus-white-icon.svg")
                    .default
                }
                alt="img"
              />
            )}
          </span>
          <div className="team-name width-250">Livia Stanton</div>

          <div className="designation-box">{t("userPages.founder")}</div>
          <div
            className={`team-hidden-box ${isTeamActive3 ? " show-team" : ""}`}
          >
            <img
              className="team-img"
              src={
                require("assets/images/landing-pages/client-img2.jpg").default
              }
              alt="img"
            />
            <div className="team-desc">
              Founder of Miraxis Healthcare Technology Solutions. Strategic
              technology executive with an outstanding reputation for leading
              teams of professionals through significant challenges in a variety
              of industries and delivering innovative market solutions that have
              impacted top and bottom lines for organizations, as well as have
              lasting effects in many other areas.
            </div>
          </div>
        </div>

        <div className="team-card">
          <span className="team-icon" onClick={toggleTeamClass4}>
            {!isTeamActive4 ? (
              <img
                src={
                  require("assets/images/landing-pages/add-white-icon.svg")
                    .default
                }
                alt="img"
              />
            ) : (
              <img
                src={
                  require("assets/images/landing-pages/minus-white-icon.svg")
                    .default
                }
                alt="img"
              />
            )}
          </span>
          <div className="team-name width-250">Dulce George</div>
          <div className="designation-box">{t("userPages.founder")}</div>
          <div
            className={`team-hidden-box ${isTeamActive4 ? " show-team" : ""}`}
          >
            <img
              className="team-img"
              src={
                require("assets/images/landing-pages/client-img4.jpg").default
              }
              alt="img"
            />
            <div className="team-desc">
              Founder of Miraxis Healthcare Technology Solutions. Strategic
              technology executive with an outstanding reputation for leading
              teams of professionals through significant challenges in a variety
              of industries and delivering innovative market solutions that have
              impacted top and bottom lines for organizations, as well as have
              lasting effects in many other areas.{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(AboutTeam);
