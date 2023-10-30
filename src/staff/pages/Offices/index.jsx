import Page from "components/Page";
import React, { useEffect, useState } from "react";
import styles from "./Offices.module.scss";
import InfiniteScroll from "react-infinite-scroll-component";
import { useOffices } from "repositories/office-repository";
import OfficeCard from "./OfficeCard";
import { withTranslation } from "react-i18next";
import Alert from "components/Toast";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import EmptyOfficeDownloadApp from "./components/EmptyOfficeDownloadApp";
import OfficeDownloadApp from "./components/OfficeDownloadApp";
import editProfileWarningIcon from "../../../assets/images/info-icon.png";
import { Link } from "react-router-dom";
import constants from "../../../constants";
import crossIconGrey from "../../../assets/images/mir_cross_grey.png";
import { removeStorage } from "utils";

const PAGE_SIZE = 12;
const animationVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

function Offices({ t, location }) {
  const profile = useSelector((state) => state.userProfile.profile);
  const [pageNumber, setPageNumber] = useState(1);
  const [offices, setOffices] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  let cachedOnlineToastView = sessionStorage.getItem(
    constants.lsKeys.staffOnlineToast
  )
    ? false
    : true;
  const [onlineToastView, setOnlineToastView] = useState(cachedOnlineToastView);
  const { error, data } = useOffices(profile.id, pageNumber, PAGE_SIZE);
  removeStorage([constants.sessionStoragecache.officeKey]);

  useEffect(() => {
    if (data && data.items) {
      setOffices((v) =>
        pageNumber === 1 ? [...data.items] : [...v, ...data.items]
      );
    }

    if (data && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [data]);

  useEffect(() => {
    if (error && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [error]);

  const items = offices
    .sort((a, b) => Number(a?.isReferenceOffice) - Number(b?.isReferenceOffice))
    .map((it) => {
      return (
        <OfficeCard
          key={it.id}
          officeData={it}
          isTempOffice={it.isReferenceOffice}
          officeId={it.id}
          name={it.name}
          address={it.address}
          isAdmin={it.isAdmin}
          designation={it.designation}
          numberOfPendingRequestsApprovals={it.numberOfPendingRequestsApprovals}
          image={it.officeImage}
          jobType={it.staffRoleId}
          isVirtualOffice={it.isReferenceOffice}
          isUserRemovedFromOffice={it.isUserRemovedFromOffice}
          hasOwnerPackageExpired={it.hasOwnerPackageExpired}
          isActive={it.isActive}
          ownerId={it.ownerId}
          isUserActiveOfficeStaff={it.isUserActiveOfficeStaff}
          handleDelete={(deletedId) =>
            setOffices((prev) =>
              prev.filter((office) => office.id !== deletedId)
            )
          }
          location={location}
        />
      );
    });

  let totalItems = -1;
  if (!isInitialLoad && data) {
    totalItems = data.pagination.totalItems;
  }

  let content = null;
  if (isInitialLoad) {
    content = (
      <div className="w-100 d-flex align-items-center justify-content-center h-50vh">
        <div className="loader"></div>
      </div>
    );
  } else if (!isInitialLoad && !error && offices?.length === 0) {
    content = <EmptyOfficeDownloadApp />;
  } else {
    content = (
      <motion.div variants={animationVariants} initial="hidden" animate="show">
        {error && <Alert errorToast message={error.message} />}
        <InfiniteScroll
          className="row"
          dataLength={offices?.length}
          hasMore={offices?.length < totalItems}
          next={() => setPageNumber((v) => v + 1)}
        >
          {items}
        </InfiniteScroll>
      </motion.div>
    );
  }

  const closeToastView = () => {
    sessionStorage.setItem(
      constants.lsKeys.staffOnlineToast,
      constants.lsKeys.staffOnlineToast
    );
    setOnlineToastView(false);
  };

  return (
    <>
      {onlineToastView && (
        <div className="edit-profile-warning-container  office-listing-block container">
          <div className="edit-profile-warning-bg">
            <img
              className="edit-profile-warning-icon"
              src={editProfileWarningIcon}
              alt="warning icon"
            />
            <div className="edit-profile-warning-text">
              {t("accountOwner.NeedHelpStaffMsg")}&nbsp;
              <strong>
                <Link
                  to={constants.routes.onlineHelp}
                  className="edit-profile-warning-text"
                >
                  {t("accountOwner.OnlineHelpTitle")}
                </Link>
              </strong>
              <span onClick={closeToastView} className="pointer">
                <img
                  src={crossIconGrey}
                  className="close-icon"
                  alt="cross icon"
                />
              </span>
            </div>
          </div>
        </div>
      )}

      <Page titleKey="myOffices" className={"cus_page"}>
        <div className={styles["staff-office-listing"]}>{content}</div>
      </Page>

      {!isInitialLoad && offices?.length > 0 && <OfficeDownloadApp />}
    </>
  );
}

export default withTranslation()(Offices);
