import Page from "components/Page";
import React, { useState } from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Card from "components/Card";
import styles from "./ManageCatalogue.module.scss";
import "./ManageCatalogue.scss";
import {
  Col,
  Form,
  Row,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Input from "components/Input";
import Tooltip from "reactstrap/lib/Tooltip";
import PriceDeliveryCard from "./components/PriceDeliveryCard";
import SetPriceModal from "./components/Modals/SetPriceModal";
import SetTaxPriceModal from "./components/Modals/SetTaxPriceModal";
import LocationDeliveryModal from "./components/Modals/LocationDeliveryModal";
import useAddNewItem from "./hooks/useAddNewItem";
import constants from "../../../constants";
import Loader from "components/Loader";
import { addDefaultSrc } from "utils";
import InfiniteScroll from "react-infinite-scroll-component";

const AddNewItem = ({ t, history }) => {
  const hookData = useAddNewItem({ t, history });
  const { state, otherData, methods } = hookData;
  const { inputData } = state;
  const { productTypeOptions, loading, title } = otherData;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  return (
    <>
      <LayoutVendor>
        <Page
          onBack={methods.onBack}
          className="catalogue-add-new-item"
          title={title}
        >
          {loading && <Loader />}
          <Card
            className={styles["new-item-card"]}
            radius="10px"
            marginBottom="10px"
            shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            cursor="default"
          >
            <Form>
              <Row className="flex-row-reverse">
                <Col lg={4}>
                  <div
                    className={
                      "profile-setup-block " + styles["form-profile-col"]
                    }
                  >
                    <div className="profile-form ">
                      <div className={"file-upload-container pl-0 "}>
                        <div className="file-upload-field">
                          <div className={"img1"}>
                            <img
                              src={
                                inputData.productImage.imageUrl ||
                                require("assets/images/vendor-dummy-profile.jpg")
                                  .default
                              }
                              alt="upload"
                              onError={(e) =>
                                addDefaultSrc(
                                  e,
                                  require("assets/images/vendor-dummy-profile.jpg")
                                    .default
                                )
                              }
                            />
                          </div>
                          <div className="ch-upload-button">
                            <input
                              id="fileUpload"
                              type="file"
                              accept={constants.vendor.acceptForProductImage}
                              onChange={methods.handleImageChange}
                            />
                            <span>
                              <img
                                src={
                                  require("assets/images/upload-image.svg")
                                    .default
                                }
                                alt="upload"
                              />
                            </span>
                          </div>
                        </div>
                        <span className="upload-help-text">
                          {t("clickHereToUploadPicture")}
                        </span>
                        {inputData.errors.productImage && (
                          <span className="error-msg text-md-center">
                            {inputData.errors.productImage}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={8}>
                  <div className={styles["form-input-col"]}>
                    <Input
                      Title={t("vendorManagement.sKUProductID")}
                      Type="text"
                      Name={"sKUProductID"}
                      Placeholder={t("form.placeholder1", {
                        field: t("vendorManagement.sKUProductID"),
                      })}
                      Value={inputData.productId || ""}
                      MaxLength={32}
                      HandleChange={methods.handleProductId}
                      Error={inputData.errors.productId}
                    />
                    <Input
                      Title={t("vendorManagement.productName")}
                      Type="text"
                      Name={"productName"}
                      Placeholder={t("form.placeholder1", {
                        field: t("vendorManagement.productName"),
                      })}
                      Value={inputData.productName || ""}
                      MaxLength={120}
                      HandleChange={methods.handleProductName}
                      Error={inputData.errors.productName}
                    />
                    <div className="c-field">
                      <label>{t("vendorManagement.productType")}</label>
                      <Dropdown
                        isOpen={dropdownOpen}
                        toggle={toggle}
                        className="select-common-dropdown"
                      >
                        <DropdownToggle
                          caret={false}
                          className={
                            "selected-item c-form-control justify-content-between " +
                            styles["selected-product-type"]
                          }
                          tag="div"
                        >
                          <span className="text-break">
                            {inputData.productType?.name}
                          </span>
                          <img
                            className={styles["product-img"]}
                            src={require("assets/images/caret.svg").default}
                            alt="caret"
                          />
                        </DropdownToggle>
                        <DropdownMenu
                          id="product-types-list"
                          right
                          className={styles["product-type-select"]}
                        >
                          <InfiniteScroll
                            dataLength={productTypeOptions.length}
                            hasMore={otherData.hasMoreProductTypes}
                            next={methods.loadMoreProductTypes}
                            scrollableTarget="product-types-list"
                          >
                            {productTypeOptions?.map((op) => {
                              const { id, name } = op;
                              return (
                                <DropdownItem
                                  onClick={() => methods.handleProductType(op)}
                                  key={id}
                                >
                                  <span>{name}</span>
                                </DropdownItem>
                              );
                            })}
                          </InfiniteScroll>
                        </DropdownMenu>
                      </Dropdown>
                      {inputData.errors.productType && (
                        <span className="error-msg">
                          {inputData.errors.productType}
                        </span>
                      )}
                    </div>
                    <Row>
                      <Col sm={6}>
                        <Input
                          Title={t("vendorManagement.minQuantityOrder")}
                          Type="text"
                          Name={"minQuantityOrder"}
                          Placeholder={t("form.placeholder1", {
                            field: t("vendorManagement.minQuantityOrder"),
                          })}
                          Value={inputData.minQuantityOrder || ""}
                          Error={inputData.errors.minQuantityOrder}
                          HandleChange={methods.handleMinQuantityOrder}
                          MaxLength={5}
                        />
                      </Col>
                      <Col sm={6}>
                        <Input
                          Title={t("vendorManagement.maxQuantityOrder")}
                          Type="text"
                          Name={"maxQuantityOrder"}
                          Placeholder={t("form.placeholder1", {
                            field: t("vendorManagement.maxQuantityOrder"),
                          })}
                          Value={inputData.maxQuantityOrder || ""}
                          Error={inputData.errors.maxQuantityOrder}
                          HandleChange={methods.handleMaxQuantityOrder}
                          MaxLength={5}
                        />
                      </Col>
                      <Col sm={6}>
                        <Input
                          Title={t("vendorManagement.totalQuantityInInventory")}
                          Type="text"
                          Name={"totalQuantityInInventory"}
                          Placeholder={t("form.placeholder1", {
                            field: t(
                              "vendorManagement.totalQuantityInInventory"
                            ),
                          })}
                          Value={inputData.totalQuantityInInventory || ""}
                          Error={inputData.errors.totalQuantityInInventory}
                          HandleChange={methods.handleTotalQuantityInInventory}
                          MaxLength={5}
                        />
                      </Col>
                      <Col sm={6}>
                        <div className={"d-flex  " + styles["tooltip-label"]}>
                          <label>
                            {t("vendorManagement.quantityShortageReminder")}
                          </label>
                          <img
                            onClick={() => {
                              methods.setTooltipReminderOpen(true);
                            }}
                            className="ml-2"
                            id="TooltipRemider"
                            src={
                              require("assets/images/info_black-tooltip.svg")
                                .default
                            }
                            alt="icon"
                          />

                          <Tooltip
                            className="new-item-card-catalogue-tooltip"
                            isOpen={state.tooltipReminderOpen}
                            placement="top"
                            target="TooltipRemider"
                            toggle={() => {
                              methods.setTooltipReminderOpen(
                                !state.tooltipReminderOpen
                              );
                            }}
                          >
                            {t("vendorManagement.reminderTooltipDesc")}
                          </Tooltip>
                        </div>
                        <Input
                          Type="text"
                          Name={"quantityShortageReminder"}
                          Placeholder={t("form.placeholder1", {
                            field: t(
                              "vendorManagement.quantityShortageReminder"
                            ),
                          })}
                          Value={inputData.quantityShortageReminder || ""}
                          Error={inputData.errors.quantityShortageReminder}
                          HandleChange={methods.handleQuantityShortageReminder}
                          MaxLength={5}
                        />
                      </Col>
                    </Row>
                    <div className="c-field">
                      <label>{t("vendorManagement.productDescription")}</label>
                      <textarea
                        placeholder={t("form.placeholder1", {
                          field: t("vendorManagement.productDescription"),
                        })}
                        className={
                          "c-form-control " + styles["custom-textarea-control"]
                        }
                        name="productDescription"
                        maxLength="400"
                        value={inputData.productDescription || ""}
                        onChange={methods.handleProductDescription}
                      ></textarea>
                      {inputData.errors.productDescription && (
                        <span className="error-msg">
                          {inputData.errors.productDescription}
                        </span>
                      )}
                    </div>

                    <PriceDeliveryCard
                      id="price-details"
                      saved={inputData.priceDetails.saved}
                      Title={t("vendorManagement.unitPrice")}
                      SubTitle={t("vendorManagement.setUnitPriceForTheItem")}
                      setBtnText={t("vendorManagement.setPrice")}
                      viewBtnText={t("vendorManagement.viewDetails")}
                      savedDetailText={
                        inputData.priceDetails.samePriceForAll
                          ? t("vendorManagement.samePriceForAll")
                          : t("vendorManagement.differentPricesSet")
                      }
                      priceText={
                        inputData.priceDetails.samePriceForAll
                          ? `CAD ${inputData.priceDetails.unitPrice}`
                          : ""
                      }
                      setModal={methods.openPriceModal}
                      error={inputData.errors.priceDetails}
                    />
                    <div className={styles["unit-tax-price"]}>
                      <PriceDeliveryCard
                        saved={inputData.taxDetails.saved}
                        Title={t("vendorManagement.unitTaxPrice")}
                        SubTitle={t(
                          "vendorManagement.setUnitTaxPriceForTheItem"
                        )}
                        setBtnText={t("vendorManagement.setTaxPrice")}
                        viewBtnText={t("vendorManagement.changeTaxPrice")}
                        savedDetailText={
                          inputData.taxDetails.selectedTax?.name || ""
                        }
                        setModal={methods.openTaxModal}
                        error={inputData.errors.taxDetails}
                      />
                    </div>
                    <PriceDeliveryCard
                      id="location-details"
                      saved={inputData.deliveryDetails.saved}
                      Title={t("vendorManagement.locationDeliveryTime")}
                      SubTitle={t("vendorManagement.setDeliveryTimeForTheItem")}
                      setBtnText={t("vendorManagement.setDeliverTime")}
                      viewBtnText={t("vendorManagement.seeDeliveryTime")}
                      savedDetailText={t(
                        "vendorManagement.deliveryTimeSetForDifferentLocations"
                      )}
                      setModal={methods.openDeliveryModal}
                      error={inputData.errors.deliveryDetails}
                    />

                    <div className={styles["label-big"]}>
                      {t("vendorManagement.customersDiscount")}
                    </div>
                    <Row>
                      <Col sm="6">
                        <Input
                          Id="discount-details"
                          Value={inputData.vipDiscount || ""}
                          HandleChange={methods.handleVipDiscount}
                          MaxLength={6}
                          Title={t("vendorManagement.vIPCustomersDiscount")}
                          Type="text"
                          Placeholder={t("form.placeholder1", {
                            field: t("vendorManagement.vIPCustomersDiscount"),
                          })}
                        />
                      </Col>
                      <Col sm="6">
                        <Input
                          Value={inputData.normalDiscount || ""}
                          HandleChange={methods.handleNormalDiscount}
                          MaxLength={6}
                          Title={t("vendorManagement.normalCustomersDiscount")}
                          Type="text"
                          Placeholder={t("form.placeholder1", {
                            field: t(
                              "vendorManagement.normalCustomersDiscount"
                            ),
                          })}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <button
                className="button w-sm-100 button-round button-shadow"
                title={t("save")}
                onClick={methods.saveProductDetails}
              >
                {t("save")}
              </button>
            </Form>
          </Card>
        </Page>
      </LayoutVendor>
      {state.isSetPriceModalOpen && <SetPriceModal hookData={hookData} />}
      {state.isSetTaxPriceModalOpen && <SetTaxPriceModal hookData={hookData} />}
      {state.isLocationDeliveryModalOpen && (
        <LocationDeliveryModal hookData={hookData} />
      )}
    </>
  );
};

export default withTranslation()(AddNewItem);
