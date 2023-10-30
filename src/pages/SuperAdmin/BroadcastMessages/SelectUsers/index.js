import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import styles from "./index.module.scss";
import Card from "components/Card";
import searchIcon from "./../../../../assets/images/search-icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { useAllOfficeOwners } from "repositories/broadcast-repository";
import Empty from "components/Empty";
import Toast from "components/Toast/Alert";
import Loader from "components/Loader";
function BroadcastMessagesUserListing({
  selectedManagers,
  setSelectedManagers,
  setShowUser,
  selectedStaff,
  setSelectedStaff,
  selectAllManagers,
  selectAllStaff,
  setSelectAllManagers,
  setSelectAllStaff,
  t,
}) {
  const PAGE_SIZE = 10;
  let totalItems = 0;

  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    isLoading,
    error,
    data: userData,
  } = useAllOfficeOwners(pageNumber, PAGE_SIZE, searchTerm);
  let userList = [];
  let content = null;
  if (isLoading) {
    content = <Loader />;
  }

  if (!isLoading && error) {
    content = <Toast errorToast message={error.message} />;
  }
  if (!isLoading && userData && userData.totalCount == 0) {
    content = <Empty Message={t("noRecordFound")} />;
  }

  if (!isLoading && userData && userData.totalCount > 0) {
    userList = userData.items;
    totalItems = userData.totalCount;

    content = (
      <Card radius="10px" className={styles["userlisting-card"]}>
        <ul className={styles["user-detail-list"]}>
          <li className={styles["user-header"]}>
            <div className={styles["owner-name"]}>
              {t("superAdmin.AccountOwnerName")}
            </div>
            <div className={styles["send-owner"]}>
              <div className={`ch-checkbox ` + styles["checkbox"]}>
                <label>
                  <input
                    onClick={(e) => onselectAllManagers(e.target.checked)}
                    checked={selectAllManagers}
                    type="checkbox"
                  />
                  <span>{t("superAdmin.sendToAllAccountOwners")}</span>
                </label>
              </div>
            </div>
            <div className={styles["send-staff"]}>
              <div className={`ch-checkbox ` + styles["checkbox"]}>
                <label>
                  <input
                    onClick={(e) => onselectAllStaff(e.target.checked)}
                    checked={selectAllStaff}
                    type="checkbox"
                  />
                  <span>{t("superAdmin.SendToAllStaff")}</span>
                </label>
              </div>
            </div>
          </li>
          {userList.length > 0 &&
            userList.map((item, key) => (
              <li key={key}>
                <div className={styles["owner-name"]}>
                  {item.firstName} {item.lastName} -{" "}
                  {item.office.length > 0
                    ? item.office[0].name + (item.office.length > 1 ? "," : "")
                    : ""}
                  {item.office.length > 1 && (
                    <>
                      <span id={`Tooltip-${key}`} className="link-btn">
                        +{item.office.length - 1 + " Other"}
                      </span>
                      <UncontrolledTooltip
                        placement="top"
                        target={`Tooltip-${key}`}
                      >
                        {item.office
                          .slice(1, item.office.length)
                          .map((v, i) => (
                            <span>
                              {v.name}
                              {item.office.length - 2 === i ? "" : ", "}
                            </span>
                          ))}
                      </UncontrolledTooltip>
                    </>
                  )}
                </div>
                <div
                  className={
                    selectAllManagers
                      ? `${styles["send-owner"]} ${styles.disabled}`
                      : styles["send-owner"]
                  }
                >
                  <div className={`ch-checkbox ` + styles["checkbox"]}>
                    <label>
                      <input
                        checked={selectedManagers.includes(item.id)}
                        onClick={() => onClickSelectManager(item.id)}
                        type="checkbox"
                      />
                      <span>{t("superAdmin.sendToAccountOwners")}</span>
                    </label>
                  </div>
                </div>
                <div
                  className={
                    selectAllStaff
                      ? `${styles["send-staff"]} ${styles.disabled}`
                      : styles["send-staff"]
                  }
                >
                  <div className={`ch-checkbox ` + styles["checkbox"]}>
                    <label>
                      <input
                        checked={selectedStaff.includes(item.id)}
                        onClick={() => onClickSelectStaff(item.id)}
                        type="checkbox"
                      />
                      <span>{t("superAdmin.SendToStaff")}</span>
                    </label>
                  </div>
                </div>
              </li>
            ))}
        </ul>
        {
          <PaginationProvider
            pagination={paginationFactory({
              custom: true,
              sizePerPage: PAGE_SIZE,
              totalSize: totalItems,
              page: pageNumber,
              onPageChange: setPageNumber,
            })}
          >
            {({ paginationProps, paginationTableProps }) => {
              return (
                <div className="data-table-block">
                  {/* Paginator component needs table to work, this is why we have used it.  */}
                  <div style={{ display: "none" }}>
                    <BootstrapTable
                      keyField="id"
                      data={[]}
                      columns={[{ text: "sometext" }]}
                      {...paginationTableProps}
                    />
                  </div>

                  <div className="pagnation-block">
                    {totalItems > PAGE_SIZE && (
                      <PaginationListStandalone {...paginationProps} />
                    )}
                  </div>
                </div>
              );
            }}
          </PaginationProvider>
        }
        <button
          className="button button-round button-shadow mr-4"
          title={t("save")}
          onClick={() => {
            setShowUser(false);
          }}
        >
          {t("save")}
        </button>
        <button
          className="button button-round button-border button-dark"
          title={t("cancel")}
          onClick={() => {
            setShowUser(false);
          }}
        >
          {t("cancel")}
        </button>
      </Card>
    );
  }
  const onClickSelectManager = (managerId) => {
    const managerArray = [...selectedManagers];
    const staffArray = [...selectedStaff];
    const mIndex = managerArray.findIndex((v) => v === managerId);
    const sIndex = staffArray.findIndex((v) => v === managerId);
    if (mIndex < 0) {
      managerArray.push(managerId);
    } else {
      managerArray.splice(mIndex, 1);
      if (sIndex > -1) {
        staffArray.splice(sIndex, 1);
      }
    }
    setSelectedManagers(managerArray);
    setSelectedStaff(staffArray);
  };
  const onClickSelectStaff = (staffManagerId) => {
    const managerArray = [...selectedManagers];
    const staffArray = [...selectedStaff];
    const mIndex = managerArray.findIndex((v) => v === staffManagerId);
    const sIndex = staffArray.findIndex((v) => v === staffManagerId);

    if (sIndex < 0) {
      staffArray.push(staffManagerId);
      if (mIndex < 0) {
        managerArray.push(staffManagerId);
      }
    } else {
      staffArray.splice(sIndex, 1);
    }
    setSelectedManagers(managerArray);
    setSelectedStaff(staffArray);
  };
  const onselectAllManagers = (flag) => {
    setSelectAllManagers(flag);
    if (!flag) {
      setSelectAllStaff(flag);
    }
  };
  const onselectAllStaff = (flag) => {
    setSelectAllStaff(flag);
    if (flag) {
      setSelectAllManagers(flag);
    }
  };

  return (
    <>
      <h2 class="page-title mt-3 mb-4">{t("superAdmin.selectUsers")}</h2>
      <div className={styles["broadcast-userlisting"]}>
        <div className={styles["search-wrapper"]}>
          <div className={styles["search-input-card"]}>
            <img src={searchIcon} alt="search" />
            <input
              type="search"
              className={styles["search-input"]}
              placeholder={t("superAdmin.searchByName")}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.currentTarget.value);
              }}
            />
          </div>
        </div>
        {content}
      </div>
    </>
  );
}
export default withTranslation()(BroadcastMessagesUserListing);
