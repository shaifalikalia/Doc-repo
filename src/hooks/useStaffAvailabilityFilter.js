import { useEffect, useState } from "react";
import constants from "../constants";
export default function useStaffAvailabilityFilter() {
  //Office Filter for YourScheduler-Agenda
  let cachedFilters =
    sessionStorage.getItem(
      constants.localStorageKeys.staffAvailablilityFilter
    ) || null;
  cachedFilters = cachedFilters
    ? JSON.parse(cachedFilters)
    : { apiOffices: [], apiEmps: [] };

  const [selectedOfficeFilter, setOfficeFilter] = useState(
    cachedFilters.apiOffices
  );
  const [selectedEmpFilter, setEmpFilter] = useState(cachedFilters.apiEmps);
  const [apiOffices, setApiOffices] = useState(cachedFilters.apiOffices);
  const [apiEmps, setApiEmps] = useState(cachedFilters.apiEmps);
  const [employeeList, setEmployeeList] = useState([]);

  const resetFilters = () => {
    setOfficeFilter([]);
    setEmpFilter([]);
    setApiEmps([]);
    setApiOffices([]);
    setEmployeeList([]);
  };

  useEffect(() => {
    const dataToCache = {
      apiOffices,
      apiEmps,
    };
    sessionStorage.setItem(
      constants.localStorageKeys.staffAvailablilityFilter,
      JSON.stringify(dataToCache)
    );
  }, [apiOffices, apiEmps]);

  return {
    selectedOfficeFilter,
    selectedEmpFilter,
    apiOffices,
    apiEmps,
    employeeList,
    setOfficeFilter,
    setEmpFilter,
    setApiOffices,
    setApiEmps,
    resetFilters,
    setEmployeeList,
  };
}
