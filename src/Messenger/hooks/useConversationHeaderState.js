import { sliceText } from "utils";

const useConversationHeaderState = (dependencies) => {
  const { t, channel, currentUser, externalTabActive } = dependencies;

  const getChannelData = () => {
    const { name: groupName, coverUrl, memberCount, members, data } = channel;
    let channelName = groupName;
    let officeName = "";
    let profilePic =
      coverUrl || require("assets/images/staff-default-rounded.png").default;
    let subTitle = externalTabActive
      ? t("messenger.externalChat")
      : t("messenger.internalChat");
    if (data && memberCount === 2) {
      const customMembers = JSON.parse(data)?.members || [];
      const otherCustomUser = customMembers?.filter(
        (mem) => mem.id.toString() !== currentUser.id.toString()
      )?.[0];
      const otherSendbirdMember = members?.filter(
        (mem) => mem.userId !== currentUser.id.toString()
      )?.[0];
      officeName = otherCustomUser?.officeName;
      channelName = externalTabActive
        ? channelName
        : otherSendbirdMember?.nickname;
      profilePic =
        otherSendbirdMember?.plainProfileUrl ||
        require("assets/images/staff-default-rounded.png").default;
      subTitle = !externalTabActive ? officeName : subTitle;
    }
    return {
      officeName,
      channelName: sliceText(channelName, 40),
      channelImage: profilePic,
      subTitle,
    };
  };

  return {
    state: {},
    updateMethods: {},
    otherMethods: {
      getChannelData,
    },
  };
};

export default useConversationHeaderState;
