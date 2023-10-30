import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { handleError } from "utils";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoaderIcon } from "react-hot-toast";
import ProgressiveImage from "./ProgressiveImage";
import { uniqBy } from "lodash";

let MESSAGES_LIMIT = 50;
const QUERY_IN_PROGRESS = 800170;

const MediaDocsCard = ({
  t,
  handleMediaDocBackBtn,
  channel,
  setFileMessage,
  setFileViewer,
}) => {
  const [mediaListQueryParam, setMediaListQueryParam] = useState({
    customTypesFilter: ["image"],
    limit: MESSAGES_LIMIT,
    reverse: true,
  });
  const [getMediaQuery, setGetMediaQuery] = useState(null);
  const [mediaMessages, setMediaMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (channel) {
      const query = channel.createPreviousMessageListQuery(mediaListQueryParam);
      if (query) {
        (async () => {
          try {
            setLoading(true);
            let msgs = await query?.load();
            setMediaMessages(msgs);
            setHasMore(query.hasNext);
            setGetMediaQuery(query);
          } catch (error) {
            handleError(error);
          }
          setLoading(false);
        })();
      }
    }
  }, [mediaListQueryParam, channel]);

  const loadMoreMessages = async () => {
    try {
      if (getMediaQuery) {
        setLoading(true);
        const nextMessages = await getMediaQuery?.load();
        setMediaMessages((it) => uniqBy([...it, ...nextMessages], "messageId"));
        setHasMore(getMediaQuery.hasNext);
      }
    } catch (error) {
      if (error.code !== QUERY_IN_PROGRESS) {
        handleError(error);
      }
    }
    setLoading(false);
  };

  let content;
  if (activeTab == "1") {
    content = (
      <div className="media-gallery">
        {mediaMessages[0]?.customType == "image" &&
          mediaMessages?.map((eachMsg, index) => {
            const { thumbnails, name } = eachMsg;
            let thumbnailUrl;
            if (thumbnails && thumbnails.length) {
              thumbnailUrl = thumbnails[0].url;
            }
            return (
              <div
                className="img-box cursor-pointer"
                title={name}
                key={index}
                onClick={() => {
                  setFileMessage(eachMsg);
                  setFileViewer(true);
                }}
              >
                <ProgressiveImage
                  className="img-cover"
                  src={
                    thumbnailUrl ||
                    eachMsg.url ||
                    require("assets/images/dummy.jpg").default
                  }
                  alt="icon"
                />
              </div>
            );
          })}
      </div>
    );
  }
  if (activeTab == "2") {
    content = (
      <div className="doc-list">
        {mediaMessages[0]?.customType == "document" &&
          mediaMessages?.map((eachMsg, index) => {
            const { type } = eachMsg;
            let docIcon;
            if (type?.includes("pdf")) {
              docIcon = require("assets/images/document-icon-pdf.svg").default;
            } else if (
              type?.includes("wordprocessingml") ||
              type?.includes("msword")
            ) {
              docIcon = require("assets/images/document-icon-word.svg").default;
            } else if (
              type?.includes("spreadsheetml") ||
              type?.includes("ms-excel")
            ) {
              docIcon =
                require("assets/images/document-icon-excel.svg").default;
            } else {
              docIcon = require("assets/images/document-icon.svg").default;
            }
            return (
              <div
                key={index}
                className="doc-box cursor-pointer"
                title={eachMsg.name}
                onClick={() => {
                  window?.open(eachMsg?.url, "_blank");
                }}
              >
                <img src={docIcon} alt="icon" />
                <div className="doc-name">{eachMsg.name}</div>
              </div>
            );
          })}
      </div>
    );
  }

  if (!mediaMessages.length) {
    content = (
      <div>
        <p> {t("messenger.noDataFound")}</p>
      </div>
    );
  }

  const tabContent = (
    <InfiniteScroll
      dataLength={mediaMessages.length}
      next={loadMoreMessages}
      hasMore={hasMore}
      scrollableTarget="scrollable-div"
    >
      {!loading ? (
        content
      ) : (
        <center>
          <LoaderIcon />
        </center>
      )}
    </InfiniteScroll>
  );

  const handleTab = (e) => {
    const mediaType = [e.target.name];
    setMediaListQueryParam({
      ...mediaListQueryParam,
      customTypesFilter: mediaType,
    });
    if (e.target.name == "document") {
      setActiveTab("2");
    } else {
      setActiveTab("1");
    }
  };

  return (
    <div>
      <span onClick={handleMediaDocBackBtn} className="link-btn">
        <img
          className="mr-1"
          src={require("assets/images/arrow-back-icon.svg").default}
          alt="icon"
        />
        {t("back")}
      </span>
      <div className="common-tabs media-doc-tabs">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              name="image"
              onClick={handleTab}
            >
              {t("messenger.media")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              name="document"
              onClick={handleTab}
            >
              {t("messenger.docs")}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent
          activeTab={activeTab}
          className="tab-content-height"
          id="scrollable-div"
        >
          <TabPane tabId="1">{tabContent}</TabPane>
          <TabPane tabId="2">{tabContent}</TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default withTranslation()(MediaDocsCard);
