import axios from "axios";
import moment from "moment";
import { useMutation, useQuery } from "react-query";
import { Config } from "./../config";

const baseUrl = Config.serviceUrls.patientSchedulingBaseUrl.replace(
  "/api/v1",
  ""
);

export async function getUnavailableDates(doctorId, officeId, date, month) {
  const response = await axios.get(`${baseUrl}/common/UnavailableDates`, {
    params: {
      doctorId,
      officeId,
      date,
      month,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useUnavailableDates(doctorId, officeId, date, month) {
  return useQuery(
    ["/common/UnavailableDates", doctorId, officeId, date, month],
    () => getUnavailableDates(doctorId, officeId, date, month)
  );
}

export async function getSlots(doctorId, officeId, date) {
  date = moment(date).format("YYYY-MM-DD");
  const response = await axios.get(`${baseUrl}/common/SlotSchedule`, {
    params: {
      doctorId,
      officeId,
      date,
    },
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.data;
}

export function useSlots(doctorId, officeId, date, isEnabled) {
  return useQuery(
    ["/common/SlotSchedule", doctorId, officeId, date],
    () => getSlots(doctorId, officeId, date),
    { enabled: isEnabled, cacheTime: 0 }
  );
}

export async function bookAppointment(
  doctorId,
  officeId,
  patientId,
  date,
  reminderDate,
  description,
  slots,
  TimeRequired,
  patientFamilyMemberId
) {
  const body = {
    doctorId,
    officeId,
    patientId,
    date,
    reminderDate,
    description,
    slots,
  };
  if (TimeRequired) {
    body.TimeRequired = TimeRequired;
  }

  if (patientFamilyMemberId) body.patientFamilyMemberId = patientFamilyMemberId;

  const response = await axios.post(`${baseUrl}/common/BookAppointment`, body);

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }

  return response.data.message;
}

export function useBookAppointmentMutation() {
  return useMutation(
    ({
      doctorId,
      officeId,
      patientId,
      date,
      reminderDate,
      description,
      slots,
      TimeRequired,
      patientFamilyMemberId,
    }) =>
      bookAppointment(
        doctorId,
        officeId,
        patientId,
        date,
        reminderDate,
        description,
        slots,
        TimeRequired,
        patientFamilyMemberId
      )
  );
}

//This is reqeust for waiting list appointment
export const requestAppointment = async (body) => {
  const response = await axios.post(
    `${baseUrl}/api/v1/AppointmentRequest`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.message;
};

export const useRequestAppointmentMutation = () => {
  return useMutation(requestAppointment);
};

//This is reqeust for appointment request for google doctors and trial/free sub doctors
export const requestDoctorAppointment = async (body) => {
  const response = await axios.post(
    `${baseUrl}/api/v1/RequestAppointmentForAvailability`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.message;
};

export const useRequestDoctorAppointment = () => {
  return useMutation(requestDoctorAppointment);
};

// Get Request appointment list for super admin
export async function getRequestAppointmentList({ queryKey }) {
  const [, PageNumber, Status, PageSize] = queryKey;
  const response = await axios.get(
    `${baseUrl}/api/v1/RequestAppointmentForAvailability/RequestAppointmentList`,
    { params: { PageNumber, PageSize, Status } }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
}

export function useGetRequestAppointmentList(
  pageNumber,
  status,
  pageSize = 5,
  options = {}
) {
  return useQuery(
    ["/common/request-appointment-list", pageNumber, status, pageSize],
    getRequestAppointmentList,
    options
  );
}

export const deleteRequestDoctorAppointment = async (ids) => {
  const body = {
    RequestAppointmentIds: ids,
  };
  const response = await axios.delete(
    `${baseUrl}/api/v1/RequestAppointmentForAvailability/Delete`,
    { data: body }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.message;
};

export const useDeleteRequestDoctorAppointment = () => {
  return useMutation(deleteRequestDoctorAppointment);
};

export const completeRequestDoctorAppointment = async (ids) => {
  const body = {
    RequestAppointmentIds: ids,
  };
  const response = await axios.put(
    `${baseUrl}/api/v1/RequestAppointmentForAvailability/Complete`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.message;
};

export const useCompleteRequestDoctorAppointment = () => {
  return useMutation(completeRequestDoctorAppointment);
};

//Get Appointment request details
export async function getRequestAppointmentDetail({ queryKey }) {
  const [, RequestAppointmentId] = queryKey;
  const response = await axios.get(
    `${baseUrl}/api/v1/RequestAppointmentForAvailability`,
    { params: { RequestAppointmentId } }
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
}

export function useGetRequestAppointmentDetail(requestId, options = {}) {
  return useQuery(
    ["/common/request-appointment-detail", requestId],
    getRequestAppointmentDetail,
    options
  );
}

export async function getIsQuestionnaireEnabled(officeId, date) {
  const response = await axios.get(`${baseUrl}/Common/HasQuestionnaireEnable`, {
    params: { officeId, date },
  });
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
}

export function useGetIsQuestionnaireEnabled(officeId, date, options = {}) {
  const formattedDate = moment(date).format("YYYY-MM-DD");
  return useQuery(
    ["isQuestionnarieEnabled", officeId, formattedDate],
    () => getIsQuestionnaireEnabled(officeId, formattedDate),
    options
  );
}
