import Page from "components/Page";
import React, { Fragment } from "react";
import LayoutVendor from "../../components/LayoutVendor";
import { withTranslation } from "react-i18next";
import Card from "components/Card";
import styles from "./ManageCustomers.module.scss";
import { Col, Form, Row } from "reactstrap";
import Input from "components/Input";
import useInviteCustomers from "./hooks/useInviteCustomers";
import Loader from "components/Loader";

const InviteCustomers = ({ t }) => {
  const { data, methods } = useInviteCustomers({ t });
  const { firstName, lastName, email, errors, loading } = data;
  const { handleEmail, handleFirstName, handleLastName, onBack, sendInvite } =
    methods;

  return (
    <Fragment>
      <LayoutVendor>
        <Page onBack={onBack} title={t("vendorManagement.inviteCustomers")}>
          {loading && <Loader />}
          <div className={styles["sub-title"]}>
            {t("vendorManagement.inviteCustomersTitleDesc")}
          </div>
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
                    Value={firstName}
                    HandleChange={handleFirstName}
                    MaxLength="50"
                    Title={t("form.fields.firstName")}
                    Type="text"
                    Name={"firstName"}
                    Placeholder={t("form.placeholder1", {
                      field: t("form.fields.firstName"),
                    })}
                    Error={errors.firstName}
                  />
                  <Input
                    Value={lastName}
                    HandleChange={handleLastName}
                    MaxLength="50"
                    Title={t("form.fields.lastName")}
                    Type="text"
                    Name={"lastName"}
                    Placeholder={t("form.placeholder1", {
                      field: t("form.fields.lastName"),
                    })}
                    Error={errors.lastName}
                  />
                  <Input
                    Value={email}
                    HandleChange={handleEmail}
                    MaxLength="256"
                    Title={t("emailAddress")}
                    Type="email"
                    Name={"emailAddress"}
                    Placeholder={t("form.placeholder1", {
                      field: t("emailAddress"),
                    })}
                    Error={errors.email}
                  />
                </Col>
              </Row>
              <div className="d-sm-flex mt-sm-2 mb-sm-4 mb-4">
                <button
                  onClick={sendInvite}
                  className="button button-round button-shadow mr-md-4 mb-2 w-sm-100"
                  title={t("vendorManagement.sendInvite")}
                >
                  {t("vendorManagement.sendInvite")}
                </button>
                <button
                  onClick={onBack}
                  className="button button-round  button-dark   button-border btn-mobile-link mb-md-2"
                  title={t("cancel")}
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

export default withTranslation()(InviteCustomers);
