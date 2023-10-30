import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

const Table = ({
  columns,
  data,
  totalItems,
  handlePagination,
  pageNumber,
  keyField,
  pageSize,
}) => {
  let defaultPageSize = 10;
  if (!pageSize) pageSize = defaultPageSize;

  const options = {
    custom: true,
    sizePerPage: pageSize,
    totalSize: totalItems,
    page: pageNumber,
    onPageChange: (page) => {
      handlePagination(page);
    },
  };

  return (
    <div className="data-table-block">
      <PaginationProvider pagination={paginationFactory(options)}>
        {({ paginationProps, paginationTableProps }) => (
          <div>
            <div className="data-table-container">
              <BootstrapTable
                bordered={false}
                classes="custom-table"
                columns={columns}
                data={data}
                defaultSortDirection="asc"
                keyField={keyField}
                onTableChange={() => {}}
                pagination={true}
                remote={true}
                wrapperClasses="table-responsive"
                {...paginationTableProps}
              />
            </div>
            <div className="pagnation-block">
              {totalItems > pageSize && (
                <PaginationListStandalone {...paginationProps} />
              )}
            </div>
          </div>
        )}
      </PaginationProvider>
    </div>
  );
};

export default Table;
