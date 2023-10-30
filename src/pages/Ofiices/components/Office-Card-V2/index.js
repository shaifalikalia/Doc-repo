import React, { useState, Fragment } from "react";
import { withTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Modal, ModalBody } from "reactstrap";
import Text from "components/Text";
import crossIcon from "./../../../../assets/images/cross.svg";

const OfficeCardV2 = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const showHideDetailBtn = () => setShowStaffDetails(!showStaffDetails);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const { t } = props;
  return (
    <div className="office-card office-card-v2 ">
      <div className="card-content">
        <div className="office-card-body">
          <div className="office-card-header">
            <div className="img-box">
              <img alt="icon" src={require("assets/images/image1.jfif")} />
            </div>
            <div className="text-box">
              <h3> Community Health Service</h3>
              <div className="media">
                <span className="ico">
                  <img
                    src={require("assets/images/address-icon.svg").default}
                    alt="icon"
                  />
                </span>
                <div className="media-body align-self-center">
                  <p>3053 Edgemont Blvd, North Vancouver </p>
                </div>
              </div>
            </div>
          </div>
          <div className="staff-list">
            <div className="office-manager common-member">
              <h5>Office Managers</h5>
              <ul>
                <li>
                  <img
                    src={require("assets/images/default-image.svg").default}
                    alt="icon"
                  />{" "}
                </li>
                <li>
                  <img
                    src={require("assets/images/default-image.svg").default}
                    alt="icon"
                  />{" "}
                </li>
                <li>
                  <img
                    src={require("assets/images/default-image.svg").default}
                    alt="icon"
                  />{" "}
                </li>
                <li>
                  <div className="more" onClick={() => setIsModalOpen(true)}>
                    {" "}
                    <span>1</span>{" "}
                  </div>{" "}
                </li>
              </ul>
            </div>
            <div className="staff-members common-member">
              <h5>{t("staffMembers")}</h5>
              <ul>
                <li>
                  <img
                    src={require("assets/images/default-image.svg").default}
                    alt="icon"
                  />{" "}
                </li>
                <li>
                  <img
                    src={require("assets/images/default-image.svg").default}
                    alt="icon"
                  />{" "}
                </li>
                <li>
                  <img
                    src={require("assets/images/default-image.svg").default}
                    alt="icon"
                  />{" "}
                </li>
                <li>
                  <div className="more">
                    {" "}
                    <span>1</span>{" "}
                  </div>{" "}
                </li>
              </ul>
            </div>
          </div>
          <div className="staff-detail-card">
            <ul>
              <li>
                <img
                  src={require("assets/images/office/staff.svg").default}
                  alt="icon"
                />{" "}
                23 Active Staffs
              </li>
              <li>
                <img
                  src={require("assets/images/office/hours.svg").default}
                  alt="icon"
                />{" "}
                156 Approved Hours
              </li>
              {showStaffDetails && (
                <>
                  <li>
                    <img
                      src={
                        require("assets/images/office/estimated-amount.svg")
                          .default
                      }
                      alt="icon"
                    />{" "}
                    CAD 1560
                  </li>
                  <li>
                    <img
                      src={
                        require("assets/images/office/production-value.svg")
                          .default
                      }
                      alt="icon"
                    />{" "}
                    Office Production - $13,000
                  </li>
                  <li>
                    <img
                      src={
                        require("assets/images/office/timesheets.svg").default
                      }
                      alt="icon"
                    />{" "}
                    23 New Pending Timesheets
                  </li>
                  <li>
                    <img
                      src={require("assets/images/office/leaves.svg").default}
                      alt="icon"
                    />{" "}
                    2 Pending Leaves
                  </li>
                  <li>
                    <img
                      src={
                        require("assets/images/office/applicant.svg").default
                      }
                      alt="icon"
                    />{" "}
                    3 New Applicants Today
                  </li>
                  <li>
                    <img
                      src={require("assets/images/office/alert.svg").default}
                      alt="icon"
                    />{" "}
                    2 Covid Alerts Today
                  </li>
                  <li>
                    <img
                      src={require("assets/images/office/tasks.svg").default}
                      alt="icon"
                    />{" "}
                    5 Tasks Updated Today
                  </li>
                </>
              )}
            </ul>
            <div className="show-hide-btn" onClick={showHideDetailBtn}>
              {!showStaffDetails ? (
                <span className="link-btn">
                  <img
                    src={require("assets/images/office/down-arrow.svg").default}
                    alt="Show More"
                  />
                  Show More
                </span>
              ) : (
                <span className="link-btn">
                  <img
                    src={require("assets/images/office/up-arrow.svg").default}
                    alt="Show Less"
                  />
                  Show Less
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="office-dropdown">
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret={false} tag="div">
            <span className="ico">
              <img
                src={require("assets/images/dots-icon.svg").default}
                alt="icon"
              />
            </span>
          </DropdownToggle>
          <DropdownMenu right>
            <Fragment>
              <DropdownItem>
                <span>{t("edit")}</span>
              </DropdownItem>
              <DropdownItem>
                <span>{t("activate")}</span>
              </DropdownItem>
            </Fragment>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="office-card-footer">
        <span className="ico">
          <img
            src={require("assets/images/add-staff-icon.svg").default}
            alt="icon"
          />
        </span>
        <span className="link-btn font-regular">
          {t("accountOwner.addStaff")}
        </span>
      </div>
      <Modal
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen(false)}
        className="modal-dialog-centered"
        modalClassName="custom-modal office-manager-modal"
      >
        <span className="close-btn" onClick={() => setIsModalOpen(false)}>
          <img src={crossIcon} alt="cross-icon" />
        </span>
        <ModalBody>
          <Text size="25px" weight="500" color="#111b45">
            <span className="modal-title-25">
              {" "}
              {t("accountOwner.officeManagers")}
            </span>{" "}
          </Text>
          <ul className="manager-list">
            <li>
              <div className="staff-img">
                <img
                  alt="icon"
                  src="https://mxhhdevstorageacc.blob.core.windows.net/accountpictures/9e656584-efc8-4840-9bdf-db3bf84bec22.jfif"
                />
              </div>
              <Text size="14px" color="#102c42" weight="600">
                Douglas MOris
              </Text>
            </li>
            <li>
              <div className="staff-img">
                <img
                  alt="icon"
                  src="https://mxhhdevstorageacc.blob.core.windows.net/accountpictures/9e656584-efc8-4840-9bdf-db3bf84bec22.jfif"
                />
              </div>
              <Text size="14px" color="#102c42" weight="600">
                Douglas MOris
              </Text>
            </li>
            <li>
              <div className="staff-img">
                <img
                  alt="icon"
                  src="https://mxhhdevstorageacc.blob.core.windows.net/accountpictures/9e656584-efc8-4840-9bdf-db3bf84bec22.jfif"
                />
              </div>
              <Text size="14px" color="#102c42" weight="600">
                Douglas MOris
              </Text>
            </li>
            <li>
              <div className="staff-img">
                <img
                  alt="icon"
                  src="https://mxhhdevstorageacc.blob.core.windows.net/accountpictures/9e656584-efc8-4840-9bdf-db3bf84bec22.jfif"
                />
              </div>
              <Text size="14px" color="#102c42" weight="600">
                Douglas MOris
              </Text>
            </li>
          </ul>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default withTranslation()(OfficeCardV2);
