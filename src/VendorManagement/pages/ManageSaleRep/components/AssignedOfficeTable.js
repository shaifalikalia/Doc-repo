import React, { Fragment } from "react";
import { withTranslation } from "react-i18next";
import Table from "components/table";
import CommonCenteredModal from "VendorManagement/components/Modals/CommonCenteredModal";

const AssignedOfficeTable = ({ t, hookData }) => {
  const { state, otherData, methods } = hookData;
  const {
    salesRepColumns,
    currentSalesRepOffices,
    salesRepOfficePageSize,
    totalSalesRepOffices,
    deletingOffice,
  } = otherData;
  const { isDeleteModalOpen, currentSalesRepOfficePage } = state;
  const { closeDeleteModal, handleSalesRepPage, confirmDeleteOffice } = methods;

  return (
    <Fragment>
      <div className="table-td-last-50">
        <Table
          keyField="id"
          data={currentSalesRepOffices}
          columns={salesRepColumns}
          handlePagination={handleSalesRepPage}
          pageNumber={currentSalesRepOfficePage}
          totalItems={totalSalesRepOffices}
          pageSize={salesRepOfficePageSize}
        />
      </div>
      {isDeleteModalOpen && (
        <CommonCenteredModal
          Title={t("vendorManagement.deleteOffice")}
          Desc={t("vendorManagement.deleteOfficeDsc")}
          btnText={t("delete")}
          isOpen={isDeleteModalOpen}
          handleClose={closeDeleteModal}
          handleConfirm={confirmDeleteOffice}
          loading={deletingOffice}
        />
      )}
    </Fragment>
  );
};

export default withTranslation()(AssignedOfficeTable);
