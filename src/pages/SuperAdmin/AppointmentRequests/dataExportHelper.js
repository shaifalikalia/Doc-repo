export const getPropsForCSV = (selectedIds, requestData, selectedAll) => {
  const headers = [
    { label: "Request Status", key: "statusTitle" },
    { label: "Patient Name", key: "patientName" },
    { label: "Patient Email Id", key: "patientID" },
    { label: "Patient Contact Number", key: "patientContactNumber" },
    { label: "Provider/Doctor Name", key: "providerDoctorName" },
    { label: "Provider/Doctor's Address", key: "doctorAddress" },
    { label: "Preferred Appointment Date", key: "appointmentDate" },
    { label: "Preferred Appointment Time", key: "appointmentTime" },
    { label: "Note added by the patient", key: "reasonForVisit" },
  ];

  let data = requestData;

  if (!selectedAll) {
    data = requestData.filter(({ id }) => selectedIds.includes(id));
  }

  return {
    filename: "request-list",
    headers,
    data,
  };
};
