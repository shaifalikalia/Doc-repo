import React, { useEffect, useState } from "react";
import Page from "components/Page";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import orangeStarIcon from "./../../../assets/images/orange-star.svg";
import greyStarIcon from "./../../../assets/images/grey-star.svg";
import { Col, Row } from "reactstrap";
import constants from "./../../../constants";
import qs from "query-string";
import { decodeId, formatDate } from "utils";
import { useParams } from "react-router";
import { useReviewsByPatient } from "repositories/review-repository";
import Toast from "components/Toast/Alert";
import Empty from "components/Empty";
import ReviewConfirmationPopup from "../ReviewConfirmationPopup";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

const pageSize = 2;

function PatientReviews({ history, location, t }) {
  let { patientId } = useParams();
  patientId = decodeId(patientId);

  const [pageNumber, setPageNumber] = useState(1);

  const options = [
    { value: null, label: t("superAdmin.allReviewsAndRatings") },
    { value: true, label: t("active") },
    { value: false, label: t("inactive") },
  ];
  const [status, setStatus] = useState(options[0]);
  const [selectedReview, setSelectedReview] = useState(null);

  const { isLoading, error, data } = useReviewsByPatient(
    patientId,
    pageNumber,
    pageSize,
    status.value
  );

  const goToReviews = () =>
    history.push({
      pathname: constants.routes.superAdmin.reviews,
      search: location.state
        ? qs.stringify(location.state.query)
        : qs.stringify({ tab: 2 }),
    });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageNumber]);

  if (patientId === undefined || isNaN(patientId)) {
    goToReviews();
    return null;
  }

  if (isLoading) {
    return (
      <Page
        titleKey={t("superAdmin.patientsReviewsAndRatings")}
        onBack={goToReviews}
      >
        <div className="w-100 d-flex align-items-center justify-content-center h-50vh">
          <div className="loader"></div>
        </div>
      </Page>
    );
  }

  if (!isLoading && error) {
    return (
      <Page
        titleKey={t("superAdmin.patientsReviewsAndRatings")}
        onBack={goToReviews}
      >
        <Toast errorTost message={error.message} />
      </Page>
    );
  }

  if (!isLoading && data && data.items.length === 0) {
    return (
      <Page
        titleKey={t("superAdmin.patientsReviewsAndRatings")}
        onBack={goToReviews}
      >
        <Empty Message={t("superAdmin.noReviewFound")} />
      </Page>
    );
  }

  let reviews = null;
  let patientName = null;
  let totalItems = 0;
  if (!isLoading) {
    totalItems = data.totalCount;
    reviews = data.items.map((it, i) => (
      <Review
        key={i}
        review={it}
        onAction={(review) => setSelectedReview(review)}
        t={t}
      />
    ));

    if (data.items[0]) {
      const review = data.items[0];
      patientName = `${review.patient.firstName} ${review.patient.lastName}`;
    }
  }

  return (
    <Page
      titleKey={t("superAdmin.patientsReviewsAndRatings")}
      onBack={goToReviews}
    >
      <div className="review-filter-wrapper">
        <div>
          <h4 className="patient-heading">{patientName}</h4>
          <div className="patient-desc">{t("superAdmin.patientName")}</div>
        </div>

        <div className="member-filter review-rating-filter">
          <Select
            options={options}
            value={status}
            onChange={(v) => setStatus(v)}
            isSearchable={false}
            className={["react-select-container pl-2"]}
            classNamePrefix="react-select"
          />
        </div>
      </div>

      <div>
        {reviews}
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
      </div>

      {selectedReview !== null && (
        <ReviewConfirmationPopup
          onClose={() => setSelectedReview(null)}
          onActionComplete={() => setSelectedReview(null)}
          review={selectedReview}
          t={t}
        />
      )}
    </Page>
  );
}

function Review({ review, onAction, t }) {
  const stars = new Array(5).fill({}).map((it, i) => {
    const imgSrc = i + 1 > review.rating ? greyStarIcon : orangeStarIcon;
    return <img width={14} height={14} src={imgSrc} alt="star" />;
  });

  return (
    <div className="review-rating-wrapper">
      <div
        className={
          review.isFeedbackApproved
            ? "status-active-btn"
            : "status-inactive-btn"
        }
      >
        {t(review.isFeedbackApproved ? "active" : "inactive")}
      </div>
      <div className="green-review-box">
        <div className="d-flex justify-content-between">
          <div>
            <div className="review-title1">{`${review.patient.firstName} ${review.patient.lastName}`}</div>
            <div>
              <span>{formatDate(review.feedbackSubmittedAt, "ll")}</span>
              <span className="mx-2" style={{ color: "#e0e4dc" }}>
                &#8226;
              </span>
              <span>{formatDate(review.feedbackSubmittedAt, "LT")}</span>
            </div>
          </div>
          {/* eslint-disable-next-line */}
          <div className={"d-flex" + " " + "star-rating"}>{stars}</div>
        </div>

        <Row className="my-2 py-1">
          <Col md="2" xs="3">
            <div className="review-title2">{t("superAdmin.doctorName")}</div>
            <div>{`${review.doctor.firstName} ${review.doctor.lastName}`}</div>
          </Col>
          <Col md="2" xs="3">
            <div className="review-title2">{t("superAdmin.officeName")}</div>
            <div>{review.office.name}</div>
          </Col>
        </Row>
        <div>{review.feedback}</div>
      </div>

      {review.feedbackComment && (
        <div className="grey-review-box">
          <div className="mb-2 pb-1">
            <div className="review-title1">{`${review.doctor.firstName} ${review.doctor.lastName}`}</div>
            <div>
              <span>{formatDate(review.feedbackCommentedAt, "ll")}</span>
              <span className="mx-2" style={{ color: "#e0e4dc" }}>
                &#8226;
              </span>
              <span>{formatDate(review.feedbackCommentedAt, "LT")}</span>
            </div>
          </div>

          <div>{review.feedbackComment}</div>
        </div>
      )}

      <button
        className="button button-round button-shadow button-width-large mt-4"
        onClick={() => onAction(review)}
      >
        {t(
          review.isFeedbackApproved
            ? "superAdmin.deactivateThisComment"
            : "superAdmin.activateThisComment"
        )}
      </button>
    </div>
  );
}
export default withTranslation()(PatientReviews);
