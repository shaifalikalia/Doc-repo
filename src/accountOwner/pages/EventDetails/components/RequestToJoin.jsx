import React from "react";
import styles from "../EventDetails.module.scss";
import "./component.scss";
import { withTranslation } from "react-i18next";
import Text from "components/Text";
import moment from "moment";
import { getDay } from "utils";
import constants, { getSchedulerStatusById } from "../../../../constants";



const RequestToJoin = ({
  t,
  eventDetails,
  setSpecficDates,
  setIsRejectionModalOpen,
}) => {

  const eventType = (type) => {
    let data;
    switch (type) {
      case 4:
        data = t("accountOwner.specificDates");
        break;
      case 1:
        data = `(${moment(eventDetails?.date).format("Do MMMM, YYYY")})`;
        break;

      case 3:
          data =  t("accountOwner.foralldates");
          break;
      case 2:
        data = t("scheduler.allDays", {
          field: getDay(new Date(eventDetails?.date))?.day,
        });
        break;
      default:
        data = "";
    }
    return data;
  };




 

  let requestToJoinList = eventDetails?.eventRequestToJoins;
  const acceptDeclineButtons = (item , index) => {
    return (
      <div className="d-flex">
        <button
          className="button button-round button-shadow mr-4 button-dark btn-small-35  "
          onClick={() => {
            setIsRejectionModalOpen({
              ...item,
              type: constants.SCHEDULEREVENTTYPE.REJECT,
              index:index
            });
          }}
          title={t("decline")}
        >
          {t("decline")}
        </button>
        <button
          className="button button-round button-shadow mr-3 btn-small-35"
          onClick={() => {
            setIsRejectionModalOpen({
              ...item,
              type: constants.SCHEDULEREVENTTYPE.ACCEPT,
              index:index
            });
          }}
          title={t("accept")}
        >
          {t("accept")}
        </button>
      </div>
    );
  };

  return (
    <>
      {requestToJoinList?.length > 0 ? (
        requestToJoinList?.map((item, index) => (
          <div className={styles["request-join-tab"]} key={index}>
            <div className={styles["join-single"]}>

            <img src={item?.requestedBy?.profilePic || require('assets/images/staff-default.svg').default } alt="icon" />
              <div className={styles["text-box"]}>
                <Text
                  size="16px"
                  marginBottom="5px"
                  weight="300"
                  color="#535b5f"
                >
                  <span className="font-semibold">
                    {item?.requestedBy?.firstName}{" "}
                  </span>

                  {item?.requestRepeatType ===
                  constants.SCHEDULEREVENTTYPE.SINGLEDAY
                    ? t("accountOwner.requestedJoinEventForThisDay")
                    : t("accountOwner.requestedJoinEventFor")}
                  <span className="font-semibold">
                    {!!item?.requestRepeatType &&
                      eventType(item?.requestRepeatType)}
                  </span>
                </Text>

                <div className="d-flex">

              {  
              item?.requestedBy?.role?.systemRole !== constants.systemRoles.accountOwner 
              &&
              <Text
                      size="12px"
                      marginBottom="10px"
                      weight="500"
                      color="#6f7788"
                      className="mr-1"
                    >
                      {item?.requestedBy?.designation?.name}
                    </Text>
                    }


                  {(item?.requestRepeatType === constants.SCHEDULEREVENTTYPE.SPECFICDATES
                  )
                  && (
                    <Text
                      size="12px"
                      marginBottom="10px"
                      weight="500"
                      color="#6f7788"
                      className="link-btn"
                      onClick={() =>  setIsRejectionModalOpen({
                        ...item,
                        type: constants.SCHEDULEREVENTTYPE.SPECFICDATES,
                        index:index
                      })}
                    >
                      {t("accountOwner.seeSpecificDates")}
                    </Text>
                  )}

                  {item?.status === constants.SCHEDULERSTATUS.REJECT && (
                    <Text
                      size="12px"
                      className="link-btn ml-2"
                      marginBottom="10px"
                      weight="500"
                      color="#6f7788"
                      onClick={() =>  setIsRejectionModalOpen({
                        ...item,
                        type: constants.SCHEDULEREVENTTYPE.REASONOFREJECT,
                        index:index
                      })}
                    >
                      {t("accountOwner.SeeReasonofRejection")}
                    </Text>
                  )}
                </div>
              </div>

              {item.status === constants.SCHEDULERSTATUS.PENDING ? (
                acceptDeclineButtons(item,index)
              ) : ( 
                <div>
                  <div
                    className={
                      styles["status-tag"] + 
                      " " +
                      (item.status > 2 ? styles["bg-red"] : "")
                    }
                  >
                    {" "}
                    {t(getSchedulerStatusById(item.status))}
                  </div>
                </div>
              )}

            </div>
          </div>
        ))
      ) : (
        <div className="scheduler-empty-box">
          <p>
            <img
              src={require("assets/images/request-calendar.svg").default}
              alt="icon"
            />{" "}
          </p>
          <Text size="25px" marginBottom="0" weight="500" color="#111B45">
            {t("scheduler.noRequestFound")}
          </Text>
        </div>
      )}
    </>
  );
};
export default withTranslation()(RequestToJoin);
