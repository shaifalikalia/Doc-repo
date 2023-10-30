import constants from "./../../../../constants";
import { useSelector } from "react-redux";
import { useSlots } from "repositories/appointment-repository";

export default function useInitialAppointmentDateSelector(doctorId, officeId) {
  const profile = useSelector((s) => s.userProfile.profile);
  const { appointmentDate, slots } = useStoredAppointmentData();

  const { isLoading, data: rawSlots } = useSlots(
    doctorId,
    officeId,
    appointmentDate,
    appointmentDate !== null && profile !== null
  );

  if (profile === null || appointmentDate === null) {
    return { isLoading: false, appointmentDate: null };
  }

  if (isLoading) {
    return { isLoading: true, appointmentDate: null };
  }

  if (!isLoading && !rawSlots) {
    localStorage.removeItem(constants.lsKeys.bookAppointmentData);
    return { isLoading: false, appointmentDate: null };
  }

  for (let i = 0; i < slots.length; i++) {
    const index = rawSlots.findIndex(
      (it) => it.startTime === slots[i].time && it.slotStatus === 1
    );
    if (index === -1) {
      localStorage.removeItem(constants.lsKeys.bookAppointmentData);
      return { isLoading: false, appointmentDate: null };
    }
  }

  return { isLoading: false, appointmentDate };
}

function useStoredAppointmentData() {
  const appointmentData = localStorage.getItem(
    constants.lsKeys.bookAppointmentData
  );
  if (appointmentData === null) {
    //**Cached Appointmet date is used when user goes away form doctor appointmetn page and then comes back */
    const cachedAppointmentDate = sessionStorage.getItem(
      constants.localStorageKeys.selectedAppointmentDate
    );
    if (cachedAppointmentDate) {
      return { appointmentDate: cachedAppointmentDate, slots: [] };
    }
    return { appointmentDate: null, slots: [] };
  }

  const { appointmentDate, selectedSlots } = JSON.parse(appointmentData);
  return { appointmentDate, slots: selectedSlots };
}
