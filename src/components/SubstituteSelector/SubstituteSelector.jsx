import React from "react";
import OfficeSelectionStep from "./OfficeSelectionStep";
import SubstituteSelectorLayout from "./SubstituteSelectorLayout";
import SubstituteSelectorContext from "./SubstituteSelectorContext";
import staffRepository from "../../repositories/staff-repository";
import "./SubstituteSelector.scss";
import OwnershipSelectionStep from "./OwnershipSelectionStep";
import StaffActionModal from "components/StaffActionModal";
import constants from "./../../constants";

class SubstituteSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      officeSelectionIsRequired: null,
      removeFromSingleOffice: true,

      isLoadingSubstitutes: false,
      substitutes: [],

      isConfirmationModalOpen: false,
      substituteId: null,

      internalErrorMessage: "",
    };
  }

  async componentDidMount() {
    await this.checkIfOfficeSelectionIsRequired();
  }

  checkIfOfficeSelectionIsRequired = async () => {
    var res = await staffRepository.getUserOfficesWhereStaffIsAdmin(
      this.props.staff.userId
    );
    if (res.statusCode !== 200) {
      this.setState({ internalErrorMessage: res.message });
      return;
    }

    const activeCount = res.data.filter((uo) => uo.isActive).length;
    const notDeletedCount = res.data.filter((uo) => !uo.isDeleted).length;

    if (
      (this.props.event === constants.staffActionEvents.deactivation &&
        activeCount <= 1) ||
      (this.props.event === constants.staffActionEvents.removal &&
        notDeletedCount <= 1) ||
      (this.props.event === constants.staffActionEvents.removalAsAdmin &&
        res.data.length <= 1)
    ) {
      this.setState({ officeSelectionIsRequired: false }, () =>
        this.loadSubstitutes(true)
      );
    } else {
      this.setState({
        officeSelectionIsRequired: true,
        currentStep: 1,
      });
    }
  };

  loadSubstitutes = (removeFromSingleOffice) => {
    this.setState(
      { isLoadingSubstitutes: true, removeFromSingleOffice },
      async () => {
        var res = await staffRepository.getSubstitutes(
          this.props.staff.userId,
          removeFromSingleOffice ? this.props.staff.officeId : null
        );

        if (res.statusCode !== 200) {
          this.setState({ internalErrorMessage: res.message });
          return;
        }

        this.setState({
          isLoadingSubstitutes: false,
          substitutes: res.data,
          currentStep: 2,
        });
      }
    );
  };

  onBack = () => {
    if (this.state.currentStep === 2 && this.state.officeSelectionIsRequired) {
      this.setState({ currentStep: 1 });
    } else {
      this.props.onCancel();
    }
  };

  clearInternalErrorMessage = () => {
    this.setState({ internalErrorMessage: "" });
  };

  openConfirmationModal = (substituteId) => {
    this.setState({ isConfirmationModalOpen: true, substituteId });
  };

  closeConfirmationModal = () => {
    this.setState({ isConfirmationModalOpen: false });
  };

  onAction = () => {
    this.setState({ isConfirmationModalOpen: false }, async () => {
      await this.props.onAction(
        this.props.staff.userId,
        this.state.removeFromSingleOffice ? this.props.staff.officeId : null,
        this.state.substituteId
      );
    });
  };

  render() {
    const {
      staff,
      event,
      text,
      isActionExecuting,
      errorMessage,
      onClearErrorMessage,
      onCancel,
    } = this.props;

    return (
      <SubstituteSelectorContext.Provider
        value={{
          staff,
          event,
          text,
          isActionExecuting,
          onBack: this.onBack,
          onCancel: onCancel,
        }}
      >
        <SubstituteSelectorLayout
          errorMessage={errorMessage}
          onClearErrorMessage={onClearErrorMessage}
          internalErrorMessage={this.state.internalErrorMessage}
          onClearInternalErrorMessage={this.clearInternalErrorMessage}
        >
          {this.renderStep()}
        </SubstituteSelectorLayout>
        <StaffActionModal
          event={event}
          isOpen={this.state.isConfirmationModalOpen}
          onAction={this.onAction}
          onClose={this.closeConfirmationModal}
        />
      </SubstituteSelectorContext.Provider>
    );
  }

  renderStep() {
    if (this.state.currentStep === 0) {
      return (
        <div className="ss-loader-container">
          <div className="loader"></div>
        </div>
      );
    }

    if (this.state.currentStep === 1) {
      return (
        <OfficeSelectionStep
          isLoadingSubstitutes={this.state.isLoadingSubstitutes}
          removeFromSingleOffice={this.state.removeFromSingleOffice}
          updateStep={this.loadSubstitutes}
        />
      );
    }

    if (this.state.currentStep === 2) {
      return (
        <OwnershipSelectionStep
          removeFromSingleOffice={this.state.removeFromSingleOffice}
          substitutes={this.state.substitutes}
          onConfirm={this.openConfirmationModal}
        />
      );
    }
  }
}

export default SubstituteSelector;
