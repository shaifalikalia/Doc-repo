import Page from "components/Page";
import React, { Fragment } from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Card from "components/Card";
import styles from "./ManageSaleRep.module.scss";
import "./ManageSaleRep.scss";
import { Col, Form, Row } from "reactstrap";
import Input from "components/Input";
import useInviteSalesRep from "./hooks/useInviteSalesRep";
import Loader from "components/Loader";

const InviteNewSalesRep = ({ t }) => {
  const {
    state: { inputData },
    methods,
    otherData: { loading },
  } = useInviteSalesRep({ t });

  return (
    <Fragment>
      <LayoutVendor>
        <Page
          onBack={methods.onBack}
          className="sales-representative-detail-page"
          title={t("vendorManagement.inviteNewSalesRepresentative")}
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
                    HandleChange={methods.handleEmail}
                    Error={inputData.errors.email}
                    MaxLength={255}
                    Title={t("emailAddress")}
                    Type="email"
                    Name={"emailAddress"}
                    Placeholder={t("form.placeholder1", {
                      field: t("emailAddress"),
                    })}
                  />
                </Col>
              </Row>
              <div className="d-sm-flex mb-4">
                <button
                  className="button button-round button-shadow mr-md-2 mb-1 w-sm-100"
                  title={t("vendorManagement.sendInvite")}
                  onClick={methods.sendInvite}
                >
                  {t("vendorManagement.sendInvite")}
                </button>
                <button
                  type="button"
                  className="button button-round  button-dark mb-md-1 btn-mobile-link  button-border"
                  title={t("cancel")}
                  onClick={methods.onBack}
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

export default withTranslation()(InviteNewSalesRep);
