import React, { useState, useEffect, Fragment } from "react";
import { withTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { setStorage, handleError, encodeId } from "utils";
import Loader from "components/Loader";
import {
  useGetFamilyMemberList,
  useDeleteAddedMember,
} from "repositories/family-member-repository";
import useHandleApiError from "hooks/useHandleApiError";
import toast from "react-hot-toast";
import FamilyModal from "./FamilyModal";
import styles from "./../../../FamilyMembers/familyMembers.module.scss";
import "./../../../FamilyMembers/familyMembers.scss";
import constants, { getKeyValueFromList } from "../../../../../constants";
import { uniqBy } from "lodash";

function AddedMembers(props) {
  /* Intializations & Declarations */
  const { t, status } = props;
  const history = useHistory();
  const PAGE_SIZE = 6;
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState({});
  const [confirmModal, setConfirmModal] = useState(false);
  const {
    data,
    error: isError,
    isLoading,
    isFetching,
    refetch,
  } = useGetFamilyMemberList(pageNumber, PAGE_SIZE, {
    cacheTime: 0,
  });
  const deleteAddedMemberMutation = useDeleteAddedMember();
  const [pageData, setPageData] = useState({
    familyMemberlist: [],
    totalItems: 0,
    totalPages: 1,
  });
  const { familyMemberlist, totalItems, totalPages } = pageData;

  /* use to handle API errors */
  useHandleApiError(isLoading, isFetching, isError);

  /**
   * @event: [useEffect]
   * @description: {
   *  call family members listing and set the total pages and the total items
   * }
   */
  useEffect(() => {
    if (!isLoading && data?.data) {
      setPageData((prev) => {
        return {
          totalItems: data?.pagination?.totalItems,
          totalPages: data?.pagination?.totalPages,
          familyMemberlist: uniqBy(
            [...prev.familyMemberlist, ...data.data],
            "patientFamilyMemberId"
          ),
        };
      });
    }
  }, [isLoading, data, pageNumber]);

  /**
   * @event: [useEffect]
   * @description: {
   *  call family members listing and set the total pages and the total items
   * }
   */
  useEffect(() => {
    setStorage(constants.familyMembers.cache.familyMemberlisting, {
      activeTab: status,
    });
  }, [status]);

  /**
   * @method: [handleDropDown]
   * @description: use this method to handle the drop down for quick actions
   * @param {number} index
   */
  const handleDropDown = (index) => {
    setPageData((prev) => ({
      ...prev,
      familyMemberlist: prev.familyMemberlist.map((item, listIndex) => {
        if (index === listIndex) item.isDropDownOpen = !item.isDropDownOpen;
        return item;
      }),
    }));
  };

  /**
   * @method: [editMember]
   * @description: use this method to redirect to edit page
   * @param {string} memberId
   */
  const editMember = (memberId) => {
    history.push(
      constants.routes.editMember.replace(":memberId", encodeId(memberId))
    );
  };

  /**
   * @method: [viewMember]
   * @description: use this method to redirect to view page
   * @param {string} memberId
   */
  const viewMember = (memberId) => {
    history.push(
      constants.routes.viewMember.replace(":memberId", encodeId(memberId))
    );
  };

  /**
   * @method: [deleteMember]
   * @description: use this method to call delete method
   * @param {object} memberData
   */
  const deleteMember = (memberData) => {
    setConfirmModal(true);
    setSelectedFamilyMember(memberData);
  };

  /**
   * @method: [confirmDeleteMemeber]
   * @description: use this method to call delete member after confirmation
   */
  const confirmDeleteMemeber = async () => {
    try {
      if (selectedFamilyMember) {
        const payload = {
          FamilyMemberId: selectedFamilyMember.patientFamilyMemberId,
        };

        await deleteAddedMemberMutation.mutateAsync(payload);
        setConfirmModal(false);
        setPageData((prev) => ({
          ...prev,
          familyMemberlist: prev.familyMemberlist.filter(
            (member) =>
              member.patientFamilyMemberId !==
              selectedFamilyMember.patientFamilyMemberId
          ),
        }));

        toast.success(t("familyMembers.deleteMemberSuccessMsg"));

        if (pageNumber === 1 && familyMemberlist.length === 0) refetch();
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      <InfiniteScroll
        dataLength={familyMemberlist.length}
        hasMore={familyMemberlist.length < totalItems}
        next={() => pageNumber < totalPages && setPageNumber((v) => v + 1)}
      >
        <div
          className={styles["family-member-card-main"] + " d-flex  flex-wrap"}
        >
          {(isLoading || isFetching) && <Loader />}
          {familyMemberlist.length > 0 &&
            [...familyMemberlist].map((member, index) => (
              <div
                className={styles["family-member-card-width"]}
                key={member.patientFamilyMemberId}
                onClick={(e) => {
                  e.stopPropagation();
                  viewMember(member.patientFamilyMemberId);
                }}
              >
                <div
                  className={
                    "family-member-card-page " + styles["family-member-card"]
                  }
                >
                  <div className="card-content">
                    <div className="d-flex justify-content-between px-1">
                      {member.status ===
                        constants.familyMembers.inviteStatus.Pending && (
                        <div
                          className={
                            "mb-3 " +
                            styles["member-status"] +
                            " " +
                            styles["pending"]
                          }
                        >
                          {t("pending")}
                        </div>
                      )}

                      {member.status ===
                        constants.familyMembers.inviteStatus.Rejected && (
                        <div
                          className={
                            "mb-3 " +
                            styles["member-status"] +
                            " " +
                            styles["rejected"]
                          }
                        >
                          {t("rejected")}
                        </div>
                      )}

                      {member.status !==
                        constants.familyMembers.inviteStatus.Rejected &&
                        member.status !==
                          constants.familyMembers.inviteStatus.Pending && (
                          <div className={"mb-3"}></div>
                        )}

                      <div className={styles["family-member-dropdown"]}>
                        <Dropdown
                          isOpen={member.isDropDownOpen}
                          toggle={(e) => {
                            e.stopPropagation();
                            handleDropDown(index);
                          }}
                        >
                          <DropdownToggle caret={false} tag="div">
                            <span className={styles["ico"] + " edit-options"}>
                              <img
                                src={
                                  require("assets/images/dots-icon.svg").default
                                }
                                alt="icon"
                              />
                            </span>
                          </DropdownToggle>

                          <DropdownMenu
                            right
                            className={styles["dropdown-menu"]}
                          >
                            <Fragment>
                              <DropdownItem
                                className={styles["dropdown-item"]}
                                onClick={() =>
                                  viewMember(member.patientFamilyMemberId)
                                }
                              >
                                <span>{t("view")}</span>
                              </DropdownItem>

                              {!member.familyMemberRemovedYou &&
                                member.status !==
                                  constants.familyMembers.inviteStatus
                                    .Rejected && (
                                  <DropdownItem
                                    className={styles["dropdown-item"]}
                                    onClick={() =>
                                      editMember(member.patientFamilyMemberId)
                                    }
                                  >
                                    <span>{t("edit")}</span>
                                  </DropdownItem>
                                )}

                              {member.status !==
                                constants.familyMembers.inviteStatus
                                  .Pending && (
                                <DropdownItem
                                  className={styles["dropdown-item"]}
                                  onClick={() => deleteMember(member)}
                                >
                                  <span>{t("delete")}</span>
                                </DropdownItem>
                              )}
                            </Fragment>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>
                    <div className={styles["member-img"]}>
                      <div className="_img">
                        {
                          <img
                            src={
                              member.image
                                ? member.image
                                : require("assets/images/staff-default.svg")
                                    .default
                            }
                            alt="member"
                          />
                        }
                      </div>
                    </div>
                    <h4
                      className={styles["member-name"]}
                    >{`${member.firstName} ${member.lastName}`}</h4>
                    <div className={styles["member-profile"]}>
                      <span>
                        {getKeyValueFromList(
                          constants.relationOptions,
                          member.relation,
                          "name"
                        )}
                      </span>
                    </div>

                    {((member.isAdult === true && member.status === 0) ||
                      (member.isAdult === true &&
                        member.status ===
                          constants.familyMembers.inviteStatus
                            .NotRegister)) && (
                      <div className={styles["member-card-error"] + " d-flex"}>
                        <span className="mr-1">
                          {" "}
                          <img
                            src={require("assets/images/ico_alert.svg").default}
                            alt="icon"
                          />
                        </span>
                        <span className="text-left">
                          {t("familyMembers.updateInfoAbove18Msg")}
                        </span>
                      </div>
                    )}

                    {member.familyMemberRemovedYou && (
                      <div className={styles["member-card-error"] + " d-flex"}>
                        <span className="mr-1">
                          {" "}
                          <img
                            src={require("assets/images/ico_alert.svg").default}
                            alt="icon"
                          />
                        </span>
                        <span className="text-left">
                          {t("familyMembers.memberRemovedItselfMsg", {
                            memberName: `${member.firstName} ${member.lastName}`,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </InfiniteScroll>

      {confirmModal && (
        <FamilyModal
          isFamilyModalOpen={confirmModal}
          setIsFamilyModalOpen={setConfirmModal}
          title={t("familyMembers.deleteModalTitle")}
          subTitle1={t("familyMembers.deleteSubTitleMsg")}
          subTitle2={t("familyMembers.sureForDeleteMember")}
          leftBtnText={t("delete")}
          rightBtnText={t("cancel")}
          onConfirm={confirmDeleteMemeber}
        />
      )}
      {familyMemberlist.length === 0 && (
        <div className="empty-block">
          <img
            src={require("assets/images/family-icon.svg").default}
            alt="icon"
          />
          <h4 className={styles["family-members-records"]}>
            {t("familyMembers.noFamilymembersaddedyet")}
          </h4>
        </div>
      )}
    </>
  );
}

export default withTranslation()(AddedMembers);
