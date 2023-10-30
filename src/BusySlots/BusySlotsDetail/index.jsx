import Card from "components/Card";
import Page from "components/Page";
import Text from "components/Text";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import styles from "./BusyTineslotsDetail.module.scss";
import editIcon from "../../assets/images/edit-icon.svg";
import deleteIcon from "../../assets/images/delete-icon.svg";
import Tooltip from "reactstrap/lib/Tooltip";
import DeleteTimeSlotModal from "./components/Modals/DeleteTimeSlotModal";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import constants from "../../constants.js";
import { useParams } from "react-router-dom";
import {
  useGetBusySlot,
  deleteBusySlots,
  getBusySlotIcsLink,
} from "repositories/scheduler-repository";
import Loader from "components/Loader";
import moment from "moment";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import CustomModal from "components/CustomModal";
import AddToCalendar from "accountOwner/pages/components/AddToCalendar";
import { addToCalenderText, decodeId, encodeId } from "utils";

const BusyTineslotsDetail = ({ t, history }) => {
  const { profile } = useSelector((state) => state.userProfile);
  const currentUserId = profile?.id;
  // Tooltip Open state
  const goBack = () => history.push(constants.routes.scheduler.calendar);
  let { busySlotId } = useParams();
  busySlotId = decodeId(busySlotId)

  const [tooltipEditOpen, setTooltipEditOpen] = useState(false);
  const [tooltipDeleteOpen, setTooltipDeleteOpen] = useState(false);
  const [isDeleteTimeSlotModalOpen, setIsDeleteTimeSlotModalOpen] =
    useState(false);
  const [toolTipModal, setToolTipModal] = useState(false);

  const {
    isLoading,
    isFetching,
    data: busySlot,
    error,
  } = useGetBusySlot(busySlotId, { enabled: !!busySlotId });
  const showEditDelIcons = busySlot?.data?.createdById === currentUserId;

  useEffect(() => {
    if (!isLoading && !isFetching && error && error.message) {
      toast.error(error?.message);
    }
    //eslint-disable-next-line
  }, [error]);

  const [isDownloading, setIsDownloading] = useState(false);

  const handleAddToCalendar = async () => {
    setIsDownloading(true);
    try {
      const url = await getBusySlotIcsLink(busySlotId);
      window?.open(url, "_self");
      toast.success(t("fileDownloaded"));
    } catch (err) {
      toast.error(err?.message);
    }
    setIsDownloading(false);
  };

  const getRepeatString = (repeatedType, busySlotDate) => {
    if (repeatedType === 1) {
      return t("scheduler.never");
    } else if (repeatedType === 2) {
      return (
        t("scheduler.repeatForAll") +
        " - " +
        moment(busySlotDate).format("dddd")
      );
    } else if (repeatedType === 3) {
      return t("scheduler.repeatForAllFuture");
    }
  };

  const deleteSlot = async () => {
    try {
      let response = await deleteBusySlots(busySlotId);
      if (response?.statusCode === 200) {
        toast.success(response?.message);
        setIsDeleteTimeSlotModalOpen(false);
        goBack();
      }
    } catch (err) {
      toast.error(err?.message);
    }
  };

  let busySlotDetails = {};
  if (busySlot?.data) {
    busySlotDetails.officeName = busySlot.data.office?.name;
    busySlotDetails.title = busySlot.data.title;
    busySlotDetails.repeatedText = getRepeatString(
      busySlot.data.repeatedType,
      busySlot.data.date
    );
    busySlotDetails.startTime = moment(busySlot.data.startTime).format(
      "h:mm A"
    );
    busySlotDetails.endTime = moment(busySlot.data.endTime).format("h:mm A");
    busySlotDetails.date =
      moment(busySlot.data.date).format("MMM DD, YYYY - ddd") +
      ` (${busySlot.data.office?.state?.timezoneCode})`;
    busySlotDetails.location = busySlot.data.location;
    busySlotDetails.description = busySlot.data.description;
    busySlotDetails.repeated = busySlot.data.repeatedType > 1;
    busySlotDetails.endDate =
      moment(busySlot.data.repeatedEndDate).format("MMM DD, YYYY - ddd") +
      ` (${busySlot.data.office?.state?.timezoneCode})`;
  }
  return (
    <Page onBack={goBack} title={t("accountOwner.busyTimeslotDetails")}>
      {(isLoading || isDownloading) && <Loader />}
      <Card
        className={styles["busyslot-detail-card"]}
        radius="10px"
        marginBottom="18px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      >
        <div className="d-flex justify-content-end">
          {showEditDelIcons && (
            <div className={styles["delete-edit-icons"]}>
              <img
                src={deleteIcon}
                alt="delete"
                id="TooltipDeleteBtn"
                onClick={() => {
                  setIsDeleteTimeSlotModalOpen(true);
                }}
              />
              <Tooltip
                isOpen={tooltipDeleteOpen}
                placement="top"
                target="TooltipDeleteBtn"
                toggle={() => {
                  setTooltipDeleteOpen(!tooltipDeleteOpen);
                }}
              >
                Delete Timeslot
              </Tooltip>
              <img
                src={editIcon}
                alt="edit"
                id="TooltipEditBtn"
                onClick={() => {
                  history.push(
                    constants.routes.scheduler.editBusySlot.replace(
                      ":busySlotId",
                      encodeId(busySlotId)
                    )
                  );
                }}
              />

              <Tooltip
                isOpen={tooltipEditOpen}
                placement="top"
                target="TooltipEditBtn"
                toggle={() => {
                  setTooltipEditOpen(!tooltipEditOpen);
                }}
              >
                Edit Timeslot
              </Tooltip>
            </div>
          )}
        </div>
        <Row>
          <Col lg="6">
            <ul className={styles["white-col-list"]}>
              <li>
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("accountOwner.offices")}
                </Text>
                <Text size="14px" marginBottom="0" weight="600" color="#102c42">
                  {busySlotDetails.officeName}
                </Text>
              </li>

              <li>
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("title")}
                </Text>
                <Text size="14px" marginBottom="0" weight="600" color="#102c42">
                  {busySlotDetails.title}
                </Text>
              </li>
              <li>
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("accountOwner.date")}
                </Text>
                <Text size="14px" marginBottom="0" weight="600" color="#102c42">
                  {busySlotDetails.date}
                </Text>
              </li>
              <li>
                <Row>
                  <Col sm="6">
                    <Text
                      size="12px"
                      marginBottom="5px"
                      weight="400"
                      color="#6f7788"
                    >
                      {t("staff.startTime")}
                    </Text>
                    <Text
                      size="14px"
                      marginBottom="0"
                      weight="600"
                      color="#102c42"
                    >
                      {busySlotDetails.startTime}
                    </Text>
                  </Col>
                  <Col sm="6">
                    <Text
                      size="12px"
                      marginBottom="5px"
                      weight="400"
                      color="#6f7788"
                    >
                      {t("accountOwner.endTime")}
                    </Text>
                    <Text
                      size="14px"
                      marginBottom="0"
                      weight="600"
                      color="#102c42"
                    >
                      {busySlotDetails.endTime}
                    </Text>
                  </Col>
                </Row>
              </li>
              <li>
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("repeat")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="5px"
                  weight="600"
                  color="#102c42"
                >
                  {busySlotDetails.repeatedText}
                </Text>
              </li>
              {busySlotDetails.repeated && (
                <li>
                  <Text
                    size="12px"
                    marginBottom="5px"
                    weight="400"
                    color="#6f7788"
                  >
                    {t("superAdmin.endDate")}
                  </Text>
                  <Text
                    size="14px"
                    marginBottom="0"
                    weight="600"
                    color="#102c42"
                  >
                    {busySlotDetails.endDate}
                  </Text>
                </li>
              )}
              <li>
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("location")}
                </Text>
                <Text
                  size="14px"
                  marginBottom="5px"
                  weight="600"
                  color="#102c42"
                >
                  {busySlotDetails.location}
                </Text>
              </li>

              <li>
                <Text
                  size="12px"
                  marginBottom="5px"
                  weight="400"
                  color="#6f7788"
                >
                  {t("superAdmin.description")}
                </Text>
                <Text size="14px" marginBottom="0" weight="600" color="#102c42">
                  {busySlotDetails.description}
                </Text>
              </li>
              {showEditDelIcons && (
                <li>
                  <AddToCalendar
                    firstIcon={
                      require("assets/images/download-icon.svg").default
                    }
                    middleText={t("accountOwner.addToCalendar")}
                    secondIcon={
                      require("assets/images/alert-circle.svg").default
                    }
                    handleAddToCalendar={handleAddToCalendar}
                    setToolTipModal={setToolTipModal}
                  />
                </li>
              )}
            </ul>
          </Col>
        </Row>
      </Card>
      {isDeleteTimeSlotModalOpen && (
        <DeleteTimeSlotModal
          isDeleteTimeSlotModalOpen={isDeleteTimeSlotModalOpen}
          deleteSlot={deleteSlot}
          setIsDeleteTimeSlotModalOpen={setIsDeleteTimeSlotModalOpen}
        />
      )}
      <CustomModal
        isOpen={toolTipModal}
        setIsOpen={setToolTipModal}
        title={t("accountOwner.addToCalendar")}
        subTitle1={addToCalenderText()}
        calender={true}
      />
    </Page>
  );
};

export default withTranslation()(BusyTineslotsDetail);
