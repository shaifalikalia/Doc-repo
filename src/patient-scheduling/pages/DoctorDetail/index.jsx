import React from "react";
import styles from "./DoctorDetail.module.scss";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import { useDoctorDetail } from "repositories/doctor-repository";
import useQueryParam from "hooks/useQueryParam";
import Toast from "components/Toast/Alert";
import Detail from "./Detail";
import { useUserSpecialties } from "repositories/specialty-repository";
import constants from "./../../../constants";
import qs from "query-string";
import FullDetail from "./FullDetail";
import { useSelector } from "react-redux";
import editProfileWarningIcon from "./../../../assets/images/edit-profile-warning.svg";
import useInitialAppointmentDateSelector from "./FullDetail/useInitialAppointmentDateSelector";
import useUpdateLocation from "./useUpdateLocation";

function DoctorDetail({ location, history, signIn, t }) {
  const doctorId = useQueryParam("doctorId", null);
  const officeId = useQueryParam("officeId", null);
  const profile = useSelector((s) => s.userProfile.profile);

  const { isLoading: isLoadingInitialAppointmentDate, appointmentDate } =
    useInitialAppointmentDateSelector(doctorId, officeId);
  const { isLoading, data, error } = useDoctorDetail(doctorId, officeId);
  const {
    isLoading: isLoadingSpecialties,
    data: specialties,
    error: specialtiesError,
  } = useUserSpecialties(doctorId);
  useUpdateLocation();

  const to = {
    pathname: constants.routes.doctors,
    search: location.state
      ? qs.stringify({
          pageNumber: location.state.pageNumber,
          search: location.state.search,
          specialtyId: location?.state?.specialtyId,
          specialtyName: location?.state?.specialtyName,
        })
      : null,
    state: location.state,
  };
  const onBack = () => {
    history.push(to);
  };

  let content = null;
  if (isLoading || isLoadingInitialAppointmentDate) {
    content = (
      <div className="center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!isLoadingInitialAppointmentDate && !isLoading && error) {
    content = <Toast errorToast message={error.message} />;
  }

  if (!isLoadingInitialAppointmentDate && !isLoading && !error) {
    content = data.isSubscriptionPurchased ? (
      <FullDetail
        to={to}
        detail={data}
        initialAppointmentDate={appointmentDate}
        isLoadingSpecialties={isLoadingSpecialties}
        specialties={
          !isLoadingSpecialties && !specialtiesError ? specialties : []
        }
        signIn={signIn}
        t={t}
      />
    ) : (
      <Detail
        detail={data}
        isLoadingSpecialties={isLoadingSpecialties}
        specialties={
          !isLoadingSpecialties && !specialtiesError ? specialties : []
        }
        t={t}
      />
    );
  }

  return (
    <>
      {profile &&
        profile.role &&
        profile.role.systemRole !== constants.systemRoles.patient && (
          <div className="page-warning-container container mt-3">
            <div className="page-warning-bg">
              <img
                className="page-warning-icon"
                src={editProfileWarningIcon}
                alt=""
              />
              <div className="page-warning-text">
                {t("patient.otherRoleWarningMessage")}
              </div>
            </div>
          </div>
        )}
      <Page
        className={styles["doctor-profile-page"]}
        titleKey={t("patient.doctorProfileTitle")}
        onBack={onBack}
      >
        <div className={styles["doctor-profile-block"]}>{content}</div>
      </Page>
    </>
  );
}

export default withTranslation()(DoctorDetail);
