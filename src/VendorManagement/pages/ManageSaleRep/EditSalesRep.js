import Page from "components/Page";
import React, { Fragment } from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Card from "components/Card";
import styles from "./ManageSaleRep.module.scss";
import { Col, Form, Row } from "reactstrap";
import Input from "components/Input";
import useEditSalesRep from "./hooks/useEditSalesRep";
import Loader from "components/Loader";

const EditSalesRep = ({ t }) => {
  const { data, methods } = useEditSalesRep({ t });
  const { inputData, loading } = data;
  const { onBack, handleUpdateDetails } = methods;

  return (
    <Fragment>
      <LayoutVendor>
        <Page
          onBack={onBack}
          title={t("vendorManagement.editSalesRepresentative")}
        >
          {loading && <Loader />}
          <Card
            className={styles["vendor-card"]}
            radius="10px"
            marginBottom="10px"
            shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
            cursor="default"
          >
            <Form>
              <Row>
                <Col lg={6}>
                  <Input
                    Value={inputData.firstName}
                    HandleChange={methods.handleFirstName}
                    Error={inputData.errors.firstName}
                    MaxLength={60}
                    Title={t("form.fields.firstName")}
                    Type="text"
                    Placeholder={t("form.placeholder1", {
                      field: t("form.fields.firstName"),
                    })}
                  />
                  <Input
                    Value={inputData.lastName}
                    HandleChange={methods.handleLastName}
                    Error={inputData.errors.lastName}
                    MaxLength={60}
                    Title={t("form.fields.lastName")}
                    Type="text"
                    Placeholder={t("form.placeholder1", {
                      field: t("form.fields.lastName"),
                    })}
                  />
                  <Input
                    Value={inputData.email}
                    HandleChange={() => {}}
                    Error={inputData.errors.email}
                    MaxLength={255}
                    Title={t("emailAddress")}
                    Type="email"
                    Name={"emailAddress"}
                    Disabled={true}
                    Placeholder={t("form.placeholder1", {
                      field: t("emailAddress"),
                    })}
                  />
                  <Input
                    Value={inputData.contactNumber}
                    Error={inputData.errors.contactNumber}
                    Title={t("form.fields.phoneNumber")}
                    Type="text"
                    MaxLength="12"
                    Name={"phoneNumber"}
                    HandleChange={methods.handleContactNumber}
                    Placeholder={t("form.placeholder1", {
                      field: t("form.fields.phoneNumber"),
                    })}
                  />
                </Col>
              </Row>
              <div className="d-sm-flex mb-4">
                <button
                  className="button button-round button-shadow mr-md-4 w-sm-100 mb-md-2"
                  title={t("save")}
                  onClick={handleUpdateDetails}
                >
                  {t("save")}
                </button>
                <button
                  className="button button-round  button-dark   button-border btn-mobile-link mb-md-2"
                  title={t("cancel")}
                  onClick={onBack}
                >
                  {t("cancel")}
                </button>
              </div>
            </Form>
          </Card>
        </Page>
      </LayoutVendor>
    </Fragment>
  );
};

export default withTranslation()(EditSalesRep);
