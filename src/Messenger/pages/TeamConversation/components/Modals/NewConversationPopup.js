import React, { useMemo } from "react";
import { Modal, ModalBody } from "reactstrap";
import { withTranslation } from "react-i18next";
import Text from "components/Text";
import Input from "components/Input";
import Loader from "components/Loader";
import constants from "../../../../../constants";

function NewConversationPopup({ t, stateData }) {
  const { state, otherMethods } = stateData;
  const {
    conversationTitle,
    searchEmail,
    searchPhone,
    findByEmail,
    errors,
    searchedExternalMembers,
    loadingExternalMembers,
    showShareApp,
    actionInProgress,
  } = state;
  const { handleFindByEmail } = otherMethods;
  const {
    closeExternalChatCreationModal,
    handleConversationTitle,
    handleSearchEmail,
    handleSearchPhone,
    handleExternalChatCreation,
    handleSearchExternalMembers,
  } = otherMethods;

  const emailBody = useMemo(() => {
    return encodeURIComponent(
      t("messenger.shareAppEmailBody", {
        webUrl: window?.location?.origin,
        playStoreLink: constants.DOWNLOADLINK.playStore,
        appStoreLink: constants.DOWNLOADLINK.appStore,
      })
    );
  }, []);

  const EmptyContactWrapper = () => {
    return (
      <div className="empty-contact-wrapper">
        <p className="pb-3">
          <img
            src={require("assets/images/empty-chat-illustration.svg").default}
            alt="close"
          />
        </p>
        <p> {t("messenger.emptyContactText1")}</p>
        <p> {t("messenger.emptyContactText2")}</p>
        <a
          href={`mailto:${searchEmail}?subject=${t(
            "messenger.shareAppEmailSubject"
          )}
                        &body=${emailBody}`}
          className="button button-round button-shadow mt-2 share-app-btn"
          title={t("messenger.shareApp")}
        >
          {t("messenger.shareApp")}
        </a>
      </div>
    );
  };
  return (
    <Modal
      isOpen={true}
      toggle={closeExternalChatCreationModal}
      className="modal-dialog-centered modal-width-660  new-conversation-popup"
      modalClassName="custom-modal"
    >
      <span className="close-btn" onClick={closeExternalChatCreationModal}>
        <img src={require("assets/images/cross.svg").default} alt="close" />
      </span>
      <ModalBody>
        {(loadingExternalMembers || actionInProgress) && <Loader />}
        <Text size="25px" marginBottom="0px" weight="500" color="#111b45">
          {t("messenger.newConversation")}
        </Text>
        <div className="input-wrapper">
          <Input
            Title={t("messenger.title")}
            Type="text"
            MaxLength={120}
            Placeholder={t("form.placeholder1", {
              field: t("messenger.title"),
            })}
            Name={"title"}
            Value={conversationTitle}
            HandleChange={handleConversationTitle}
            autoComplete="off"
            Error={errors.externalGroupTitle}
          />
          <div className="c-field mb-0">
            <label className="mb-3">
              {t("messenger.findThePersonByEmailAddressPhoneNumber")}
            </label>
            <div className="ch-radio">
              <label className="mr-5" onClick={() => handleFindByEmail(true)}>
                <input type="radio" checked={findByEmail} onChange={() => {}} />
                <span> {t("form.fields.emailAddress")} </span>
              </label>

              <label onClick={() => handleFindByEmail(false)}>
                <input
                  type="radio"
                  checked={!findByEmail}
                  onChange={() => {}}
                />
                <span> {t("form.fields.phoneNumber")}</span>
              </label>
            </div>
          </div>
          <div
            className={`search-box  ${
              searchedExternalMembers.length ? "green-border" : ""
            } 
                        ${errors?.externalChatEmail ? "red-border" : ""}`}
          >
            {findByEmail ? (
              <input
                type="email"
                placeholder={t("messenger.egAdamsmithEmailCom")}
                value={searchEmail}
                onChange={handleSearchEmail}
              />
            ) : (
              <input
                type="tel"
                placeholder="E.g. 987-654-3210"
                value={searchPhone}
                onChange={handleSearchPhone}
              />
            )}
            <span className="ico" onClick={() => handleSearchExternalMembers()}>
              <img
                src={require("assets/images/search-icon.svg").default}
                alt="icon"
              />
            </span>
            {errors?.externalChatEmail && (
              <span className="error-msg mt-2">{errors.externalChatEmail}</span>
            )}
          </div>

          {showShareApp && <EmptyContactWrapper />}

          {!loadingExternalMembers && !!searchedExternalMembers.length && (
            <ul className={"modal-employee-list group-list"}>
              {searchedExternalMembers.map((mem, index) => {
                const { name, officeName, emailId, profilePic } = mem;
                return (
                  <li
                    key={index}
                    className="cursor-pointer"
                    onClick={() => handleExternalChatCreation(mem)}
                  >
                    <div className="list-box">
                      <img
                        src={
                          profilePic ||
                          require("assets/images/staff-default-rounded.png")
                            .default
                        }
                        alt="profile-pic"
                      />
                      <div className="text-col">
                        <div className="user-name"> {name} </div>
                        <Text
                          size="11px"
                          marginBottom="0px"
                          color="color: #87928D;"
                        >
                          {emailId} <br />
                          {officeName}
                        </Text>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="d-flex">
          <button
            type="button"
            onClick={closeExternalChatCreationModal}
            className="button button-round button-border btn-mobile-link button-dark"
          >
            {t("cancel")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default withTranslation()(NewConversationPopup);
