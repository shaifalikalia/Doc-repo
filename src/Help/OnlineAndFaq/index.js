import React, { useEffect, useState } from "react";
import { getpagecontent } from "../../actions";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Card from "components/Card";
import styles from "../Help.module.scss";
import Loader from "components/Loader";
import CommonSearch from "components/CommonSearch";
import Mark from "mark.js";

function Index(props) {
  const [markInstance, setMarkInstance] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchCount, setSearchCout] = useState(0);

  useEffect(() => {
    if (props.data) props?.getpagecontent({ id: props?.data });

    if (document.getElementById("main-content")) {
      const instance = new Mark(document.querySelector("div.context"));
      setMarkInstance(instance);
    }
  }, []);
  const page_list = props?.dataContent || {};

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

  return (
    <Page title={page_list?.pageName}>
      {props?.isLoading && <Loader />}

      <Card
        className={styles["event-detail-card"]}
        radius="10px"
        marginBottom="18px"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      >
        <div id="main-content" className="context">
          <CommonSearch
            Placeholder={props?.t("Search")}
            HandleChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />

          <p>
            {searchCount > 0
              ? `${searchCount} ${props?.t("resultFound")}`
              : null}
          </p>
          <div className="ck-text">
            <div dangerouslySetInnerHTML={{ __html: page_list?.content }}></div>
          </div>
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
