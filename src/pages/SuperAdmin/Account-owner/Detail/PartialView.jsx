import Page from "components/Page";
import React from "react";

export default function PartialView({ onBack, detailCard }) {
  return (
    <Page titleKey={"superAdmin.accountOwnerDetail"} onBack={onBack}>
      {detailCard}
    </Page>
  );
}
