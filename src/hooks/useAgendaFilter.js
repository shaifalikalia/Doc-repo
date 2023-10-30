import { useEffect, useState } from "react";
import constants from "../constants";
export default function useAgendaFilter() {
  //Office Filter for YourScheduler-Agenda
  let cachedOfficeFilter =
    sessionStorage.getItem(constants.localStorageKeys.agenda.officeFilter) ||
    null;
  cachedOfficeFilter = cachedOfficeFilter ? JSON.parse(cachedOfficeFilter) : [];

  const [selectedOfficeFilter, setOfficeFilter] = useState(cachedOfficeFilter);
  const [apiOffices, setApiOffices] = useState(cachedOfficeFilter);

  const resetFilters = () => {
    setOfficeFilter([]);
    setApiOffices([]);
  };

  useEffect(() => {
    sessionStorage.setItem(
      constants.localStorageKeys.agenda.officeFilter,
      JSON.stringify(apiOffices)
    );
  }, [apiOffices]);

  return {
    selectedOfficeFilter,
    setOfficeFilter,
    apiOffices,
    setApiOffices,
    resetFilters,
  };
}
