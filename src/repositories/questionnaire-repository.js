import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { Config } from "../config";

const baseUrl = Config.serviceUrls.patientSchedulingBaseUrl.replace(
  "/api/v1",
  ""
);

export const getQuestionnaire = async (officeId) => {
  const response = await axios.get(`${baseUrl}/Common/Questionnaire`, {
    params: { officeId },
  });
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useGetQuestionnaire = (officeId, options = {}) => {
  return useQuery(
    ["get-questionnaire", officeId],
    () => getQuestionnaire(officeId),
    options
  );
};

export const fillQuestionnaire = async ({
  OfficeId,
  DoctorId,
  PatientId,
  QuestionResponse,
}) => {
  const body = { OfficeId, DoctorId, PatientId, QuestionResponse };
  const response = await axios.post(
    `${baseUrl}/Common/FillQuestionnaire`,
    body
  );
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useFillQuestionnaire = () => {
  return useMutation(fillQuestionnaire);
};

export const getFilledQuestionnaire = async (officeId, doctorId, patientId) => {
  const params = { officeId, doctorId, patientId };
  const response = await axios.get(`${baseUrl}/Common/QuestionnaireResponse`, {
    params,
  });
  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const useGetFilledQuestionnaire = (
  officeId,
  doctorId,
  patientId,
  options = {}
) => {
  return useQuery(
    ["filled-questionnaire", officeId, doctorId, patientId],
    () => getFilledQuestionnaire(officeId, doctorId, patientId),
    options
  );
};
