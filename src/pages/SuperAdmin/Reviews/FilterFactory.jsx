import React from "react";
import Dropdown from "./Filters/Dropdown";
import SearchInput from "./Filters/SearchInput";
import useTabIndex from "./useTabIndex";

export default function FilterFactory() {
  const tab = useTabIndex();

  switch (tab) {
    case 1:
      return <Dropdown />;
    case 2:
      return (
        <SearchInput key={1} placeholderKey="superAdmin.searchByPatientName" />
      );
    case 3:
      return (
        <SearchInput key={2} placeholderKey="superAdmin.searchByDoctorName" />
      );
    default:
      return null;
  }
}
