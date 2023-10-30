import React from "react";
import { withTranslation } from "react-i18next";

const OfficeCard = (props) => {
  const {
    data: { name, address, city, country, staffCount, staffImage },
  } = props;
  let staffImageArray = null;
  if (staffCount > 0) {
    staffImageArray = staffImage.split(", ");
  }

  const { t } = props;
  return (
    <div className="office-card">
      <div className="card-content">
        <div className="office-card-body">
          <h3>{name}</h3>
          <div className="media">
            <span className="ico">
              <img
                src={require("assets/images/address-icon.svg").default}
                alt="icon"
              />
            </span>
            <div className="media-body align-self-center">
              <p>
                {[address, " ", city]} {country}{" "}
              </p>
            </div>
          </div>
          {staffCount > 0 && (
            <div className="staff-list">
              <h5>{t("staffMembers")}</h5>

              <ul>
                {staffImageArray.map((item, index) => (
                  <li key={index}>
                    <img
                      src={
                        item === "null"
                          ? require("assets/images/default-image.svg").default
                          : item
                      }
                      alt=""
                    />
                  </li>
                ))}

                {staffCount > 5 && (
                  <li>
                    <div className="more">
                      <span>{staffCount - 5}+</span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        <div className="office-select-checkbox">
          <div className="ch-checkbox">
            <label>
              <input
                type="checkbox"
                onChange={(event) => props.Clicked(event, props.data.id)}
              />
              <span></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(OfficeCard);
