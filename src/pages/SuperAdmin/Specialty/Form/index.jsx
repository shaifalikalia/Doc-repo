import constants from "./../../../../constants";
import React from "react";
import { useParams } from "react-router";
import AddSpecialty from "./AddSpecialty";
import UpdateSpecialty from "./UpdateSpecialty";
import { decodeId } from "utils";

export default function SpecialtyForm({ history, location }) {
  let { specialtyId } = useParams();
  specialtyId = decodeId(specialtyId);
  const { state } = location;

  let onBack = () => history.push(constants.routes.specialtyList);
  if (state !== undefined && state.previousPath) {
    onBack = () => history.push(state.previousPath);
  }

  if (specialtyId === undefined) {
    return <AddSpecialty onBack={onBack} />;
  } else if (!isNaN(specialtyId)) {
    return <UpdateSpecialty specialtyId={specialtyId} onBack={onBack} />;
  } else {
    onBack();
    return null;
  }
}
