import Card from "components/Card";
import Page from "components/Page";
import Text from "components/Text";
import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import styles from "./AppointmentRequestDetail.module.scss";
import Row from "reactstrap/lib/Row";
import Col from "reactstrap/lib/Col";
import constants from "../../../constants";
import { useParams } from "react-router-dom";
import Loader from "components/Loader";
import moment from "moment";
import toast from "react-hot-toast";
import { decodeId } from "utils";
import {
  useCompleteRequestDoctorAppointment,
  useGetRequestAppointmentDetail,
} from "repositories/appointment-repository";
import { findKey } from "lodash";
import CompleteRequestModal from "../components/CompleteRequestModal";

const AppointmentRequestDetail = ({ t, history, location }) => {
  const goBack = () => {
    history.push({
      pathname: constants.routes.superAdmin.appointmentRequestList,
      search: location?.state?.search || null,
    });
  };

  let { requestId } = useParams();
  requestId = decodeId(requestId);
  const {
    isLoading,
    data: appointmentDetails,
    isFetching,
    error,
    refetch,
  } = useGetRequestAppointmentDetail(requestId, { enabled: !!requestId });
  const markCompleteMutation = useCompleteRequestDoctorAppointment();
  const { isLoading: requestingCompletion } = markCompleteMutation;

  const [completeModal, setCompleteModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isFetching && error && error.message) {
      toast.error(error.message);
    }
  }, [error]);

  const getUsefullInfo = () => {
    const obj = {};
    obj.statusText = t("unknown");
    obj.appointmentTime = t("unknown");
    obj.isPending = false;
    const translationKeyForStatus = findKey(
      constants.googleDoctorsStatusFilter,
      (filterId) => filterId === appointmentDetails?.requestAppointmentStatus
    );
    const translationKeyForTime = findKey(
      constants.appointmentTimeTypes,
      (timeId) => timeId === appointmentDetails?.appointmentTime
    );
    obj.statusText = t(
      `superAdmin.appointmentRequestList.status.${translationKeyForStatus}`
    );
    obj.statusClass = translationKeyForStatus?.toLowerCase();
    obj.isPending =
      appointmentDetails?.requestAppointmentStatus ===
      constants.googleDoctorsStatusFilter.Pending;
    obj.appointmentTime = t(`patient.${translationKeyForTime?.toLowerCase()}`);

    return obj;
  };

  const confirmMarkComplete = async () => {
    setCompleteModal(false);
    try {
      await markCompleteMutation.mutateAsync([requestId]);
      toast.success(t("patient.Requestascompleted"));
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMarkComplete = async () => {
    setCompleteModal(true);
  };

  const usefullInfo = getUsefullInfo();

  return (
    <Page onBack={goBack}>
      {(isLoading || requestingCompletion) && <Loader />}
      <div className={`container-smd container p-0`}>
        <h2 className="page-title my-3">
          {t("superAdmin.appointmentRequestDetail.title")}
        </h2>
        <Card
          className={styles["busyslot-detail-card"]}
          radius="10px"
          marginBottom="18px"
          shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
        >
          <div
            className={`${styles["status"]} ${styles[usefullInfo.statusClass]}`}
          >
            {usefullInfo.statusText}
          </div>
          <Row>
            <Col lg="12">
              <ul className={styles["white-col-list"]}>
                <li>
                  <Text
                    size="12px"
                    marginBottom="5px"
                    weight="400"
                    color="#6f7788"
                  >
                    {t("superAdmin.patientName")}
                  </Text>
                  <Text
                    size="14px"
                    marginBottom="0"
                    weight="600"
                    color="#102c42"
                  >
                    {appointmentDetails?.patientName}
                  </Text>
                </li>

                <li>
                  <Text
                    size="12px"
                    marginBottom="5px"
                    weight="400"
                    color="#6f7788"
                  >
                    {t("emailAddress")}
                  </Text>
                  <Text
                    size="14px"
                    marginBottom="0"
                    weight="600"
                    color="#102c42"
                  >
                    {appointmentDetails?.patientEmailId}
                  </Text>
                </li>
                {!!appointmentDetails?.patientContactNumber && (
                  <li>
                    <Text
                      size="12px"
                      marginBottom="5px"
                      weight="400"
                      color="#6f7788"
                    >
                      {t("phoneNumber")}
                    </Text>
                    <Text
                      size="14px"
                      marginBottom="0"
                      weight="600"
                      color="#102c42"
                    >
                      {appointmentDetails?.patientContactNumber}
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
                    {t("patient.provider")}
                  </Text>
                  <Text
                    size="14px"
                    marginBottom="0"
                    weight="600"
                    color="#102c42"
                  >
                    {appointmentDetails?.googleDoctor?.businessName}
                  </Text>
                </li>
                <li>
                  <Text
                    size="12px"
                    marginBottom="5px"
                    weight="400"
                    color="#6f7788"
                  >
                    {t("superAdmin.address")}
                  </Text>
                  <Text
                    size="14px"
                    marginBottom="5px"
                    weight="600"
                    color="#102c42"
                  >
                    {appointmentDetails?.googleDoctor?.address}
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
                        {t(
                          "superAdmin.appointmentRequestDetail.appointmentDate"
                        )}
                      </Text>
                      <Text
                        size="14px"
                        marginBottom="0"
                        weight="600"
                        color="#102c42"
                      >
                        {moment(appointmentDetails?.appointmentDate).format(
                          "MMM DD, YYYY"
                        )}
                      </Text>
                    </Col>
                    <Col sm="6">
                      <Text
                        size="12px"
                        marginBottom="5px"
                        weight="400"
                        color="#6f7788"
                      >
                        {t("superAdmin.appointmentRequestDetail.time")}
                      </Text>
                      <Text
                        size="14px"
                        marginBottom="0"
                        weight="600"
                        color="#102c42"
                      >
                        {usefullInfo.appointmentTime}
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
                    {t("superAdmin.description")}
                  </Text>
                  <Text
                    size="14px"
                    marginBottom="0"
                    weight="600"
                    color="#102c42"
                  >
                    {appointmentDetails?.reasonForVisit}
                  </Text>
                </li>
              </ul>

              {usefullInfo.isPending && (
                <button
                  className="button button-round button-shadow mr-4"
                  title={t("superAdmin.appointmentRequestDetail.markCompleted")}
                  onClick={handleMarkComplete}
                >
                  {t("superAdmin.appointmentRequestDetail.markCompleted")}
                </button>
              )}
            </Col>
          </Row>
        </Card>
      </div>
      <CompleteRequestModal
        completeModal={completeModal}
        setCompleteModal={setCompleteModal}
        confirmMarkComplete={confirmMarkComplete}
      />
    </Page>
  );
};

export default withTranslation()(AppointmentRequestDetail);
