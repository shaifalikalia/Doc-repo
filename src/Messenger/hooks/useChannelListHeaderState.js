import { useCallback, useState, useEffect, useMemo } from "react";
import {
  handleError,
  parseNumber,
  sortAlphabetically,
  validateEmail,
  validateNumber,
} from "utils";
import produce from "immer";
import {
  createSendbirdUser,
  getExternalMembers,
  useGetStaffMembers,
} from "repositories/chat-repository";
import { getFullName, inBytes } from "Messenger/pages/TeamConversation/utils";
import { useOffices } from "repositories/office-repository";
import { debounce, uniqWith, isEqual, uniqBy } from "lodash";
import constants from "../../constants";

const OFFICE_PAGE_SIZE = 30;
const STAFF_PAGE_SIZE = 30;

const allowedTypes = constants.chat.allowedTypesForGroupImage;

const useChannelListHeaderState = (dependencies) => {
  const {
    setChannelListQuery,
    setCurrentChannel,
    filteredOffices,
    setFilteredOffices,
    selectedOwner,
    sdk,
    currentUser,
    externalTabActive,
    t,
    updateChannelList,
  } = dependencies;
  const defaultOffice = { value: 0, label: "All Offices" };

  /*-------------------------------------------------------------------*/
  //State Internal chat creation
  const [isNewGroupPopupOpen, setIsNewGroupPopupOpen] = useState(false);
  const [isCreateGroupPopupOpen, setIsCreateGroupPopupOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(defaultOffice);
  const [searchText, setSearchText] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [groupImageUrl, setGroupImageUrl] = useState("");
  const [groupName, setGroupName] = useState("");

  /*-------------------------------------------------------------------*/
  //State for external chat creation
  const [isNewConversationPopupOpen, setIsNewConversationPopupOpen] =
    useState(false);
  const [conversationTitle, setConversationTitle] = useState("");
  const [findByEmail, setFindByEmail] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchedExternalMembers, setSearchedExternalMembers] = useState([]);
  const [loadingExternalMembers, setLoadingExternalMembers] = useState(false);
  const [showShareApp, setShowShareApp] = useState(false);

  /*-------------------------------------------------------------------*/
  //Commont state
  const [dropdownOfficeOpen, setDropdownOfficeOpen] = useState(false);
  const [dropdownChatOpen, setDropdownChatOpen] = useState(false);
  const [errors, setErrors] = useState({
    groupImage: "",
    groupName: "",
    externalGroupTitle: "",
    externalChatEmail: "",
  });
  const [actionInProgress, setActionInProgress] = useState(false);

  //For officeList
  const [officeList, setOfficeList] = useState([]);
  const [currentOfficePage, setCurrentOfficePage] = useState(1);
  const [totalOfficePages, setTotalOfficePages] = useState(1);

  //For stafflist
  const [staffList, setStaffList] = useState([]);
  const [currentStaffPage, setCurrentStaffPage] = useState(1);
  const [totalStaffPages, setTotalStaffPages] = useState(1);

  /*-------------------------------------------------------------------*/
  //** Common Methods */
  const toggleOffice = () => setDropdownOfficeOpen((prevState) => !prevState);
  const toggleChat = () => setDropdownChatOpen((prevState) => !prevState);
  const showArchivedChats = () => {
    setChannelListQuery(
      produce((draft) => {
        draft.channelListQuery.hiddenChannelFilter = constants.chat.archived;
      })
    );
  };
  const showUnarchivedChats = () => {
    setChannelListQuery(
      produce((draft) => {
        draft.channelListQuery.hiddenChannelFilter = constants.chat.unArchived;
      })
    );
  };

  const loadMoreStaff = () => {
    if (currentStaffPage < totalStaffPages) {
      setCurrentStaffPage((prev) => prev + 1);
    }
  };

  const loadMoreOffices = () => {
    if (currentOfficePage < totalOfficePages) {
      setCurrentOfficePage((prev) => prev + 1);
    }
  };
  /*-------------------------------------------------------------------*/
  useEffect(() => {
    //Reset the staff and office data lists if selected owner has changed.
    setStaffList([]);
    setCurrentStaffPage(1);
    setTotalStaffPages(1);

    setOfficeList([]);
    setCurrentOfficePage(1);
    setTotalOfficePages(1);
  }, [selectedOwner]);

  //** Data from APIs */
  const enabled = !!(selectedOwner && selectedOwner.id);
  /* Get Active Offices */
  const { data: activeOffices } = useOffices(
    selectedOwner?.id,
    currentOfficePage,
    OFFICE_PAGE_SIZE,
    true,
    { enabled }
  );

  useEffect(() => {
    if (activeOffices) {
      setOfficeList((prev) => uniqBy([...prev, ...activeOffices.items], "id"));
      setTotalOfficePages(activeOffices?.pagination?.totalPages);
    }
  }, [activeOffices]);

  const offices = useMemo(() => {
    return sortAlphabetically(
      officeList.map((off) => ({ value: off.id, label: off.name })),
      "label"
    );
  }, [officeList]);

  /* Get Staff members */
  const { isLoading: isLoadingStaffList, data: staffData } = useGetStaffMembers(
    selectedOwner?.id,
    selectedOffice.value === 0 ? [] : [selectedOffice.value],
    searchText,
    currentStaffPage,
    STAFF_PAGE_SIZE,
    { enabled }
  );

  useEffect(() => {
    if (staffData) {
      setStaffList((prev) => uniqWith([...prev, ...staffData.data], isEqual));
      setTotalStaffPages(staffData?.pagination?.totalPages);
    }
  }, [staffData]);

  const staffMembers = useMemo(() => {
    return (staffList || []).map((item) => {
      const { userId, profilePic, emailId, contactNumber, isAccountOwner } =
        item;
      const { officeId, officeName, officeContactNumber } = item;
      return {
        id: userId,
        dbProfilePic: profilePic,
        profilePic:
          profilePic ||
          require("assets/images/staff-default-rounded.png").default,
        name: getFullName(item),
        emailId,
        officeName,
        officeId,
        isAccountOwner,
        contactNumber: contactNumber || officeContactNumber,
      };
    });
  }, [staffList]);

  /* -------------------------------------------------------------------------------------------------------------- */
  //Internal Chat creation - for step 1
  const isThisUserSelected = (user) => {
    const index = selectedStaff.findIndex(
      (u) => u.id === user.id && u.officeId === user.officeId
    );
    return index > -1 ? true : false;
  };

  const handleSelectStaff = (e, staff) => {
    const checked = e.target.checked;
    if (checked) {
      if (!selectedStaff?.length) {
        setSelectedStaff((prev) => [...prev, staff]);
      } else {
        if (currentUser.canCreateGroups) {
          setSelectedStaff((prev) => [...prev, staff]);
        } else {
          handleError(new Error(t("messenger.createGroupError")));
        }
      }
    } else {
      setSelectedStaff((prev) =>
        prev.filter(
          (s) => !(s.id === staff.id && s.officeId === staff.officeId)
        )
      );
    }
  };

  const disableOtherUsers = ({ id, officeId }) => {
    const idx = selectedStaff.findIndex((u) => u.id === id);
    if (idx > -1) {
      const thatUser = selectedStaff[idx];
      if (thatUser.officeId !== officeId) return true;
    }
    return false;
  };

  const handleSelectOffice = (office) => {
    setSelectedStaff([]);
    setSelectedOffice(office);
  };

  const handleSearchText = useCallback(
    debounce((e) => {
      const value = e.target.value;
      setSearchText(value);
    }, 2000),
    []
  );

  const closeStepOneModal = () => {
    setSelectedStaff([]);
    setSearchText("");
    setSelectedOffice(defaultOffice);
    setIsNewGroupPopupOpen(false);
  };

  const handleStepOne = async () => {
    if (!selectedStaff.length) return;
    if (selectedStaff.length > 1) {
      setIsNewGroupPopupOpen(false);
      setIsCreateGroupPopupOpen(true);
    } else {
      setActionInProgress(true);
      await handleOne2OneChatCreation();
      setActionInProgress(false);
    }
  };

  async function handleOne2OneChatCreation() {
    if (sdk) {
      try {
        const selectedUser = selectedStaff?.[0];
        const {
          id: SU_id,
          emailId: SU_emailId,
          name,
          isAccountOwner: SU_isAccountOwner,
          officeId,
          officeName,
          contactNumber: SU_contactNumber,
          dbProfilePic,
        } = selectedUser;
        //Check if selected user has active acc in sendbird chat
        const userListQueryParam = {
          limit: 1,
          userIdsFilter: [SU_id?.toString()],
        };
        const userListQuery =
          sdk.createApplicationUserListQuery(userListQueryParam);
        const sendbirdUser = await userListQuery.next();
        if (!sendbirdUser.length) {
          const userData = {
            user_id: SU_id?.toString(),
            nickname: name,
            profile_url: dbProfilePic || "",
          };
          await createSendbirdUser(userData);
        } else {
          //Check if there is already any chat initiated with this selected user
          const channelListQuery =
            sdk.groupChannel.createMyGroupChannelListQuery({
              limit: 100,
              includeEmpty: true,
              includeFrozen: false,
              customTypesFilter: [
                !externalTabActive
                  ? constants.chat.internal
                  : constants.chat.external,
              ],
              hiddenChannelFilter: constants.chat.unArchived,
              userIdsFilter: {
                userIds: [SU_id?.toString()],
                includeMode: false,
                queryType: "AND",
              },
            });
          const channelList = await channelListQuery.next();
          if (channelList.length) {
            const foundChannel = channelList.find((chnl) => {
              let { data: chnlData } = chnl;
              if (chnlData) {
                chnlData = JSON.parse(chnlData);
                if (chnlData?.members?.length) {
                  const idx = chnlData.members.findIndex((mem) => {
                    return mem.id == SU_id && mem.officeId == officeId;
                  });
                  if (idx > -1) {
                    return true;
                  }
                }
              }
              return false;
            });
            if (foundChannel) {
              setCurrentChannel(foundChannel);
              closeStepOneModal();
              return;
            }
          }
        }
        const {
          id: CU_id,
          emailId: CU_emailId,
          isAccountOwner: CU_isAccountOwner,
          isStaff: CU_isStaff,
          contactNumber: CU_contactNumber,
        } = currentUser;
        const groupChannelParams = {};
        groupChannelParams.invitedUserIds = [SU_id.toString()];
        groupChannelParams.name = `${name} and ${getFullName(currentUser)}`;
        groupChannelParams.operatorUserIds = [
          CU_id?.toString(),
          SU_id?.toString(),
        ];
        groupChannelParams.customType = !externalTabActive
          ? constants.chat.internal
          : constants.chat.external;
        const data = {};
        data.members = [
          {
            id: SU_id,
            emailId: SU_emailId,
            officeId,
            officeName,
            name,
            isAccountOwner: SU_isAccountOwner,
            contactNumber: SU_contactNumber,
          },
          {
            id: CU_id,
            emailId: CU_emailId,
            officeId,
            officeName,
            name: getFullName(currentUser),
            isAccountOwner: CU_isAccountOwner,
            contactNumber: CU_contactNumber,
          },
        ];
        if (!CU_isAccountOwner && CU_isStaff) {
          data.accountOwner = {
            id: selectedOwner.id,
            name: getFullName(selectedOwner),
            emailId: selectedOwner.emailId,
          };
        } else if (CU_isAccountOwner && !CU_isStaff) {
          data.accountOwner = {
            id: CU_id,
            name: getFullName(currentUser),
            emailId: CU_emailId,
          };
        }
        groupChannelParams.data = JSON.stringify(data);
        const channel = await sdk.groupChannel.createChannel(
          groupChannelParams
        );
        setCurrentChannel(channel);
        updateChannelList();
        closeStepOneModal();
      } catch (error) {
        if (error?.response?.data?.message) {
          handleError(new Error(error.response.data.message));
          return;
        }
        handleError(error);
      }
    }
  }

  /*-------------------------------------------------------------------*/
  // INternal Chat Creation for step 2 that is for group creation

  async function handleGroupChatCreation() {
    if (sdk) {
      try {
        const userListQueryParam = {
          limit: selectedStaff?.length,
          userIdsFilter: selectedStaff?.map((e) => e.id.toString()),
        };
        const userListQuery =
          sdk.createApplicationUserListQuery(userListQueryParam);
        const sendbirdUsers = await userListQuery.next();
        if (sendbirdUsers.length !== selectedStaff.length) {
          const notSendbirdUsers = selectedStaff.filter((e) => {
            let userStatus = true;
            for (let eachUser of sendbirdUsers) {
              if (e.id == eachUser.userId) {
                userStatus = false;
              }
            }
            return userStatus;
          });
          const createUserPromises = [];
          notSendbirdUsers.forEach((user) => {
            const { id, name, dbProfilePic } = user;
            const userData = {
              user_id: id?.toString(),
              nickname: name,
              profile_url: dbProfilePic || "",
            };
            createUserPromises.push(createSendbirdUser(userData));
          });
          await Promise.all(createUserPromises);
        }
        const {
          id: CU_id,
          emailId: CU_emailId,
          isAccountOwner: CU_isAccountOwner,
          isStaff: CU_isStaff,
        } = currentUser;
        const groupChannelParams = {};
        groupChannelParams.invitedUserIds = selectedStaff?.map((e) =>
          e.id.toString()
        );
        groupChannelParams.name = `${groupName.trim()}`;
        groupChannelParams.coverImage = groupImage ? groupImage : "";
        if (!groupImage) {
          groupChannelParams.coverUrl = "";
        }
        groupChannelParams.operatorUserIds = [CU_id?.toString()];
        groupChannelParams.customType = !externalTabActive
          ? constants.chat.internal
          : constants.chat.external;
        const data = {};
        data.members = [
          ...selectedStaff?.map((e) => {
            return {
              id: e.id,
              emailId: e.emailId,
              officeId: e.officeId,
              officeName: e.officeName,
              name: e.name,
              isAccountOwner: e.isAccountOwner,
            };
          }),
          {
            id: CU_id,
            emailId: CU_emailId,
            name: getFullName(currentUser),
            isAccountOwner: CU_isAccountOwner,
          },
        ];
        if (!CU_isAccountOwner && CU_isStaff) {
          data.accountOwner = {
            id: selectedOwner.id,
            name: getFullName(selectedOwner),
            emailId: selectedOwner.emailId,
          };
        } else if (CU_isAccountOwner && !CU_isStaff) {
          data.accountOwner = {
            id: CU_id,
            name: getFullName(currentUser),
            emailId: CU_emailId,
          };
        }
        groupChannelParams.data = JSON.stringify(data);
        const channel = await sdk.groupChannel.createChannel(
          groupChannelParams
        );
        setCurrentChannel(channel);
        updateChannelList();
        closeStepTwoModal();
      } catch (error) {
        if (error?.response?.data?.message) {
          handleError(new Error(error.response.data.message));
          return;
        }
        handleError(error);
      }
    }
  }

  const handleGroupImageChange = (e) => {
    const file = e.target.files?.[0];
    if (allowedTypes.includes(file?.type)) {
      if (file?.size < inBytes(constants.chat.chatGroupImageSizeInMbs)) {
        setGroupImage(file);
        if (file) {
          const url = URL.createObjectURL(file);
          setGroupImageUrl(url);
        }
      } else {
        setErrors({
          groupImage: t("messenger.groupImageSizeError", {
            size: constants.chat.chatGroupImageSizeInMbs,
          }),
        });
      }
    } else {
      setErrors({
        groupImage: t("messenger.groupImageTypeError"),
      });
    }
  };

  const closeStepTwoModal = () => {
    setSelectedStaff([]);
    setSearchText("");
    setSelectedOffice(defaultOffice);
    setGroupImage(null);
    setGroupImageUrl("");
    setGroupName("");
    setErrors({});
    setIsCreateGroupPopupOpen(false);
  };

  const handleGroupName = (e) => {
    const value = e.target.value;
    setGroupName(value);
    setErrors({});
  };

  const handleStepTwo = async () => {
    setErrors({});
    if (groupName && groupName.trim().length > 0) {
      setActionInProgress(true);
      await handleGroupChatCreation();
      setActionInProgress(false);
    } else {
      setErrors({
        groupName: t("messenger.groupNameExistanceError"),
      });
    }
  };

  const handleFilterOffices = (e, id) => {
    const checked = e.target.checked;
    if (checked) {
      if (id == 0) {
        setFilteredOffices([id]);
        return;
      }

      setFilteredOffices((prev) => [...prev, id].filter((thisId) => !!thisId));
    } else {
      setFilteredOffices((prev) => prev.filter((officeId) => officeId != id));
    }
  };
  /*-------------------------------------------------------------------*/
  //External chat creation for step 1 - the only step

  const handleConversationTitle = (e) => {
    setErrors({});
    const value = e.target.value;
    setConversationTitle(value);
  };

  const handleFindByEmail = (val) => {
    if (findByEmail !== val) {
      setShowShareApp(false);
      setErrors({});
    }
    setFindByEmail(val);
  };

  const handleSearchEmail = (e) => {
    setErrors({});
    const value = e.target.value;
    setSearchEmail(value);
    setShowShareApp(false);
  };

  const handleSearchPhone = (e) => {
    setErrors({});
    const value = parseNumber(e.target.value);
    setSearchPhone(value);
    setShowShareApp(false);
  };

  const closeExternalChatCreationModal = () => {
    setConversationTitle("");
    setFindByEmail(true);
    setSearchEmail("");
    setSearchPhone("");
    setIsNewConversationPopupOpen(false);
    setSearchedExternalMembers([]);
    setErrors({});
    setShowShareApp(false);
  };

  const handleExternalChatCreation = async (member) => {
    if (!conversationTitle.trim().length) {
      setErrors({ externalGroupTitle: t("messenger.titleLengthError") });
      return;
    }
    if (sdk) {
      try {
        setActionInProgress(true);
        const {
          id: SU_id,
          emailId: SU_emailId,
          name,
          officeId,
          officeName,
          contactNumber: SU_contactNumber,
          profilePic,
        } = member;
        //////////////////////////////////////////////////////////////////////////////////
        //Check if selected user has an account in sendbird; If not then create the user
        const userListQueryParam = {
          limit: 1,
          userIdsFilter: [SU_id?.toString()],
        };
        const userListQuery =
          sdk.createApplicationUserListQuery(userListQueryParam);
        const sendbirdUser = await userListQuery.next();
        if (!sendbirdUser.length) {
          const userData = {
            user_id: SU_id?.toString(),
            nickname: name,
            profile_url: profilePic || "",
          };
          await createSendbirdUser(userData);
        } else {
          //Check if there is already any chat initiated with this selected user
          const channelListQuery =
            sdk.groupChannel.createMyGroupChannelListQuery({
              limit: 100,
              includeEmpty: true,
              includeFrozen: false,
              searchFilter: {
                query: conversationTitle.trim(),
                fields: ["channel_name"],
              },
              customTypesFilter: [
                !externalTabActive
                  ? constants.chat.internal
                  : constants.chat.external,
              ],
              hiddenChannelFilter: constants.chat.unArchived,
              userIdsFilter: {
                userIds: [SU_id?.toString()],
                includeMode: false,
                queryType: "AND",
              },
            });
          const channelList = await channelListQuery.next();
          if (channelList.length) {
            const filteredChannels = channelList.filter((chnl) => {
              return (
                chnl?.name?.trim()?.toLowerCase() ==
                conversationTitle?.trim()?.toLowerCase()
              );
            });
            if (filteredChannels.length) {
              const foundChannel = filteredChannels.find((chnl) => {
                let { data: chnlData } = chnl;
                if (chnlData) {
                  chnlData = JSON.parse(chnlData);
                  if (chnlData?.members?.length) {
                    const idx = chnlData.members.findIndex((mem) => {
                      return mem.id == SU_id && mem.officeId == officeId;
                    });
                    if (idx > -1) {
                      return true;
                    }
                  }
                }
                return false;
              });

              if (foundChannel) {
                setCurrentChannel(foundChannel);
                setActionInProgress(false);
                closeExternalChatCreationModal();
                return;
              }
            }
          }
        }
        ///////////////////////////////////////////////////////////////////////////////////
        const {
          id: CU_id,
          emailId: CU_emailId,
          contactNumber: CU_contactNumber,
        } = currentUser;
        const groupChannelParams = {};
        groupChannelParams.invitedUserIds = [SU_id.toString()];
        groupChannelParams.name = conversationTitle.trim();
        groupChannelParams.operatorUserIds = [
          CU_id?.toString(),
          SU_id?.toString(),
        ];
        groupChannelParams.customType = !externalTabActive
          ? constants.chat.internal
          : constants.chat.external;
        const data = {};
        data.members = [
          {
            id: SU_id,
            emailId: SU_emailId,
            officeId,
            officeName,
            name,
            contactNumber: SU_contactNumber,
          },
          {
            id: CU_id,
            emailId: CU_emailId,
            officeId: null,
            officeName: null,
            name: getFullName(currentUser),
            contactNumber: CU_contactNumber,
          },
        ];
        groupChannelParams.data = JSON.stringify(data);
        const channel = await sdk.groupChannel.createChannel(
          groupChannelParams
        );
        setCurrentChannel(channel);
        updateChannelList();
        closeExternalChatCreationModal();
      } catch (err) {
        if (err?.response?.data?.message) {
          handleError(new Error(err.response.data.message));
        } else {
          handleError(err);
        }
      }
      setActionInProgress(false);
    }
  };

  const handleSearchExternalMembers = async () => {
    setShowShareApp(false);
    setSearchedExternalMembers([]);
    setErrors({ externalChatEmail: "" });
    if (
      findByEmail ? validateEmail(searchEmail) : validateNumber(searchPhone)
    ) {
      try {
        setLoadingExternalMembers(true);
        const searchedText = findByEmail ? searchEmail : searchPhone;
        const searchedMembers = await getExternalMembers(
          searchedText,
          selectedOwner?.id
        );
        if (searchedMembers?.length) {
          setSearchedExternalMembers(
            searchedMembers.map((mem) => {
              const {
                name: officeName,
                id: officeId,
                contactNumber: officeContactNumber,
              } = mem.office;
              const { emailId, profilePic, contactNumber, id } = mem.user;
              return {
                id,
                officeName,
                officeId,
                name: getFullName(mem.user),
                emailId,
                profilePic,
                contactNumber: contactNumber || officeContactNumber,
              };
            })
          );
        } else {
          setErrors({
            externalChatEmail: findByEmail
              ? t("messenger.emailNotExist")
              : t("messenger.phoneNotExist"),
          });
          setShowShareApp(true);
        }
      } catch (error) {
        handleError(error);
      }
      setLoadingExternalMembers(false);
    } else {
      setErrors({
        externalChatEmail: findByEmail
          ? t("messenger.emailValidationError")
          : t("messenger.phoneValidationError"),
      });
    }
  };

  const isOfficeFilterApplied =
    !externalTabActive && filteredOffices.filter((id) => !!id).length > 0;

  return {
    state: {
      dropdownOfficeOpen,
      dropdownChatOpen,
      isNewGroupPopupOpen,
      isCreateGroupPopupOpen,
      isNewConversationPopupOpen,
      staffMembers,
      selectedStaff,
      offices: [defaultOffice, ...offices],
      searchText,
      groupImageUrl,
      groupName,
      conversationTitle,
      findByEmail,
      searchEmail,
      searchPhone,
      isLoadingStaffList,
      errors,
      searchedExternalMembers,
      loadingExternalMembers,
      showShareApp,
      actionInProgress,
      hasMoreStaff: currentStaffPage < totalStaffPages,
      hasMoreOffices: currentOfficePage < totalOfficePages,
      isOfficeFilterApplied,
    },
    updateMethods: {
      setSelectedStaff,
      setDropdownOfficeOpen,
      setDropdownChatOpen,
      setIsNewGroupPopupOpen,
      setIsCreateGroupPopupOpen,
      setIsNewConversationPopupOpen,
      setFindByEmail,
    },
    otherMethods: {
      toggleOffice,
      toggleChat,
      handleStepOne,
      isThisUserSelected,
      handleSelectStaff,
      handleSelectOffice,
      handleSearchText,
      closeStepOneModal,
      handleGroupImageChange,
      closeStepTwoModal,
      handleGroupName,
      handleStepTwo,
      handleConversationTitle,
      closeExternalChatCreationModal,
      handleSearchEmail,
      handleSearchPhone,
      handleExternalChatCreation,
      showArchivedChats,
      showUnarchivedChats,
      disableOtherUsers,
      handleFilterOffices,
      handleSearchExternalMembers,
      handleFindByEmail,
      loadMoreStaff,
      loadMoreOffices,
    },
  };
};

export default useChannelListHeaderState;
