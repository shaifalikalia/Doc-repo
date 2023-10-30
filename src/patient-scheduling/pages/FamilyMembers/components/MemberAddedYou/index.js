import React, { useState, useEffect, Fragment } from "react";
import { withTranslation } from "react-i18next";
import { setStorage, handleError } from "utils";
import Loader from "components/Loader";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  useGetFamilyMemberAddedYouList,
  useYourSelfAsMember,
} from "repositories/family-member-repository";
import InfiniteScroll from "react-infinite-scroll-component";
import useHandleApiError from "hooks/useHandleApiError";
import toast from "react-hot-toast";
import { uniqBy } from "lodash";
import styles from "./../../../FamilyMembers/familyMembers.module.scss";
import "./../../../FamilyMembers/familyMembers.scss";
import constants, { getKeyValueFromList } from "../../../../../constants";
import FamilyModal from "./../AddedMembers/FamilyModal";

function MemberAddedYou(props) {
  /* Intializations & Declarations */
  const { t, status } = props;
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
  } = useGetFamilyMemberAddedYouList(pageNumber, PAGE_SIZE, {
    cacheTime: 0,
  });
  const deleteYoursSelfMutation = useYourSelfAsMember();
  const [pageData, setPageData] = useState({
    familyMemberAddedYoulist: [],
    totalItems: 0,
    totalPages: 1,
  });
  const { familyMemberAddedYoulist, totalItems, totalPages } = pageData;

  /* use to handle API errors */
  useHandleApiError(isLoading, isFetching, isError);

  /**
   * @event: [useEffect]
   * @description: {
   *  call member added you listing and set the total pages and the total items
   * }
   */
  useEffect(() => {
    if (!isLoading && data?.data) {
      setPageData((prev) => {
        return {
          totalItems: data?.pagination?.totalItems,
          totalPages: data?.pagination?.totalPages,
          familyMemberAddedYoulist: uniqBy(
            [...prev.familyMemberAddedYoulist, ...data.data],
            "patientFamilyMemberId"
          ),
        };
      });
    }
  }, [isLoading, data, pageNumber]);

  /**
   * @event: [useEffect]
   * @description: {
   *  call user added you as member listing and set the total pages and the total items
   * }
   */
  useEffect(() => {
    setStorage(constants.familyMembers.cache.familyMemberAddedYoulisting, {
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
      familyMemberAddedYoulist: prev.familyMemberAddedYoulist.map(
        (item, listIndex) => {
          if (index === listIndex) item.isDropDownOpen = !item.isDropDownOpen;
          return item;
        }
      ),
    }));
  };

  /**
   * @method: [deleteYourSelf]
   * @description: use this method to call delete method
   * @param {object} memberData
   */
  const deleteYourSelf = (memberData) => {
    setConfirmModal(true);
    setSelectedFamilyMember(memberData);
  };

  /**
   * @method: [confirmDeleteMemeber]
   * @description: use this method to call delete member after taking confirmation
   * @param {object} memberData
   */
  const confirmDeleteMemeber = async () => {
    try {
      if (selectedFamilyMember) {
        const payload = {
          FamilyMemberId: selectedFamilyMember.patientFamilyMemberId,
        };

        await deleteYoursSelfMutation.mutateAsync(payload);
        setConfirmModal(false);
        setPageData((prev) => ({
          ...prev,
          familyMemberAddedYoulist: prev.familyMemberAddedYoulist.filter(
            (member) =>
              member.patientFamilyMemberId !==
              selectedFamilyMember.patientFamilyMemberId
          ),
        }));

        toast.success(t("familyMembers.deleteMemberSuccessMsg"));
        if (pageNumber === 1 && familyMemberAddedYoulist.length === 0)
          refetch();
      }
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      <InfiniteScroll
        dataLength={familyMemberAddedYoulist.length}
        hasMore={familyMemberAddedYoulist.length < totalItems}
        next={() => pageNumber < totalPages && setPageNumber((v) => v + 1)}
      >
        <div
          className={styles["family-member-card-main"] + " d-flex  flex-wrap"}
        >
          {(isLoading || isFetching) && <Loader />}
          {familyMemberAddedYoulist.length > 0 &&
            familyMemberAddedYoulist.map((member, index) => (
              <div
                className={styles["family-member-card-width"]}
                key={member.patientFamilyMemberId}
              >
                <div
                  className={
                    "family-member-card-page " + styles["family-member-card"]
                  }
                >
                  <div className="card-content">
                    <div className="d-flex justify-content-end px-1">
                      <div className={styles["family-member-dropdown"]}>
                        <Dropdown
                          isOpen={member.isDropDownOpen}
                          toggle={() => handleDropDown(index)}
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
                            className={
                              styles["dropdown-menu"] +
                              " " +
                              styles["remove-list"]
                            }
                          >
                            <Fragment>
                              <DropdownItem
                                className={styles["dropdown-item"]}
                                onClick={() => deleteYourSelf(member)}
                              >
                                <span>{t("familyMembers.remove")}</span>
                              </DropdownItem>
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
                            alt="staff"
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
                  </div>
                </div>
              </div>
            ))}
        </div>
      </InfiniteScroll>
      <FamilyModal
        isFamilyModalOpen={confirmModal}
        setIsFamilyModalOpen={setConfirmModal}
        title={t("familyMembers.deleteYourSelfModalTitle")}
        subTitle1={t("familyMembers.deleteYourSelfModalSubTitle")}
        subTitle2={t("familyMembers.sureForRemoveYourself")}
        leftBtnText={t("remove")}
        rightBtnText={t("cancel")}
        onConfirm={confirmDeleteMemeber}
      />
      {familyMemberAddedYoulist.length === 0 && (
        <div className="empty-block">
          <img
            src={require("assets/images/family-icon.svg").default}
            alt="icon"
          />
          <h4 className={styles["family-members-records"]}>
            {t("familyMembers.noOneAddedYouAsaFamilyMember")}
          </h4>
        </div>
      )}
    </>
  );
}

export default withTranslation()(MemberAddedYou);
