import axios from "axios";
import { Config } from "../config";

const userMicroserviceBaseURL = Config.serviceUrls.userBaseUrl;

const staffRepository = {};

staffRepository.getUserOfficesWhereStaffIsAdmin = async (userId) => {
  try {
    let response = await axios.get(
      `${userMicroserviceBaseURL}/Staff/${userId}/AdminUserOfficeList`
    );
    return response.data;
  } catch (e) {
    return { message: e.message };
  }
};

staffRepository.getSubstitutes = async (userId, officeId) => {
  try {
    let response = await axios.get(
      `${userMicroserviceBaseURL}/Staff/CompatibleAdminList`,
      {
        params: {
          staffMemberId: userId,
          officeId: officeId,
        },
      }
    );
    return response.data;
  } catch (e) {
    return { message: e.message };
  }
};

staffRepository.activateStaff = async (userId, officeId) => {
  return await staffRepository.updateStaffStatus(userId, officeId, true);
};

staffRepository.deactivateStaff = async (
  userId,
  officeId,
  transferWorkItemsTo
) => {
  return await staffRepository.updateStaffStatus(
    userId,
    officeId,
    false,
    transferWorkItemsTo
  );
};

staffRepository.updateStaffStatus = async (
  userId,
  officeId,
  status,
  transferWorkItemsTo
) => {
  try {
    let response = await axios.patch(`${userMicroserviceBaseURL}/Staff`, {
      staffMemberId: userId,
      officeId,
      status,
      transferWorkItemsTo,
    });

    return response.data;
  } catch (e) {
    return { message: e.message };
  }
};

staffRepository.removeStaff = async (userId, officeId, transferWorkItemsTo) => {
  try {
    let response = await axios.delete(`${userMicroserviceBaseURL}/Staff`, {
      params: {
        staffMemberId: userId,
        officeId,
        transferWorkItemsTo,
      },
    });

    return response.data;
  } catch (e) {
    return { message: e.message };
  }
};

export default staffRepository;
