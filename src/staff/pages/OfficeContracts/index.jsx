import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Page from "components/Page";
import Text from "components/Text";
import constants from "./../../../constants";
import styles from "./OfficeContracts.module.scss";
import { useOfficeDetail } from "repositories/office-repository";
import {
  useOfficeContracts,
  useTermsAndConditions,
} from "repositories/contract-repository";
import ContractCard from "./components/ContractCard";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import Loader from "components/Loader";
import Empty from "components/Empty";
import TermsForContractModal from "./TermsForContractModal";
import { decodeId } from "utils";

function OfficeContracts({ history, location, match, t }) {
  let totalItems = 0;
  const officeId = decodeId(match.params.officeId);
  const pageSize = 5;
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedContract, setSelectedContract] = useState(0);

  const goBack = () => {
    history.push({
      pathname: constants.routes.staff.officeOptions.replace(
        ":officeId",
        match.params.officeId
      ),
      state: location.state,
    });
  };

  const [pdfLoader, setPdfLoader] = useState(false);
  let officeName = null;

  if (location.state && location.state?.officeData?.name) {
    officeName = location.state?.officeData?.name;
  }

  const { isLoading: isLoadingTerms, data: termsData } = useTermsAndConditions(
    constants.cmsPageKey.TermsAndConditionOfContractForStaff
  );
  const { isLoading: isLoadingContract, data: officeContracts } =
    useOfficeContracts(officeId, pageNumber, pageSize);
  const { isLoading: isLoadingOfficeDetail, data: officeDetail } =
    useOfficeDetail(officeId);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  let userContracts = [];

  if (!isLoadingContract && officeContracts && officeContracts.items) {
    userContracts = officeContracts.items;
    totalItems = officeContracts.pagination.totalItems;
  }

  const viewContract = (contractId) => {
    history.push(
      constants.routes.staff.viewContract
        .replace(":officeId", match.params.officeId)
        .replace(":contractId", contractId)
    );
  };
  const confirmPending = (contract) => {
    if (contract.type === 2) {
      setSelectedContract(contract.id);
      if (contract.status === 2) {
        setModalIsOpen(true);
      } else {
        viewContract(contract.id);
      }
    }
  };
  let ListTemplate = "";
  if (userContracts.length) {
    ListTemplate = userContracts.map((item, index) => (
      <div key={index}>
        <ContractCard
          contractData={item}
          officeId={officeId}
          editContract={confirmPending}
          setPdfLoader={setPdfLoader}
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
      {(pdfLoader ||
        isLoadingTerms ||
        isLoadingOfficeDetail ||
        isLoadingContract) && <Loader />}

      <div className={styles["page-subheading"]}>
        {t("contracts.formsAndContract")}
      </div>

      <div className={"mange-sub-section " + styles["contract-listing-single"]}>
        <Text
          color="#111b45"
          size="20px"
          weight="500"
          marginBottom="15px"
        ></Text>
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
                <div className="data-table-block ">
                  {/* Paginator component needs table to work, this is why we have used it.  */}
                  <div style={{ display: "none" }}>
                    <BootstrapTable
                      keyField="id"
                      data={[]}
                      columns={[{ text: "sometext" }]}
                      {...paginationTableProps}
                    />
                  </div>

                  <div
                    className={
                      "pagnation-block " + styles["mobile-align-center"]
                    }
                  >
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
        <TermsForContractModal
          isModalOpen={modalIsOpen}
          closeModal={() => setModalIsOpen(false)}
          confirm={() => viewContract(selectedContract)}
          termsData={termsData}
        />
      )}
    </Page>
  );
}
export default withTranslation()(OfficeContracts);
