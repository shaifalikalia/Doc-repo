import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import "rc-time-picker/assets/index.css";
import { Modal, ModalBody, Spinner } from "reactstrap";
import Text from "components/Text";
import InfiniteScroll from "react-infinite-scroll-component";
import { useGetMembersForBooking } from "repositories/family-member-repository";
import useHandleApiError from "hooks/useHandleApiError";
import { useSelector } from "react-redux";
import { uniqBy } from "lodash";
import { setStorage } from "utils";
import "./DialerModel.scss";
import crossIcon from "./../../../assets/images/cross.svg";
import iconForward from "./../../../assets/images/ico_forward.svg";
import constants, { getKeyValueFromList } from "../../../constants";
import userDefaultImage from "./../../../assets/images/staff-default-rounded.png";

const BookAppointmentModal = ({
  t,
  isBookAppointmentModalOpen,
  setIsBookAppointmentModalOpen,
  loggedInUserId,
  handleMemberClick,
}) => {
  const closeBookAppointmentModal = () => setIsBookAppointmentModalOpen(false);
  const profile = useSelector((s) => s.userProfile.profile);
  const PAGE_SIZE = 4;
  const [memberPageNumber, setMemberPageNumber] = useState(1);
  const {
    data,
    error: isError,
    isLoading,
    isFetching,
  } = useGetMembersForBooking(memberPageNumber, PAGE_SIZE, {
    enabled: !!profile?.id,
    cacheTime: 0,
  });
  const [pageData, setPageData] = useState({
    membersForBooking: [],
    totalItems: 0,
    totalPages: 1,
  });
  const { membersForBooking, totalItems, totalPages } = pageData;
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
          membersForBooking: uniqBy(
            [...prev.membersForBooking, ...data.data],
            "patientFamilyMemberId"
          ),
        };
      });
    }
  }, [isLoading, data, memberPageNumber]);

  return (
    <Modal
      isOpen={isBookAppointmentModalOpen}
      toggle={closeBookAppointmentModal}
      className="modal-dialog-centered book-appointment-modal"
      modalClassName="custom-modal"
    >
      {/* {(isLoading || isFetching) && <Loader />} */}
      <span className="close-btn" onClick={closeBookAppointmentModal}>
        <img src={crossIcon} alt="close" />
      </span>
      <ModalBody id="scrollableDiv">
        <Text size="25px" marginBottom="30px" weight="500" color="#111B45">
          <span className="modal-title-25">{t("patient.bookingForWhom")}</span>
        </Text>
        {membersForBooking.length > 0 && (
          <InfiniteScroll
            dataLength={membersForBooking?.length}
            hasMore={membersForBooking.length < totalItems}
            next={() =>
              memberPageNumber < totalPages && setMemberPageNumber((v) => v + 1)
            }
            height={"auto"}
            loader={
              <div className="d-flex justify-content-center">
                <Spinner animation="border" className="loader-spinner" />
              </div>
            }
            scrollableTarget="scrollableDiv"
          >
            <ul className={"modal-employee-list group-list"}>
              {membersForBooking.map((member) => (
                <li
                  className="d-flex cursor-pointer"
                  key={member.patientFamilyMemberId}
                >
                  <div className="mr-3 image-profile">
                    <img
                      src={member.profilePic || userDefaultImage}
                      alt="father"
                    />
                  </div>
                  <div
                    className="relationship d-flex justify-content-center flex-column"
                    onClick={() => {
                      handleMemberClick(
                        member.patientFamilyMemberId || member.userId
                      );
                      setStorage(
                        constants.familyMembers.cache.selectedMemberData,
                        { memberData: member }
                      );
                    }}
                  >
                    {member.userId === loggedInUserId ? (
                      <Text size="14px" weight="600" color="#102C42">
                        <span className="modal-title-25">
                          {t("familyMembers.mySelf")}
                        </span>
                      </Text>
                    ) : (
                      <>
                        <Text
                          size="14px"
                          marginBottom="4px"
                          weight="600"
                          color="#102C42"
                        >
                          <span className="modal-title-25">
                            {`${member.firstName} ${member.lastName}`}
                          </span>
                        </Text>
                        <Text size="12px" weight="400" color=" #6F7788">
                          {getKeyValueFromList(
                            constants.relationOptions,
                            member.relation,
                            "name"
                          )}
                        </Text>
                      </>
                    )}
                  </div>
                  <span className="icon-forward">
                    {" "}
                    <img src={iconForward} alt="icon" />
                  </span>
                </li>
              ))}
            </ul>
          </InfiniteScroll>
        )}
      </ModalBody>
    </Modal>
  );
};

export default withTranslation()(BookAppointmentModal);
