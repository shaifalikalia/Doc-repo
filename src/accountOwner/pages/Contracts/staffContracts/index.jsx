import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Text from "components/Text";
import constants from "./../../../../constants";
import styles from "./StaffContracts.module.scss";
import { useOfficeDetail } from "repositories/office-repository";
import {
  useStaffContracts,
  useDeleteContractMutation,
} from "repositories/contract-repository";
import ContractCard from "./components/ContractCard";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import AddContractModal from "./../AddContractModal";
import Loader from "components/Loader";
import Empty from "components/Empty";
import DeleteContractModal from "../DeleteContractModal";
import toast from "react-hot-toast";
import { decodeId, encodeId } from "utils";

function StaffContracts({ history, location, match, t }) {
  let totalItems = 0;
  const officeId = decodeId(match.params.officeId);
  const staffId = decodeId(match.params.staffId);
  const staffName = localStorage.getItem("staffName")
    ? localStorage.getItem("staffName")
    : "";
  const pageSize = 5;
  const [pageNumber, setPageNumber] = useState(1);
  const [contractId, setContractId] = useState(1);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const goBack = () => {
    history.push({
      pathname: constants.routes.accountOwner.contracts.replace(
        ":officeId",
        match.params.officeId
      ),
      state: location.state,
    });
  };
  let officeName = null;
  if (location.state && location.state.officeName) {
    officeName = location.state.officeName;
  }
  const deleteContractMutation = useDeleteContractMutation();
  const [pdfLoader, setPdfLoader] = useState(false);

  const { isLoading: isLoadingContract, data: officeContracts } =
    useStaffContracts(staffId, pageNumber, pageSize);
  const { isLoading: isLoadingOfficeDetail, data: officeDetail } =
    useOfficeDetail(officeId);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  let userContracts = [];
  if (!isLoadingContract && officeContracts && officeContracts.items) {
    userContracts = officeContracts.items;
    totalItems = officeContracts.pagination.totalItems;
  }

  const editContract = (_contractId) => {
    history.push(
      constants.routes.accountOwner.editContract
        .replace(":officeId", encodeId(officeId))
        .replace(":staffId", encodeId(staffId))
        .replace(":contractId", encodeId(_contractId))
    );
  };

  const viewContract = (contract) => {
    if (contract.type === 2) {
      history.push(
        constants.routes.accountOwner.viewContract
          .replace(":officeId", encodeId(officeId))
          .replace(":contractId", encodeId(contract?.id)),
        { contract }
      );
    }
  };
  const deleteContract = (_contractId) => {
    setContractId(_contractId);
    setConfirmDeleteModal(true);
  };

  const confirmDeleteContract = async () => {
    try {
      const resp = await deleteContractMutation.mutateAsync({ contractId });
      setConfirmDeleteModal(false);
      setPageNumber(0);
      setTimeout(() => {
        setPageNumber(1);
      }, 1000);
      toast.success(resp);
    } catch (e) {
      console.log(e.message);
    }
  };

  let ListTemplate = "";
  if (userContracts.length) {
    ListTemplate = userContracts.map((item, index) => (
      <div key={index}>
        <ContractCard
          contractData={item}
          editContract={editContract}
          deleteContract={deleteContract}
          setPdfLoader={setPdfLoader}
          viewContract={viewContract}
        />
      </div>
    ));
  } else {
    ListTemplate = <Empty Message={t("noContractFound")} />;
  }
  return (
    <Page
      onBack={goBack}
      isTitleLoading={!officeName && isLoadingOfficeDetail && isLoadingContract}
      title={officeName || (officeDetail && officeDetail.name)}
      className={styles["page"]}
    >
      {(pdfLoader || isLoadingOfficeDetail || isLoadingContract) && <Loader />}

      <div className={styles["page-subheading"]}>
        {t("contracts.formsAndContract")}
      </div>
      <div className={styles["add-btn-row"]}>
        {officeDetail?.isActive && (
          <button
            className="button button-round button-shadow"
            onClick={() => {
              setModalIsOpen(true);
            }}
            title={t("contracts.addContract")}
          >
            {t("contracts.addContract")}
          </button>
        )}
      </div>
      <div className={"mange-sub-section " + styles["contract-listing-single"]}>
        <Text color="#111b45" size="20px" weight="500" marginBottom="15px">
          {staffName}
        </Text>
        {ListTemplate}
        {ListTemplate && (
          <PaginationProvider
            pagination={paginationFactory({
              custom: true,
              sizePerPage: pageSize,
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
                    {totalItems > pageSize && (
                      <PaginationListStandalone {...paginationProps} />
                    )}
                  </div>
                </div>
              );
            }}
          </PaginationProvider>
        )}
      </div>
      {modalIsOpen && (
        <AddContractModal
          isModalOpen={modalIsOpen}
          closeModal={(e) => {
            setModalIsOpen(false);
            if (e) {
              setTimeout(() => {
                setPageNumber(1);
              }, 1000);
            }
          }}
          staffId={staffId}
          openNewContract={() =>
            history.push(
              constants.routes.accountOwner.newContract
                .replace(":officeId", encodeId(officeId))
                .replace(":staffId", encodeId(staffId))
            )
          }
          setPageNumber={setPageNumber}
        />
      )}

      {confirmDeleteModal && (
        <DeleteContractModal
          isModalOpen={confirmDeleteModal}
          deleteContract={() => confirmDeleteContract()}
          closeModal={() => {
            setConfirmDeleteModal(false);
          }}
        />
      )}
    </Page>
  );
}
export default withTranslation()(StaffContracts);
