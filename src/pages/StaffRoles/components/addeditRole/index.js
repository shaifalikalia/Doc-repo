import React, { Component } from "react";
import { Modal, ModalBody } from "reactstrap";

import Input from "components/Input";
import { withTranslation } from "react-i18next";
import { testRegexCheck } from "utils";
import constants from "./../../../../constants";
class AddEditRole extends Component {
  state = {
    modal: this.props.show,
    name: this.props.DataRow ? this.props.DataRow.name : null,
    errors: {},
    isDefaultRole: this.props.DataRow
      ? this.props.DataRow.isDefaultRole
      : false,
  };

  InputChange = (event) => {
    const { name, value } = event.target;

    if (testRegexCheck(value)) {
      this.setState({ [name]: value });
    }
  };

  isValid = () => {
    const { name } = this.state;
    const errors = {};
    let isValid = true;

    if (!name) {
      errors.name = "Please enter  name.";
      isValid = false;
    }

    this.setState({ errors });

    return isValid;
  };

  handleAddRole = () => {
    const isValid = this.isValid();

    if (isValid) {
      if (this.props.DataRow) {
        const payload = {
          id: this.props.DataRow.id,
          name: this.state.name,
          officeId: this.props.OfficeID ? this.props.OfficeID : 0,
          isDefaultRole: this.state.isDefaultRole,
        };
        this.props.EditRole({ ...payload });
      } else {
        const payload = {
          officeId: this.props.OfficeID ? this.props.OfficeID : 0,
          name: this.state.name,
          masterRoleId: this.props.CatType ? this.props.CatType : 0,
          isDefaultRole: this.state.isDefaultRole,
        };

        this.props.AddRole({ ...payload });
      }
      this.props.closeModal();
    }
  };

  handleAccountAdmin = (event) => {
    this.setState({ isDefaultRole: event.target.checked });
  };

  render() {
    const { modal, errors } = this.state;
    const { t } = this.props;

    return (
      <Modal
        isOpen={modal}
        className="modal-dialog-centered modal-lg add-role-modal"
        modalClassName="custom-modal"
        toggle={this.props.closeModal}
      >
        <span className="close-btn" onClick={this.props.closeModal}>
          <img src={require("assets/images/cross.svg").default} alt="close" />
        </span>
        <ModalBody>
          <div className="add-role-form">
            <h2 className="title">
              {this.props.DataRow
                ? t("accountOwner.editRole")
                : t("accountOwner.addNewRole")}
            </h2>
            <Input
              Autofocus={true}
              Title={t("form.fields.roleName")}
              Type="text"
              Placeholder={t("form.placeholder1", {
                field: t("form.fields.roleName"),
              })}
              Name={"name"}
              HandleChange={this.InputChange}
              Error={errors.name}
              Value={this.state.name}
            />
            {this.props.RoleType &&
              this.props.RoleType !== constants.systemRoles.superAdmin && (
                <div className="account-checkbox">
                  <div className="ch-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        name="isAdmin"
                        onChange={this.handleAccountAdmin}
                        checked={this.state.isDefaultRole}
                      />
                      <span>{t("accountOwner.markAsDefault")}</span>
                    </label>
                  </div>
                </div>
              )}

            <div className="btn-field">
              <button
                className="button button-round button-shadow"
                title={t("accountOwner.saveRole")}
                onClick={this.handleAddRole}
              >
                {t("accountOwner.saveRole")}
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default withTranslation()(AddEditRole);
