import React from "react";
import styles from "./DoctorDetail.module.scss";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import { useDoctorDetail } from "repositories/doctor-repository";
import useQueryParam from "hooks/useQueryParam";
import Toast from "components/Toast/Alert";
import { useUserSpecialties } from "repositories/specialty-repository";
import constants from "../../../constants";
import qs from "query-string";
import FullDetail from "./FullDetail";
import { useSelector } from "react-redux";
import editProfileWarningIcon from "./../../../assets/images/edit-profile-warning.svg";

function DoctorDetail({ history, signIn, t }) {
  const doctorId = useQueryParam("doctorId", null);
  const officeId = useQueryParam("officeId", null);
  const memberId = useQueryParam("memberId", null);
  const profile = useSelector((s) => s.userProfile.profile);

  const onBack = () => {
    history.push({
      pathname: constants.routes.doctor,
      search: qs.stringify({
        doctorId,
        officeId,
        memberId,
      }),
    });
  };

  const { isLoading, data, error } = useDoctorDetail(doctorId, officeId);
  const {
    isLoading: isLoadingSpecialties,
    data: specialties,
    error: specialtiesError,
  } = useUserSpecialties(doctorId);

  let content = null;
  if (isLoading) {
    content = (
      <div className="center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!isLoading && error) {
    content = <Toast errorToast message={error.message} />;
  }

  if (!isLoading && !error) {
    content = (
      <FullDetail
        detail={data}
        isLoadingSpecialties={isLoadingSpecialties}
        specialties={
          !isLoadingSpecialties && !specialtiesError ? specialties : []
        }
        signIn={signIn}
        profile={profile}
        onBack={onBack}
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
