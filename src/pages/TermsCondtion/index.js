import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getConent } from "actions";
import constants from "../../constants";

/*components*/
import _isLoading from "hoc/isLoading";
import { withTranslation } from "react-i18next";

const Terms = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    props.getConent({ id: constants.cmsPageKey.TermsAndConditions });
    // eslint-disable-next-line
  }, []);
  const { t } = props;

  return (
    <div className="static-page-content">
      <div className="container">
        <h2 className="title">{t("termsAndConditions")}</h2>
        {props.pageContent && (
          <div
            className="content-container"
            dangerouslySetInnerHTML={{ __html: props.pageContent.content }}
          ></div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({
  userProfile: { profile },
  pageContent: { isLoading, pageContent },
  errors: { isError },
}) => ({
  isLoading,
  isError,
  profile,
  pageContent,
});

export default connect(mapStateToProps, { getConent })(
  _isLoading(withTranslation()(Terms))
);
