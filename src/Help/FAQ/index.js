import React, { useEffect, useState } from "react";
import { getpagecontent } from "../../actions";
import { connect, useSelector } from "react-redux";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Card from "components/Card";
import styles from "../Help.module.scss";
import constants from "../../constants";
import Loader from "components/Loader";
import { useHistory } from "react-router-dom";
import CommonSearch from "components/CommonSearch";
import Mark from "mark.js";

function Index(props) {
  const history = useHistory();
  let profile = useSelector((e) => e.userProfile.profile);
  const [markInstance, setMarkInstance] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchCount, setSearchCout] = useState(0);

  useEffect(() => {
    if (profile?.role?.systemRole) {
      let activeUserRole = constants.helpPages.Faq.find(
        (e) => e.role === profile.role.systemRole
      );
      props?.getpagecontent({ id: activeUserRole?.id });
    }

    if (document.getElementById("main-content")) {
      var instance = new Mark(document.querySelector("div.context"));
      setMarkInstance(instance);
    }
  }, [profile]);

  useEffect(() => {
    if (markInstance && searchText) {
      setSearchCout(0);
      markInstance.unmark();
      markInstance.mark(searchText, {
        element: "mark",
        className: "mark-cus-Class",
        separateWordSearch: false,
        done: (total) => {
          setSearchCout(total);
        },
      });
    }

    if (!searchText && markInstance) {
      markInstance.unmark();
      setSearchCout(0);
    }
  }, [searchText]);

  const page_list = props.dataContent || {};
  const goBack = () => history.push(constants.routes.help);

  return (
    <Page onBack={goBack} title={page_list?.pageName}>
      {props?.isLoading && <Loader />}
      <Card
        className={styles["event-detail-card"]}
        radius="10px"
        marginBottom="18px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      >
        <div id="main-content" className="context">
          <CommonSearch
            Placeholder={props?.t("findInPage")}
            HandleChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <p>
            {searchCount > 0
              ? `${searchCount} ${props?.t("resultFound")}`
              : null}
          </p>

          <div
            className="ck-text"
            dangerouslySetInnerHTML={{ __html: page_list?.content }}
          ></div>
          {props?.isError && <p> {props?.t("scheduler.noRequestFound")}</p>}
        </div>
      </Card>
    </Page>
  );
}

const mapStateToProps = ({
  userProfile: { profile },
  pageContent: { dataContent, isLoading, statusMessage, isLoadError },
  errors: { isError },
}) => ({
  dataContent,
  isLoading,
  isError,
  profile,
  statusMessage,
  isLoadError,
});

export default connect(mapStateToProps, { getpagecontent })(
  withTranslation()(Index)
);
