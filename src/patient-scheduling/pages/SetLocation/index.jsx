import React, { useState } from "react";
import styles from "./SetLocation.module.scss";
import { withTranslation } from "react-i18next";
import Select from "components/Select";
import Input from "components/Input";
import useSearchLocation from "../useSearchLocation";
import {
  useCities,
  useCountries,
  useStates,
} from "repositories/utility-repository";
import toast from "react-hot-toast";
import constants from "./../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { useAddLocationMutation } from "repositories/user-repository";

function SetLocation({ history, t }) {
  const searchLocation = useSearchLocation();
  const profile = useSelector((state) => state.userProfile.profile);
  const addLocationMutation = useAddLocationMutation();
  const dispatch = useDispatch();

  const [selectedCountry, setSelectedCountry] = useState(
    searchLocation.countryId
  );
  const [selectedState, setSelectedState] = useState(
    searchLocation.stateId ? searchLocation.stateId : null
  );
  const [selectedCity, setSelectedCity] = useState(
    searchLocation.cityId ? searchLocation.cityId : null
  );
  const [address, setAddress] = useState(
    searchLocation.street ? searchLocation.street : ""
  );

  const { data: countries } = useCountries();
  const { data: states } = useStates(selectedCountry);
  const { data: cities } = useCities(selectedState);

  const onConfirm = async () => {
    const payload = {};
    if (
      !isNaN(selectedCountry) &&
      countries.findIndex((it) => it.id === selectedCountry) !== -1
    ) {
      const country = countries.find((it) => it.id === selectedCountry);
      payload.countryName = country.name;
      payload.countryId = country.id;
    } else {
      payload.countryName = null;
      payload.countryId = null;
    }

    if (
      !isNaN(selectedState) &&
      states &&
      states.findIndex((it) => it.id === selectedState) !== -1
    ) {
      const state = states.find((it) => it.id === selectedState);
      payload.stateName = state.name;
      payload.stateId = state.id;
    } else {
      payload.stateName = null;
      payload.stateId = null;
    }

    if (
      !isNaN(selectedCity) &&
      cities &&
      cities.findIndex((it) => it.id === selectedCity) !== -1
    ) {
      const city = cities.find((it) => it.id === selectedCity);
      payload.cityName = city.name;
      payload.cityId = city.id;
    } else {
      payload.cityName = null;
      payload.cityId = null;
    }

    if (address && address.trim().length !== 0) {
      payload.street = address.trim();
    } else {
      payload.street = null;
    }

    if (
      profile === null ||
      (profile.role &&
        profile.role.systemRole !== constants.systemRoles.patient)
    ) {
      saveToLocalStorage(payload);
    } else {
      await save(payload);
    }
  };

  const saveToLocalStorage = (payload) => {
    localStorage.setItem("doctorSearchLocation", JSON.stringify(payload));
    toast.success(t("patient.searchLocationUpdated"));
    history.push(constants.routes.doctors);
  };

  const save = async (payload) => {
    try {
      await addLocationMutation.mutateAsync({
        countryId: payload.countryId,
        stateId: payload.stateId,
        cityId: payload.cityId,
        address: payload.street,
      });
      toast.success(t("patient.searchLocationUpdated"));
      dispatch({ type: "GET_PROFILE" });
      setTimeout(() => history.push(constants.routes.doctors), 1850);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className={styles["find-doctor-page"]}>
      <div className="container container-smd">
        <h2 class="page-title mt-3 mb-2">{t("patient.findDoctorsTitle")}</h2>
        <h5 className={styles["sub-heading"]}>
          {t("patient.selectLocations")}
        </h5>
        <div className="form-wrapper">
          <div className={styles["find-doctor-form"]}>
            <Select
              Title={t("form.fields.country")}
              Options={
                countries &&
                countries.map((it) => ({ id: it.id, name: it.name }))
              }
              selectedOption={selectedCountry}
              HandleChange={(e) => {
                setSelectedCountry(parseInt(e.target.value));
                setSelectedState(null);
                setSelectedCity(null);
                setAddress("");
              }}
              Name={"country"}
            />
            <Select
              Title={t("form.fields.province")}
              Options={
                states && states.map((it) => ({ id: it.id, name: it.name }))
              }
              selectedOption={selectedState}
              HandleChange={(e) => {
                setSelectedState(parseInt(e.target.value));
                setSelectedCity(null);
                setAddress("");
              }}
              Name={"Province"}
            />
            <Select
              Title={t("form.fields.city")}
              Options={
                cities && cities.map((it) => ({ id: it.id, name: it.name }))
              }
              selectedOption={selectedCity}
              HandleChange={(e) => setSelectedCity(parseInt(e.target.value))}
              Name={"coCityuntry"}
            />
            <Input
              Title={t("form.fields.street")}
              Type="text"
              Disabled={
                selectedCountry === null ||
                selectedState === null ||
                selectedCity === null
              }
              Placeholder={t("form.placeholder1", {
                field: t("form.fields.street"),
              })}
              Name={"Street"}
              HandleChange={(e) => setAddress(e.target.value)}
              Value={address}
            />
            <div className="btn-field">
              <button
                className="button button-round button-shadow"
                disabled={
                  selectedCountry === null || addLocationMutation.isLoading
                }
                onClick={onConfirm}
              >
                {t("form.fields.confirmLocation")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(SetLocation);
