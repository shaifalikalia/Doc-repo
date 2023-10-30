import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAddLocationMutation } from "repositories/user-repository";
import constants from "./../../../constants";

export default async function useUpdateLocation() {
  const profile = useSelector((s) => s.userProfile.profile);
  const mutation = useAddLocationMutation();
  const appointmentData = localStorage.getItem(
    constants.lsKeys.bookAppointmentData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      profile !== null &&
      profile.role &&
      profile.role.systemRole === constants.systemRoles.patient &&
      profile.countryId === null &&
      appointmentData !== null
    ) {
      const serializedLocationData = localStorage.getItem(
        "doctorSearchLocation"
      );
      let locationData = { countryId: 1 };

      if (serializedLocationData !== null) {
        locationData = JSON.parse(serializedLocationData);
      }

      try {
        mutation.mutate({
          countryId: locationData.countryId,
          stateId: locationData.stateId,
          cityId: locationData.cityId,
          address: locationData.street,
        });
        dispatch({ type: "GET_PROFILE" });
      } catch (e) {}
    }
    //eslint-disable-next-line
  }, [profile, appointmentData]);
}
