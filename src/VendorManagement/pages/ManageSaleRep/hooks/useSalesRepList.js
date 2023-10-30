import { debounce } from "lodash";
import { Fragment, useCallback, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useGetSalesRepList } from "repositories/vendor-repository";
import { encodeId, testRegexCheck } from "utils";
import constants from "../../../../constants";
import qs from "query-string";
import useHandleApiError from "hooks/useHandleApiError";
import useRemoveCache from "hooks/useRemoveCache";
import useScrollTopOnPageChange from "hooks/useScrollTopOnPageChange";
import { useSelector } from "react-redux";

const useSalesRepList = (dependencies) => {
  const { t } = dependencies;
  const pageSize = 10;
  const [totalItems, setTotalItems] = useState(1);
  const history = useHistory();
  const profile = useSelector((e) => e.userProfile.profile);

  let cacheData = sessionStorage.getItem(constants.vendor.cache.salesRepList);
  cacheData = cacheData ? JSON.parse(cacheData) : {};
  const [showDisableModel, setShowDisableModel] = useState(false);
  const [showDetailsDisableModel, setDetailsShowDisableModel] = useState(false);

  const [currentPage, setCurrentPage] = useState(cacheData.currentPage || 1);
  const [searchTerm, setSearchTerm] = useState(cacheData.apiSearchTerm || "");
  const isAccountTerminated = profile?.profileSetupStep === constants.subscriptionTerminated
  const [apiSearchTerm, setApiSearchTerm] = useState(
    cacheData.apiSearchTerm || ""
  );

  const [columnData, setColumnData] = useState([]);
  const {
    isLoading,
    isFetching,
    data: listData,
    error,
  } = useGetSalesRepList(pageSize, currentPage, apiSearchTerm);
  useHandleApiError(isLoading, isFetching, error);
  useScrollTopOnPageChange(currentPage);

  useEffect(() => {
    if (listData) {
      setTotalItems(listData?.pagination?.totalItems);
      const colData = listData?.data?.map((item) => {
        const {
          id,
          firstName,
          lastName,
          emailId,
          officeAssigned,
          isActive,
          contactNumber,
        } = item;
        return {
          id,
          name: `${firstName} ${lastName}`,
          emailAddress: emailId,
          phoneNumber: contactNumber || "--",
          officesAssigned: t("vendorManagement.numberOffices", {
            offices: officeAssigned,
          }),
          status: isActive ? t("active") : t("inactive"),
          actions: t("vendorManagement.viewDetails"),
          isActive: isActive,
        };
      });
      if (colData) {
        setColumnData(colData);
      }
    }
  }, [listData]);

  useEffect(() => {
    const cacheData = JSON.stringify({
      currentPage,
      apiSearchTerm,
    });
    sessionStorage.setItem(constants.vendor.cache.salesRepList, cacheData);
  }, [apiSearchTerm, currentPage]);

  useRemoveCache(
    [
      constants.routes.vendor.salesRepDetail,
      constants.routes.vendor.inviteSalesRep,
    ],
    constants.vendor.cache.salesRepList
  );

  const handleRedirectDetails = (path) => {
    if (profile.profileSetupStep === constants.subscriptionTerminated) {
      setDetailsShowDisableModel(true);
      return false;
    }
    history.push(path);
  };

  const columns = [
    {
      attrs: { datatitle: t("name") },
      dataField: "name",
      text: t("name"),
      formatter: (cellContent, row, rowIndex) => {
        let classNameUpdate = row.isActive === false ? "text-grey" : "";
        return <span className={classNameUpdate}>{row.name}</span>;
      },
    },
    {
      attrs: { datatitle: t("emailAddress") },
      dataField: "emailAddress",
      text: t("emailAddress"),
    },
    {
      attrs: { datatitle: t("form.fields.phoneNumber") },
      dataField: "phoneNumber",
      text: t("form.fields.phoneNumber"),
    },
    {
      attrs: { datatitle: t("vendorManagement.officesAssigned") },
      dataField: "officesAssigned",
      text: t("vendorManagement.officesAssigned"),
    },
    {
      attrs: { datatitle: t("status") },
      dataField: "status",
      text: t("status"),
    },
    {
      attrs: { datatitle: t("vendorManagement.actions") },
      dataField: "actions",
      text: t("vendorManagement.actions"),
      formatter: (cellContent, row) => {
        const { id } = row;
        return (
          <Fragment>
            <span
              onClick={() =>
                handleRedirectDetails({
                  pathname: constants.routes.vendor.salesRepDetail,
                  search: qs.stringify({
                    id: encodeId(id),
                  }),
                })
              }
              className="table-row-main-link link-btn"
            >
              {t("superAdmin.viewDetails")}
            </span>
          </Fragment>
        );
      },
    },
  ];

  const handlePageNumber = (page) => {
    setCurrentPage(page);
  };

  const handleApiSearchTerm = useCallback(
    debounce(
      (value) => {
        setApiSearchTerm(value);
        setCurrentPage(1);
      },
      1000,
      { trailing: true }
    ),
    []
  );

  const handleSearchTerm = (e) => {
    const value = e.target.value;
    if (!testRegexCheck(value)) return;
    setSearchTerm(value);
    handleApiSearchTerm(value.trim());
  };

  const handleRedirect = () => {
    if (isAccountTerminated) {
      setShowDisableModel(true);
      return false;
    }
    history.push(constants.routes.vendor.inviteSalesRep);
  };

  return {
    state: {
      totalItems,
      searchTerm,
      columnData,
      currentPage,
      showDisableModel: showDisableModel || showDetailsDisableModel,
      content: showDisableModel
        ? t("vendorManagement.salesRepDisabled")
        : t("vendorManagement.salesRepDetailDisabled"),
        disabledClass: isAccountTerminated ? 'disabled-element' : ''
    },
    otherData: {
      loading: isLoading || isFetching,
      columns,
      pageSize,
    },
    methods: {
      handlePageNumber,
      handleSearchTerm,
      handleRedirect,
      closeModel: () => {
        setDetailsShowDisableModel(false);
        setShowDisableModel(false);
      },
    },
  };
};

export default useSalesRepList;
