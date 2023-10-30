import React, { useState } from "react";
import { Switch } from "react-router";
import { PersonnelRoutesContext } from "./PersonnelRoutesContext";
import PrivateRoute from "containers/privateRoute";
import ManagePersonnel from "./Manage-personnel";
import PersonnelDetail from "./Detail";
import constants from "./../../../constants";

function PersonnelRoutes() {
  const [pageNumber, setPageNumber] = useState(1);
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <PersonnelRoutesContext.Provider
      value={{
        pageNumber,
        setPageNumber,
        filter,
        setFilter,
        searchTerm,
        setSearchTerm,
      }}
    >
      <Switch>
        <PrivateRoute
          component={ManagePersonnel}
          path="/manage-personnel"
          roles={[constants.systemRoles.superAdmin]}
        />
        <PrivateRoute
          component={PersonnelDetail}
          path="/personnel/:personnelId"
          roles={[constants.systemRoles.superAdmin]}
        />
      </Switch>
    </PersonnelRoutesContext.Provider>
  );
}

export default PersonnelRoutes;
