import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getstaffDesignation,
  addstaffDesignation,
  editstaffDesignation,
  deletestaffDesignation,
  markDefaultDesignation,
} from "actions/index";
import { Modal, ModalBody } from "reactstrap";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";

/*components*/
import _isLoading from "hoc/isLoading";
import AddEditRole from "./components/addeditRole";
import Toast from "components/Toast";
import Empty from "components/Empty";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { withTranslation } from "react-i18next";
import constants from "./../../constants";

class StaffRoles extends Component {
  state = {
    addModal: false,
    roleDetail: null,
    deleteModal: false,
    deletRoleId: null,
    isToastView: false,
    catType: null,
  };

  componentDidMount() {
    const officeId =
      this.props.profile && this.props.profile.officeId
        ? this.props.profile.officeId
        : 0;
    this.props.getstaffDesignation(officeId);

    if (
      this.props.profile &&
      (this.props.profile.profileSetupStep === "packageExpired" ||
        this.props.profile.profileSetupStep === "subscriptionTerminated")
    ) {
      this.props.history.push("/");
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isRoleAdded !== this.props.isRoleAdded ||
      prevProps.isRoleAddedError !== this.props.isRoleAddedError
    ) {
      window.scrollTo(0, 0);
      this.setState({ isToastView: true });
      setTimeout(() => {
        this.setState({ isToastView: false });
      }, 3000);
    }
  }

  modalOpen = (id) => {
    this.setState({ addModal: true, roleDetail: null });
    if (
      this.props.profile &&
      this.props.profile.role.systemRole === constants.systemRoles.superAdmin
    ) {
      this.setState({ catType: id });
    }
  };

  modalClose = () => {
    this.setState({ addModal: false, roleDetail: null });

    if (
      this.props.profile &&
      this.props.profile.roleId === constants.systemRoles.superAdmin
    ) {
      this.setState({ catType: null });
    }
  };

  handleEdit = (row) => {
    this.setState({ addModal: true, roleDetail: row });
  };
  handleDeleteModal = (row) => {
    this.setState({ deleteModal: true, deletRoleId: row.id });
  };
  handleDeleteModalClose = () => {
    this.setState({ deleteModal: false });
  };
  handleDeleteRole = () => {
    const payload = {
      id: this.state.deletRoleId,
      officeId: this.props.profile.officeId ? this.props.profile.officeId : 0,
    };

    this.props.deletestaffDesignation({ ...payload });
    this.setState({ deleteModal: false });
  };

  deleteConfirm = () => (
    <Modal
      isOpen={this.state.deleteModal}
      className="modal-dialog-centered  delete-role-modal"
      modalClassName="custom-modal"
      toggle={this.handleDeleteModalClose}
    >
      <span className="close-btn" onClick={this.handleDeleteModalClose}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        <div className="delete-content mt-4">
          <p>{this.props.t("staffRoleDeleteConfirmationText")}</p>
          <button
            className="button button-round button-shadow button-min-100 margin-right-2x"
            title={this.props.t("ok")}
            onClick={this.handleDeleteRole}
          >
            {this.props.t("ok")}
          </button>
          <button
            class="button button-round button-border button-dark"
            title={this.props.t("cancel")}
            onClick={this.handleDeleteModalClose}
          >
            {this.props.t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );

  handleMarkDefault = (row) => {
    const payload = {
      id: row.id,
      officeId: this.props.profile.officeId ? this.props.profile.officeId : 0,
    };

    this.props.markDefaultDesignation({ ...payload });
  };

  toastHide = () => {
    this.setState({ isToastView: false });
  };

  render() {
    const { staffDesignation, statusMessage, isRoleAddedError, t } = this.props;
    const { addModal, deleteModal, isToastView, catType } = this.state;

    let staffDesignationData = null;
    let mangeRoleData = null;
    let physicanRoleData = null;

    if (
      this.props.profile &&
      this.props.profile.role.systemRole !== constants.systemRoles.superAdmin &&
      staffDesignation &&
      staffDesignation.designations_list.length
    ) {
      staffDesignationData = this.props.staffDesignation.designations_list
        .filter((item) => item.isSuperAdmin)
        .map((item) => (
          <div className="data-box" key={item.id}>
            <div className="data-box-content">
              <div className="row no-gutters align-items-center">
                <div className="col-md-8">
                  <h3>{item.name}</h3>
                </div>
                <div className="col-md-4 d-none d-lg-block">
                  <button
                    className="float-md-right"
                    disabled={item.isDefaultRole}
                    onClick={() => {
                      this.handleMarkDefault(item);
                    }}
                  >
                    <span>
                      <img
                        className="img-star"
                        src={require("assets/images/default-star.svg").default}
                        alt="img"
                      />
                      <img
                        className="img-star-hover"
                        src={
                          require("assets/images/default-star-white.svg")
                            .default
                        }
                        alt="img"
                      />
                    </span>
                    {t("accountOwner.markAsDefault")}
                  </button>
                </div>
              </div>
            </div>

            <div className="staff-dropdown">
              <UncontrolledDropdown>
                <DropdownToggle caret={false} tag="div">
                  <span className="ico">
                    <img
                      src={require("assets/images/dots-icon.svg").default}
                      alt="icon"
                    />
                  </span>
                </DropdownToggle>

                <DropdownMenu right>
                  <DropdownItem
                    disabled={item.isDefaultRole}
                    onClick={() => {
                      this.handleMarkDefault(item);
                    }}
                  >
                    <span>
                      <img
                        src={require("assets/images/default-star.svg").default}
                        alt="icon"
                      />
                      {t("accountOwner.markAsDefault")}
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        ));

      mangeRoleData = this.props.staffDesignation.designations_list
        .filter((item) => !item.isSuperAdmin)
        .map((item) => (
          <div className="data-box" key={item.id}>
            <div className="data-box-content">
              <div className="row no-gutters align-items-center">
                <div className="col-md-7">
                  <h3>{item.name}</h3>
                </div>
                <div className="col-md-5 d-none d-lg-block">
                  <div className="action-block">
                    <button
                      disabled={item.isDefaultRole}
                      onClick={() => {
                        this.handleMarkDefault(item);
                      }}
                    >
                      <span>
                        <img
                          className="img-star"
                          src={
                            require("assets/images/default-star.svg").default
                          }
                          alt="img"
                        />
                        <img
                          className="img-star-hover"
                          src={
                            require("assets/images/default-star-white.svg")
                              .default
                          }
                          alt="img"
                        />
                      </span>
                      {t("accountOwner.markAsDefault")}
                    </button>
                    <div className="action-links">
                      <ul>
                        <li>
                          <span title="Edit">
                            <img
                              src={
                                require("assets/images/edit-icon.svg").default
                              }
                              alt="edit-icon"
                              onClick={() => this.handleEdit(item)}
                            />
                          </span>
                        </li>
                        <li>
                          <span title="Delete">
                            <img
                              src={
                                require("assets/images/delete-icon.svg").default
                              }
                              alt="delete-icon"
                              onClick={() => this.handleDeleteModal(item)}
                            />
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="staff-dropdown">
              <UncontrolledDropdown>
                <DropdownToggle caret={false} tag="div">
                  <span className="ico">
                    <img
                      src={require("assets/images/dots-icon.svg").default}
                      alt="icon"
                    />
                  </span>
                </DropdownToggle>

                <DropdownMenu right>
                  <DropdownItem onClick={() => this.handleEdit(item)}>
                    <span>
                      <img
                        src={
                          require("assets/images/edit-icon-small.svg").default
                        }
                        alt="icon"
                      />
                      {t("edit")}
                    </span>
                  </DropdownItem>
                  <DropdownItem onClick={() => this.handleDeleteModal(item)}>
                    <span>
                      <img
                        src={
                          require("assets/images/delete-icon-small.svg").default
                        }
                        alt="icon"
                      />
                      {t("delete")}
                    </span>
                  </DropdownItem>
                  <DropdownItem
                    disabled={item.isDefaultRole}
                    onClick={() => {
                      this.handleMarkDefault(item);
                    }}
                  >
                    <span>
                      <img
                        src={require("assets/images/default-star.svg").default}
                        alt="icon"
                      />

                      {t("accountOwner.markAsDefault")}
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        ));
    }

    if (
      this.props.profile &&
      this.props.profile.role.systemRole === constants.systemRoles.superAdmin &&
      staffDesignation &&
      staffDesignation.designations_list.length
    ) {
      staffDesignationData = this.props.staffDesignation.designations_list
        .filter((item) => item.masterRoleId === 1)
        .map((item) => (
          <div className="data-box" key={item.id}>
            <div className="data-box-content">
              <div className="row no-gutters align-items-center">
                <div className="col-md-8">
                  <h3>{item.name}</h3>
                </div>
                <div className="col-md-4 d-none d-lg-block">
                  <div className="action-block">
                    <div className="action-links">
                      <ul>
                        <li>
                          <span title="Edit">
                            <img
                              src={
                                require("assets/images/edit-icon.svg").default
                              }
                              alt="edit-icon"
                              onClick={() => this.handleEdit(item)}
                            />
                          </span>
                        </li>
                        <li>
                          <span title="Delete">
                            <img
                              src={
                                require("assets/images/delete-icon.svg").default
                              }
                              alt="delete-icon"
                              onClick={() => this.handleDeleteModal(item)}
                            />
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="staff-dropdown">
              <UncontrolledDropdown>
                <DropdownToggle caret={false} tag="div">
                  <span className="ico">
                    <img
                      src={require("assets/images/dots-icon.svg").default}
                      alt="icon"
                    />
                  </span>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => this.handleEdit(item)}>
                    <span>
                      <img
                        src={
                          require("assets/images/edit-icon-small.svg").default
                        }
                        alt="icon"
                      />
                      {t("edit")}
                    </span>
                  </DropdownItem>

                  <DropdownItem onClick={() => this.handleDeleteModal(item)}>
                    <span>
                      <img
                        src={
                          require("assets/images/delete-icon-small.svg").default
                        }
                        alt="icon"
                      />
                      {t("delete")}
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        ));

      mangeRoleData = this.props.staffDesignation.designations_list
        .filter((item) => item.masterRoleId === 2)
        .map((item) => (
          <div className="data-box" key={item.id}>
            <div className="data-box-content">
              <div className="row no-gutters align-items-center">
                <div className="col-md-8">
                  <h3>{item.name}</h3>
                </div>
                <div className="col-md-4 d-none d-lg-block">
                  <div className="action-block">
                    <div className="action-links">
                      <ul>
                        <li>
                          <span title="Edit">
                            <img
                              src={
                                require("assets/images/edit-icon.svg").default
                              }
                              alt="edit-icon"
                              onClick={() => this.handleEdit(item)}
                            />
                          </span>
                        </li>
                        <li>
                          <span title="Delete">
                            <img
                              src={
                                require("assets/images/delete-icon.svg").default
                              }
                              alt="delete-icon"
                              onClick={() => this.handleDeleteModal(item)}
                            />
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="staff-dropdown">
              <UncontrolledDropdown>
                <DropdownToggle caret={false} tag="div">
                  <span className="ico">
                    <img
                      src={require("assets/images/dots-icon.svg").default}
                      alt="icon"
                    />
                  </span>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => this.handleEdit(item)}>
                    <span>
                      <img
                        src={
                          require("assets/images/edit-icon-small.svg").default
                        }
                        alt="icon"
                      />
                      {t("edit")}
                    </span>
                  </DropdownItem>

                  <DropdownItem onClick={() => this.handleDeleteModal(item)}>
                    <span>
                      <img
                        src={
                          require("assets/images/delete-icon-small.svg").default
                        }
                        alt="icon"
                      />
                      {t("delete")}
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        ));

      physicanRoleData = this.props.staffDesignation.designations_list
        .filter((item) => item.masterRoleId === 3)
        .map((item) => (
          <div className="data-box" key={item.id}>
            <div className="data-box-content">
              <div className="row no-gutters align-items-center">
                <div className="col-md-8">
                  <h3>{item.name}</h3>
                </div>
                <div className="col-md-4 d-none d-lg-block">
                  <div className="action-block">
                    <div className="action-links">
                      <ul>
                        <li>
                          <span title="Edit">
                            <img
                              src={
                                require("assets/images/edit-icon.svg").default
                              }
                              alt="edit-icon"
                              onClick={() => this.handleEdit(item)}
                            />
                          </span>
                        </li>
                        <li>
                          <span title="Delete">
                            <img
                              src={
                                require("assets/images/delete-icon.svg").default
                              }
                              alt="delete-icon"
                              onClick={() => this.handleDeleteModal(item)}
                            />
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="staff-dropdown">
              <UncontrolledDropdown>
                <DropdownToggle caret={false} tag="div">
                  <span className="ico">
                    <img
                      src={require("assets/images/dots-icon.svg").default}
                      alt="icon"
                    />
                  </span>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => this.handleEdit(item)}>
                    <span>
                      <img
                        src={
                          require("assets/images/edit-icon-small.svg").default
                        }
                        alt="icon"
                      />
                      {t("edit")}
                    </span>
                  </DropdownItem>

                  <DropdownItem onClick={() => this.handleDeleteModal(item)}>
                    <span>
                      <img
                        src={
                          require("assets/images/delete-icon-small.svg").default
                        }
                        alt="icon"
                      />
                      {t("delete")}
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        ));
    }

    if (mangeRoleData && mangeRoleData.length === 0) {
      mangeRoleData = (
        <Empty
          Image={"roles-group.svg"}
          Message={t("accountOwner.emptyStaffRolesMessage")}
        />
      );
    }

    if (physicanRoleData && physicanRoleData.length === 0) {
      physicanRoleData = (
        <Empty
          Image={"roles-group.svg"}
          Message={t("accountOwner.emptyStaffRolesMessage")}
        />
      );
    }

    if (staffDesignationData && staffDesignationData.length === 0) {
      staffDesignationData = (
        <Empty
          Image={"roles-group.svg"}
          Message={t("accountOwner.emptyStaffRolesMessage")}
        />
      );
    }

    return (
      <div className="staff-roles-block">
        {isToastView && statusMessage && (
          <Toast
            message={statusMessage}
            handleClose={this.toastHide}
            errorToast={
              isRoleAddedError ||
              statusMessage ===
                "The role is already assigned to staff members and cannot be deleted"
                ? true
                : false
            }
          />
        )}
        <div className="container">
          <h2 className="main-title">{t("accountOwner.staffRoles")}</h2>

          <Accordion preExpanded={["a"]}>
            <AccordionItem uuid="a">
              <AccordionItemHeading>
                <AccordionItemButton>
                  <div className="row no-gutters align-items-center">
                    <div className="col-6">
                      <h2 className="title">
                        {this.props.profile &&
                        this.props.profile.role.systemRole ===
                          constants.systemRoles.superAdmin
                          ? t("accountOwner.dentalRoles")
                          : t("accountOwner.staffRoles")}
                      </h2>
                    </div>

                    <div className="col-6">
                      <span className="arrow_ico">
                        <img
                          src={require("assets/images/ico-forward.svg").default}
                          alt="img"
                        />
                      </span>
                      {this.props.profile &&
                        this.props.profile.role.systemRole ===
                          constants.systemRoles.superAdmin && (
                          <button
                            className="button button-round button-shadow float-md-right"
                            onClick={() => this.modalOpen(1)}
                          >
                            {t("accountOwner.addNewRole")}
                          </button>
                        )}
                    </div>
                  </div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div className="staff-roles-list">{staffDesignationData}</div>
              </AccordionItemPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <div className="row no-gutters align-items-center">
                    <div className="col-6">
                      <h2 className="title">
                        {this.props.profile &&
                        this.props.profile.role.systemRole ===
                          constants.systemRoles.superAdmin
                          ? t("accountOwner.medicalRoles")
                          : t("accountOwner.manageRoles")}
                      </h2>
                    </div>
                    <div className="col-6">
                      <span className="arrow_ico">
                        <img
                          src={require("assets/images/ico-forward.svg").default}
                          alt="img"
                        />
                      </span>
                      <button
                        className="button button-round button-shadow float-md-right"
                        onClick={() => this.modalOpen(2)}
                      >
                        {t("accountOwner.addNewRole")}
                      </button>
                    </div>
                  </div>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <div className="manage-staff-role-list">
                  <div className="mange-role-list">{mangeRoleData}</div>
                </div>
              </AccordionItemPanel>
            </AccordionItem>
            {this.props.profile &&
              this.props.profile.role.systemRole ===
                constants.systemRoles.superAdmin && (
                <AccordionItem>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <div className="row no-gutters align-items-center">
                        <div className="col-6">
                          <h2 className="title">
                            {this.props.profile &&
                            this.props.profile.role.systemRole ===
                              constants.systemRoles.superAdmin
                              ? t("accountOwner.pharmacistRoles")
                              : ""}
                          </h2>
                        </div>
                        <div className="col-6">
                          <span className="arrow_ico">
                            <img
                              src={
                                require("assets/images/ico-forward.svg").default
                              }
                              alt="img"
                            />
                          </span>
                          <button
                            className="button button-round button-shadow float-md-right"
                            onClick={() => this.modalOpen(3)}
                          >
                            {t("accountOwner.addNewRole")}
                          </button>
                        </div>
                      </div>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <div className="physican-role-list">
                      <div className="physican-data-list">
                        {physicanRoleData}
                      </div>
                    </div>
                  </AccordionItemPanel>
                </AccordionItem>
              )}
          </Accordion>
        </div>
        {deleteModal && this.deleteConfirm()}
        {addModal && (
          <AddEditRole
            RoleType={this.props.profile.role.systemRole}
            CatType={catType}
            DataRow={this.state.roleDetail}
            show={addModal}
            closeModal={this.modalClose}
            AddRole={this.props.addstaffDesignation}
            EditRole={this.props.editstaffDesignation}
            OfficeID={this.props.profile.officeId}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({
  userProfile: { profile },
  staff: {
    staffDesignation,
    isLoading,
    statusMessage,
    isRoleAddedError,
    isRoleAdded,
  },
  errors: { isError },
}) => ({
  staffDesignation,
  isLoading,
  isError,
  profile,
  statusMessage,
  isRoleAddedError,
  isRoleAdded,
});

export default connect(mapStateToProps, {
  getstaffDesignation,
  addstaffDesignation,
  editstaffDesignation,
  deletestaffDesignation,
  markDefaultDesignation,
})(_isLoading(withTranslation()(StaffRoles)));
