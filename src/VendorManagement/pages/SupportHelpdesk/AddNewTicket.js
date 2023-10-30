import React from "react";
import Page from "components/Page";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Card from "components/Card";
import styles from "./SupportHelpdesk.module.scss";
import "./supportHelpDesk.scss";
import { Col, Row } from "reactstrap";
import CustomSelect from "components/CustomSelect";
import Loader from "components/Loader";
import { useAddTicket } from "./Hooks/useAddTicket";
import SelectOrder from "./components/SelectOrder";

const AddNewTicket = ({ t }) => {
  let {
    formsValues,
    isLoading,
    errors,
    ticketTypeList,
    orderList,
    hasMore,
    selectOrderModalOpen,
    searchText,
    showNoRecord,
    handleSearch,
    goBack,
    handleSubmit,
    handleChangeInput,
    handleChangeSelect,
    setFormsValues,
    goToNextPage,
    isOpenSelectOrder,
    isCloseSelectOrder,
    closeModelClickOnSaveBtn,
  } = useAddTicket({ t });

  const { ticketType, selectOrder, description, assignOrder } = formsValues;

  const getSelectedOption = () => {
    const selectedData =
      ticketTypeList?.find(
        (val) => val.id.toString() === ticketType?.toString()
      ) || {};
    return selectedData.ticketType;
  };

  const handleCustomDropDown = (value, name) => {
    const eventObject = {
      target: {
        value: value.id.toString(),
        name: name,
      },
    };

    handleChangeSelect(eventObject);
  };

  return (
    <LayoutVendor>
      <Page
        className="support-helpdesk-page"
        onBack={goBack}
        title={t("vendorManagement.addNewTicket")}
      >
        {isLoading && <Loader />}
        <Card
          className={styles["helpdesk-card"]}
          radius="10px"
          marginBottom="10px"
          shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
          cursor="default"
        >
          <Row>
            <Col lg={6}>
              <div className="custom-dropdown-only">
                <CustomSelect
                  Title={t("vendorManagement.ticketType")}
                  options={
                    ticketTypeList?.map((item) => ({
                      ...item,
                      name: item.ticketType,
                    })) || []
                  }
                  id={"ticketType"}
                  dropdownClasses={"custom-select-scroll"}
                  selectedOption={{ name: getSelectedOption() }}
                  selectOption={(value) =>
                    handleCustomDropDown(value, "ticketType")
                  }
                />
                {errors?.ticketType && (
                  <span className="error-msg">{errors.ticketType}</span>
                )}
              </div>

              <div className="c-field">
                <label>{t("vendorManagement.assignOrder")}</label>
                <div className="ch-radio">
                  <label
                    className="mr-5 pb-md-0"
                    onClick={() =>
                      setFormsValues((pre) => ({ ...pre, assignOrder: true }))
                    }
                  >
                    <input
                      type="radio"
                      name="assignOrder"
                      checked={assignOrder}
                    />
                    <span> Yes </span>
                  </label>

                  <label
                    className="pb-md-0"
                    onClick={() =>
                      setFormsValues((pre) => ({ ...pre, assignOrder: false }))
                    }
                  >
                    <input
                      type="radio"
                      name="assignOrder"
                      checked={!assignOrder}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
              {assignOrder && (
                <div className="c-field">
                  <label className="c-field-label  d-flex justify-content-between custom-above">
                    {t("vendorManagement.orderNumber")}
                    <span className="link-btn" onClick={isOpenSelectOrder}>
                      {t("vendorManagement.selectOrder")}
                    </span>
                  </label>

                  <div className="c-form-control ">
                    {selectOrder ? (
                      <span>{selectOrder}</span>
                    ) : (
                      <span>
                        {" "}
                        {t("vendorManagement.noOrderNumberSelected")}
                      </span>
                    )}
                  </div>
                  {errors?.selectOrder && !selectOrder && (
                    <span className="error-msg">{errors.selectOrder}</span>
                  )}
                </div>
              )}

              <div className="c-field">
                <label>{t("vendorManagement.description")}</label>
                <textarea
                  placeholder={t("form.placeholder1", {
                    field: t("vendorManagement.description"),
                  })}
                  className={
                    "c-form-control " + styles["custom-textarea-control"]
                  }
                  name="description"
                  value={description}
                  maxLength="400"
                  onChange={handleChangeInput}
                ></textarea>

                {errors.description && (
                  <span className="error-msg">{errors.description}</span>
                )}
              </div>
            </Col>
          </Row>
          <div className="d-md-flex mb-md-2">
            <button
              className="button button-round button-shadow mr-md-4 mb-md-3 w-sm-100"
              title={t("vendorManagement.createTicket")}
              onClick={handleSubmit}
            >
              {t("vendorManagement.createTicket")}
            </button>
            <button
              className="button button-round  button-dark btn-mobile-link mb-md-3  button-border"
              title={t("cancel")}
              onClick={goBack}
            >
              {t("cancel")}
            </button>
          </div>
          <SelectOrder
            orderList={orderList}
            isOpen={selectOrderModalOpen}
            hasMore={hasMore}
            searchText={searchText}
            showNoRecord={showNoRecord}
            handleSearch={handleSearch}
            selectOrder={selectOrder}
            setFormsValues={setFormsValues}
            goToNextPage={goToNextPage}
            closeModel={isCloseSelectOrder}
            closeModelClickOnSaveBtn={closeModelClickOnSaveBtn}
          />
        </Card>
      </Page>
    </LayoutVendor>
  );
};

export default withTranslation()(AddNewTicket);
