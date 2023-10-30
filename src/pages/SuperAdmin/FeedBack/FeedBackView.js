import React, { useState, useEffect, Fragment } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import styles from "./FeedBackView.module.scss";
import Card from "components/Card";
import Text from "components/Text";
import toast from "react-hot-toast";
import Loader from "components/Loader";
import { getDetailFeedBackAndSuggestions } from "repositories/utility-repository";
import moment from "moment";
import constants from "../../../constants";
import { decodeId } from "utils";

function FeedBackView({ t, history, match }) {
  const paramsId = decodeId(match.params.feedbackId);
  const [showLoader, setshowLoader] = useState(false);
  const [details, setDetails] = useState({});

  useEffect(() => {
    getDetails(paramsId);
  }, [paramsId]);

  const getDetails = async (id) => {
    try {
      setshowLoader(true);
      let res = await getDetailFeedBackAndSuggestions(id);
      setDetails(res?.data);
      setshowLoader(false);
    } catch (error) {
      toast.error(error.message);
      setshowLoader(false);
    }
  };

  const goBack = () => {
    history.push(constants.routes.superAdmin.feedback);
  };

  return (
    <Fragment>
      {showLoader && <Loader />}
      <Page onBack={goBack}>
        <div className="container-smd container p-0">
          <div className={styles["feedback-detail"]}>
            <h2 className="page-title mt-2 mb-4">{t("details")} </h2>
            <Card radius="10px" className={styles["feedback-card"]}>
              <div className={styles["btn-link"]}></div>
              <div className={styles["inner-wrapper"]}>
                <div className={styles["c-field"]}>
                  <Text size="13px" color="#79869a">
                    {t("superAdmin.DateAndTime")}
                  </Text>

                  <Text size="14px" weight="600" color="#102c42">
                    {moment(details?.createdAt).format(
                      "MMM DD, YYYY - hh:mm A"
                    )}
                  </Text>
                </div>
                <div className={styles["c-field"]}>
                  <Text size="13px" color="#79869a">
                    {t("Category")}
                  </Text>

                  <Text size="14px" weight="600" color="#102c42">
                    {details?.userFeedbackAndSuggestionCategory?.category}
                  </Text>
                </div>
                {/* NameOfTheUser */}
                <div className={styles["c-field"]}>
                  <Text size="13px" color="#79869a">
                    {t("superAdmin.NameOfTheUser")}
                  </Text>
                  <Text size="14px" weight="600" color="#102c42">
                    {`${details?.createdBy?.firstName} ${details?.createdBy?.lastName}`}
                  </Text>
                </div>

                <div className={styles["c-field"]}>
                  <Text size="13px" color="#79869a">
                    {t("emailAddress")}
                  </Text>
                  <Text size="14px" weight="600" color="#102c42">
                    {details?.createdBy?.emailId}
                  </Text>
                </div>
                <div className={styles["c-field"]}>
                  <Text size="13px" color="#79869a">
                    {t("superAdmin.descriptionBroadcast")}
                  </Text>
                  <Text size="14px" weight="600" color="#102c42">
                    {details?.description}
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Page>
    </Fragment>
  );
}
export default withTranslation()(FeedBackView);
