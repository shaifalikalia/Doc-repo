import Page from "components/Page";
import React, { useState } from "react";
import InvoiceDetailModal from "./InvoiceDetailModal";
import Invoices from "./Invoices";
import Subscription from "./Subscription";
import { decodeId, encodeId } from "utils";

function AccountOwnerSubscriptionAndInvoices({ history, match }) {
  const accountOwnerId = decodeId(match.params.accountOwnerId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceEntry, setInvoiceEntry] = useState(null);

  return (
    <Page
      titleKey="superAdmin.accountOwnersSubscriptionDetails"
      onBack={() => history.push(`/account-owner/${encodeId(accountOwnerId)}`)}
    >
      <Subscription accountOwnerId={accountOwnerId} />

      <Invoices
        accountOwnerId={accountOwnerId}
        onItemClick={(_invoiceEntry) => {
          setIsModalOpen(true);
          setInvoiceEntry(_invoiceEntry);
        }}
      />

      <InvoiceDetailModal
        invoiceEntry={invoiceEntry}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setInvoiceEntry(null);
        }}
      />
    </Page>
  );
}

export default AccountOwnerSubscriptionAndInvoices;
