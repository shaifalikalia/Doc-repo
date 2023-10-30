import useHandleApiError from "hooks/useHandleApiError";
import useQueryParam from "hooks/useQueryParam";
import useScrollTopOnPageChange from "hooks/useScrollTopOnPageChange";
import { pick, uniqBy, filter, debounce } from "lodash";
import { getFullName } from "Messenger/pages/TeamConversation/utils";
import { useState, useMemo, Fragment, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useHistory } from "react-router-dom";
import {
  useAssignOffices,
  useDeleteAssignedOffice,
  useGetOfficeList,
  useGetSalesRepDetails,
  useUpdateSalesRepStatus,
} from "repositories/vendor-repository";
import { decodeId, handleError, paginateArray, testRegexCheck } from "utils";
import constants from "../../../../constants";

const SALES_REP_OFFICE_PAGE_SIZE = 6;
const OFFICE_LIST_PAGE_SIZE = 20;

const useSalesRepDetail = (dependencies) => {
  const { t } = dependencies;

  const history = useHistory();

  let id = useQueryParam("id", null);
  if (id) {
    id = decodeId(id);
  }

  useEffect(() => {
    if (!id) {
      history.push(constants.routes.vendor.manageSalesRep);
    }
  }, []);

  const {
    isLoading: loadingDetails,
    isFetching: fetchingDetails,
    data: details,
    error: detailsError,
    refetch: refetchDetails,
  } = useGetSalesRepDetails(id, { enabled: !!id });
  useHandleApiError(loadingDetails, fetchingDetails, detailsError);
  const updateActiveStatusMutation = useUpdateSalesRepStatus();
  const { isLoading: updatingActiveStatus } = updateActiveStatusMutation;
  const deleteAssignedOfficeMutation = useDeleteAssignedOffice();
  const { isLoading: deletingOffice } = deleteAssignedOfficeMutation;

  //FOR OFFICES TABLE************************
  let cacheData = sessionStorage.getItem(constants.vendor.cache.salesRepDetail);
  cacheData = cacheData ? JSON.parse(cacheData) : {};
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSalesRepOfficePage, setCurrentSalesRepOfficePage] = useState(
    cacheData.currentPage || 1
  );
  useScrollTopOnPageChange(currentSalesRepOfficePage);
  const [salesRepOfficeSearchTerm, setSalesRepOfficeSearchTerm] = useState(
    cacheData.apiSearchTerm || ""
  );

  const [officeToDelete, setOfficeToDelete] = useState(null);

  useEffect(() => {
    const cacheData = JSON.stringify({
      currentPage: currentSalesRepOfficePage,
      apiSearchTerm: salesRepOfficeSearchTerm,
    });
    sessionStorage.setItem(constants.vendor.cache.salesRepDetail, cacheData);
  }, [currentSalesRepOfficePage, salesRepOfficeSearchTerm]);

  useEffect(() => {
    //This useEffect is used to remove the session storage keys only when they move to next location from current.
    return () => {
      sessionStorage.removeItem(constants.vendor.cache.salesRepDetail);
    };
  }, []);

  const openDeleteModal = (office) => {
    setOfficeToDelete(office);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setOfficeToDelete(null);
  };

  const handleSalesRepPage = (page) => setCurrentSalesRepOfficePage(page);

  const handleSalesRepOfficeSearchTerm = (e) => {
    const value = e.target.value;
    if (!testRegexCheck(value)) return;
    setSalesRepOfficeSearchTerm(value);
    setCurrentSalesRepOfficePage(1);
  };

  const salesRepOffices = useMemo(() => {
    if (!details) return [];
    return (details.office || []).filter((office) => {
      const { name = "" } = office;
      return name
        .replaceAll(" ", "")
        .toLowerCase()
        .includes(salesRepOfficeSearchTerm.replaceAll(" ", "").toLowerCase());
    });
  }, [details, salesRepOfficeSearchTerm]);

  const currentSalesRepOffices = useMemo(() => {
    const currentPageOfficeList = paginateArray(
      salesRepOffices,
      SALES_REP_OFFICE_PAGE_SIZE,
      currentSalesRepOfficePage
    );
    return currentPageOfficeList.map((office) => {
      const { id, name, owner } = office;
      return {
        id,
        officeName: name,
        accountOwner: getFullName(owner),
      };
    });
  }, [salesRepOffices, currentSalesRepOfficePage]);

  useEffect(() => {
    //This is used wthen last itme of any page is deleted so that we can
    // automatically fallback to previous page.
    if (
      currentSalesRepOfficePage > 1 &&
      currentSalesRepOffices &&
      !currentSalesRepOffices.length
    ) {
      setCurrentSalesRepOfficePage((prev) => prev - 1);
    }
  }, [currentSalesRepOfficePage, currentSalesRepOffices]);

  const salesRepColumns = [
    {
      attrs: { datatitle: t("vendorManagement.officeName") },
      dataField: "officeName",
      text: t("vendorManagement.officeName"),
    },
    {
      attrs: { datatitle: t("superAdmin.accountOwner") },
      dataField: "accountOwner",
      text: t("superAdmin.accountOwner"),
    },
    {
      attrs: { datatitle: t("vendorManagement.actions") },
      dataField: "actions",
      text: t("vendorManagement.actions"),
      formatter: (cellContent, row) => (
        <Fragment>
          <span
            onClick={() => openDeleteModal(row)}
            title={t("delete")}
            className="cursor-pointer"
          >
            <img
              src={require("assets/images/delete-icon.svg").default}
              alt="icon"
            />
          </span>
        </Fragment>
      ),
    },
  ];
  ////////////////////////////////////////

  //******************For Offices Modal assign modal */
  const [officeModal, setOfficeModal] = useState(false);
  const [officeList, setOfficeList] = useState([]);
  const [currentOfficePage, setCurrentOfficePage] = useState(1);
  const [totalOfficePages, setTotalOfficePages] = useState(1);
  const [officeSearchTerm, setOfficeSearchTerm] = useState("");
  const [apiOfficeSearchTerm, setApiOfficeSearchTerm] = useState("");
  const [selectedOfficeIds, setSelectedOfficeIds] = useState([]);
  const [assignError, setAssignError] = useState("");

  const handleApiOfficeSearchTerm = useCallback(
    debounce(
      (value, _apiOfficeSearchTerm) => {
        if (value != _apiOfficeSearchTerm) {
          setAssignError("");
          setApiOfficeSearchTerm(value);
          setSelectedOfficeIds([]);
          setOfficeList([]);
          setCurrentOfficePage(1);
        }
      },
      2000,
      { trailing: true }
    ),
    []
  );

  const handleSearchOffice = (e) => {
    const value = e.target.value;
    if (!testRegexCheck(value)) return;
    setOfficeSearchTerm(value);
    handleApiOfficeSearchTerm(value.trim(), apiOfficeSearchTerm);
  };

  const loadMoreOffices = () => {
    if (currentOfficePage < totalOfficePages) {
      setCurrentOfficePage((prev) => prev + 1);
    }
  };

  const {
    isLoading: loadingOfficeList,
    isFetching: fetchingOfficeList,
    data: officeListData,
    error: officeListError,
    refetch: refetchOfficeList,
  } = useGetOfficeList(
    id,
    currentOfficePage,
    apiOfficeSearchTerm,
    OFFICE_LIST_PAGE_SIZE,
    { enabled: !!id, cacheTime: 0 }
  );
  useHandleApiError(loadingOfficeList, fetchingOfficeList, officeListError);

  const assignOfficesMutation = useAssignOffices();
  const { isLoading: assigningOffices } = assignOfficesMutation;

  const isOfficeSelected = (office) => {
    return selectedOfficeIds.includes(office.id);
  };
  const handleOfficeSelect = (isSelected, office) => {
    setAssignError("");
    if (isSelected) {
      const updatedIds = filter(selectedOfficeIds, (val) => val !== office.id);
      setSelectedOfficeIds(updatedIds);
    } else {
      setSelectedOfficeIds((prev) => [...prev, office.id]);
    }
  };
  useEffect(() => {
    if (officeListData?.data) {
      setOfficeList((prev) => uniqBy([...prev, ...officeListData.data], "id"));
      setTotalOfficePages(officeListData?.pagination?.totalPages);
    }
  }, [officeListData]);

  //********************************************* */
  //methods
  const onBack = () => {
    history.push(constants.routes.vendor.manageSalesRep);
  };
  const openOfficeModal = () => {
    setOfficeModal(true);
  };
  const resetOfficeModal = () => {
    if (currentOfficePage > 1 || apiOfficeSearchTerm) {
      setOfficeList([]);
      setCurrentOfficePage(1);
      setApiOfficeSearchTerm("");
      setOfficeSearchTerm("");
    }
    setSelectedOfficeIds([]);
    setAssignError("");
  };
  const closeOfficeModal = () => {
    setOfficeModal(false);
    resetOfficeModal();
  };

  const assignOffices = async () => {
    if (!selectedOfficeIds.length) {
      setAssignError(t("vendorManagement.errors.assignOfficeError"));
    } else {
      try {
        const body = {
          SalesRepresentativeId: id,
          OfficeIds: selectedOfficeIds,
        };
        await assignOfficesMutation.mutateAsync(body);
        toast.success(t("vendorManagement.officesAssignedSuccessfully"));
        setOfficeList([]);
        closeOfficeModal();
        refetchDetails();
        refetchOfficeList();
      } catch (err) {
        handleError(err);
      }
    }
  };

  const handleToggleSwitch = async () => {
    try {
      const payload = {
        SalesRepresentativeId: id,
        IsActive: !details.isActive,
      };
      await updateActiveStatusMutation.mutateAsync(payload);
      refetchDetails();
    } catch (err) {
      handleError(err);
    }
  };

  const confirmDeleteOffice = async () => {
    try {
      if (officeToDelete) {
        const payload = {
          SalesRepresentativeId: id,
          OfficeId: officeToDelete.id,
        };
        await deleteAssignedOfficeMutation.mutateAsync(payload);
        setOfficeList([]);
        closeDeleteModal();
        refetchDetails();
        refetchOfficeList();
      }
    } catch (err) {
      handleError(err);
    }
  };

  const linkToEditDetails = {
    pathname: constants.routes.vendor.editSalesRep,
    state: pick(details, [
      "id",
      "contactNumber",
      "emailId",
      "firstName",
      "lastName",
    ]),
  };

  return {
    state: {
      officeModal,
      isDeleteModalOpen,
      currentSalesRepOfficePage,
      salesRepOfficeSearchTerm,
      officeList,
      selectedOfficeIds,
      assignError,
      officeSearchTerm,
    },
    otherData: {
      linkToEditDetails,
      deletingOffice,
      loading:
        loadingDetails ||
        loadingOfficeList ||
        assigningOffices ||
        updatingActiveStatus,
      details: details || {},
      salesRepColumns,
      currentSalesRepOffices,
      totalSalesRepOffices: salesRepOffices.length || 0,
      salesRepOfficePageSize: SALES_REP_OFFICE_PAGE_SIZE,

      //offices modal
      hasMoreOffices: currentOfficePage < totalOfficePages,
    },
    methods: {
      openOfficeModal,
      closeOfficeModal,
      closeDeleteModal,
      handleSalesRepPage,
      handleSalesRepOfficeSearchTerm,
      onBack,
      //offices modal
      isOfficeSelected,
      handleOfficeSelect,
      handleSearchOffice,
      loadMoreOffices,
      assignOffices,
      handleToggleSwitch,
      confirmDeleteOffice,
    },
  };
};

export default useSalesRepDetail;
