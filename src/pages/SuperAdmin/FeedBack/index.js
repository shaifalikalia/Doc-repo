import React, { useEffect, useState } from "react";
import Page from "components/Page";
import Table from "components/table";
import { withTranslation } from "react-i18next";
import Empty from "components/Empty";
import toast from "react-hot-toast";
import { getListFeedBackAndSuggestions } from "repositories/utility-repository";
import moment from "moment";
import Loader from "components/Loader";
import constants from "../../../constants";
import { encodeId } from "utils";
const PAGE_SIZE = 10;

function Index({ history, location, t }) {
  const [list, setlist] = useState({});
  const [page, setPage] = useState(1);
  const [isLoader, setIsLoader] = useState(false);

  useEffect(() => {
    getSuggestionList();
  }, [page]);

  const getSuggestionList = async () => {
    try {
      setIsLoader(true);
      let res = await getListFeedBackAndSuggestions(page, PAGE_SIZE);
      res && setlist(res);
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      toast.error(error.message);
    }
  };

  const moveToDetails = (item) => {
    history.push(
      constants.routes.superAdmin.feedbackView.replace(
        ":feedbackId",
        encodeId(item.id)
      )
    );
  };

  const columns = [
    {
      text: t("superAdmin.DateAndTime"),
      formatter: (cellContent, row) => {
        return moment(row?.createdAt).format("MMM-DD-YYYY - hh:mm A");
      },
    },
    {
      text: t("Category"),
      dataField: "emailId",
      formatter: (cellContent, row) => {
        return row?.userFeedbackAndSuggestionCategory?.category;
      },
    },
    {
      text: t("superAdmin.User"),
      dataField: "contactNumber",
      formatter: (cellContent, row) => {
        return `${row?.createdBy?.firstName} ${row?.createdBy?.lastName}`;
      },
    },
    {
      text: "",
      dataField: "View",
      formatter: (cellContent, row) => {
        return (
          <div className="link-btn" onClick={() => moveToDetails(row)}>
            {" "}
            {t("view")}{" "}
          </div>
        );
      },
    },
  ];

  const goToPage = (newPageNumber) => {
    setPage(newPageNumber);
  };

  return (
    <>
      <Page titleKey={"navbar.feedback"}>
        {isLoader && <Loader />}
        {list?.data ? (
          <Table
            columns={columns}
            data={list?.data || []}
            keyField="id"
            handlePagination={goToPage}
            pageNumber={page}
            totalItems={list?.pagination?.totalItems}
            pageSize={PAGE_SIZE}
          />
        ) : (
          <Empty Message={t("superAdmin.noFeedbackSuggestionFound")} />
        )}
      </Page>
    </>
  );
}

export default withTranslation()(Index);
