import React, { useState } from "react";
import PrivateRoute from "containers/privateRoute";
import ManageAccountOwner from "./Manage-owner";
import AccountOwnerDetail from "./Detail";
import AccountOwnerTransactionHistory from "./TransactionHistory";
import AccountOwnerSubscriptionAndInvoices from "./SubscriptionAndInvoices";
import { Switch } from "react-router";
import { AccountOwnerRoutesContext } from "./AccountOwnerRoutesContext";
import constants from "./../../../constants";

function AccountOwnerRoutes() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");

  return (
    <AccountOwnerRoutesContext.Provider
      value={{
        pageNumber,
        setPageNumber,
        searchTerm,
        setSearchTerm,
        filter,
        setFilter,
      }}
    >
      <Switch>
        <PrivateRoute
          component={ManageAccountOwner}
          path="/manage-owner"
          roles={[constants.systemRoles.superAdmin]}
        />
        <PrivateRoute
          exact
          component={AccountOwnerDetail}
          path="/account-owner/:accountOwnerId"
          roles={[constants.systemRoles.superAdmin]}
        />
        <PrivateRoute
          exact
          component={AccountOwnerTransactionHistory}
          path="/account-owner/:accountOwnerId/transaction-history"
          roles={[constants.systemRoles.superAdmin]}
        />
        <PrivateRoute
          exact
          component={AccountOwnerSubscriptionAndInvoices}
          path="/account-owner/:accountOwnerId/subscription-and-invoices"
          roles={[constants.systemRoles.superAdmin]}
        />
      </Switch>
    </AccountOwnerRoutesContext.Provider>
  );
}

export default AccountOwnerRoutes;
