import React, { Fragment, useMemo } from "react";
import { useChannelListContext } from "@sendbird/uikit-react/ChannelList/context";
import { withTranslation } from "react-i18next";
import { handleError } from "utils";
import constants from "../../../../../constants";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoaderIcon } from "react-hot-toast";

const CustomChannelList = ({ t, ...props }) => {
  const {
    isSdkError,
    renderChannelPreview,
    onLeaveChannel,
    renderHeader,
    filteredOffices,
    currentUser,
    selectedOwner,
    externalTabActive,
  } = props;
  const { allChannels, channelListQuery, channelListDispatcher, loading } =
    useChannelListContext();

  const loadMoreChannels = async () => {
    if (channelListQuery?._hasNext) {
      try {
        channelListDispatcher?.({
          type: "FETCH_CHANNELS_START",
          payload: null,
        });
        const nextChannels = await channelListQuery?.next?.();
        channelListDispatcher?.({
          type: "FETCH_CHANNELS_SUCCESS",
          payload: nextChannels,
        });
      } catch (err) {
        handleError(err);
      }
    }
  };

  const filterChannelsForOffices = (eachChannel) => {
    if (externalTabActive) return true;
    const { data, members } = eachChannel;
    const memberUserIds = members.map((m) => m.userId);
    if (
      !filteredOffices ||
      !filteredOffices.length ||
      filteredOffices.includes(constants.chat.ALL_OFFICES)
    ) {
      return true;
    } else {
      if (!data) return true;
      let parsedData = null;
      let currentChannelOffices = [];
      try {
        parsedData = JSON.parse(data);
      } catch (err) {
        handleError(err);
        return true;
      }
      if (parsedData?.members) {
        currentChannelOffices = parsedData.members
          .filter(({ id }) => memberUserIds.includes(`${id}`))
          .map(({ officeId }) => officeId)
          .filter((val) => !!val);
        const idx = currentChannelOffices?.findIndex((ofId) =>
          filteredOffices.includes(ofId)
        );
        return idx > -1 ? true : false;
      }
    }
  };

  const filterChannelsForAccountOwners = (eachChannel) => {
    if (externalTabActive) return true;
    const { data } = eachChannel;
    let showChannel = true;
    if (!currentUser.isAccountOwner && currentUser.isStaff && data) {
      const channelOwner = JSON.parse(data).accountOwner;
      if (channelOwner?.id?.toString() !== selectedOwner?.id?.toString()) {
        showChannel = false;
      }
    }
    return showChannel;
  };

  const filteredChannels = useMemo(() => {
    return allChannels
      .filter(filterChannelsForOffices)
      .filter(filterChannelsForAccountOwners);
  }, [
    allChannels,
    filteredOffices,
    selectedOwner,
    externalTabActive,
    currentUser,
  ]);

  return (
    <Fragment>
      <div className="channel-list-header">{renderHeader()}</div>
      {!isSdkError && loading && (
        <div className="empty-channel-list">
          <LoaderIcon style={{ margin: "0px auto", padding: "10px" }} />
        </div>
      )}
      {(isSdkError || (!loading && filteredChannels?.length === 0)) && (
        <div className="empty-channel-list">
          <img
            src={require("assets/images/empty-chat-img.svg").default}
            alt="no-chat"
          />
          <h3> {t("messenger.noConversation")}</h3>
          <p> {t("messenger.noConversationDesc")}</p>
        </div>
      )}
      {!isSdkError && !loading && filteredChannels?.length > 0 && (
        <div className="channel-chat-list d-" id="channel-list">
          <InfiniteScroll
            dataLength={allChannels?.length}
            hasMore={channelListQuery?._hasNext}
            next={loadMoreChannels}
            scrollableTarget="channel-list"
            loader={
              <LoaderIcon style={{ margin: "10px auto", padding: "10px" }} />
            }
          >
            {
              filteredChannels
                ?.map((channel) =>
                  renderChannelPreview({
                    channel,
                    onLeaveChannel,
                    key: channel.url,
                  })
                )
                .concat(
                  channelListQuery?._hasNext && filteredChannels?.length < 7
                    ? [
                        <div
                          key="scroll-provider"
                          style={{
                            height: `${(7 - filteredChannels.length) * 88}px`,
                          }}
                        />,
                      ]
                    : []
                )
              // The concat only adds a div to provide a scroll if less than 7 results appear and query still has some pages left.
            }
          </InfiniteScroll>
        </div>
      )}
    </Fragment>
  );
};

export default withTranslation()(CustomChannelList);
