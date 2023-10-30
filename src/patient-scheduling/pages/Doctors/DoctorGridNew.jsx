import React from "react";
import styles from "./Home.module.scss";
import constants from "../../../constants";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import Empty from "components/Empty";
import qs from "query-string";
import DoctorCardNew from "./DoctorCardNew";
import Card from "components/Card";
import DoctorsMap from "./DoctorsMap";
import toast from "react-hot-toast";
import { encodeId } from "utils";

function DoctorGridNew({
  items,
  pageNumber,
  onPageChange,
  total,
  pageSize,
  searchTerm,
  t,
  history,
  ...props
}) {
  const {
    center,
    activeMarker,
    setActiveMarker,
    placeService,
    selectedPlace,
    showMobileMap,
  } = props;
  const { specialtyId, specialtyName } = props;

  const handleGooglePlacesError = (status) => {
    toast.error(t("patient.googleError", { status }));
  };

  const handleRequestAppointment = (doctor, memberId) => {
    // let doctorId;
    // let officeId;
    const searchParams = {};

    let state = {};
    if (pageNumber > 1) {
      state.pageNumber = pageNumber;
    }
    if (searchTerm) {
      state.search = searchTerm;
    }
    if (doctor) {
      state.doctor = doctor;
    }
    if (specialtyId && specialtyName) {
      state.specialtyId = encodeId(specialtyId);
      state.specialtyName = specialtyName;
    }
    if (selectedPlace) {
      //Place selected place to the state so that we can show same place when user comes back.
      const {
        geometry: { location },
        formatted_address,
        place_id,
        locationInputText,
      } = selectedPlace;
      state.selectedPlace = {
        formatted_address,
        locationInputText,
        place_id,
        geometry: {
          location: {
            lat:
              typeof location.lat === "function"
                ? location.lat()
                : location.lat,
            lng:
              typeof location.lng === "function"
                ? location.lng()
                : location.lng,
          },
        },
      };
    }
    if (doctor.isGoogleDoctor) {
      const placeId = doctor.placeId;
      placeService?.getDetails({ placeId }, (place, status) => {
        if (status === "OK") {
          const {
            formatted_phone_number,
            international_phone_number,
            website,
            utc_offset_minutes,
            opening_hours,
            formatted_address,
          } = place;
          state.doctor.phoneNumber =
            international_phone_number || formatted_phone_number;
          state.doctor.website = website;
          state.doctor.utcOffset = utc_offset_minutes;
          state.doctor.address = formatted_address;
          if (opening_hours?.weekday_text) {
            state.doctor.businessHours = opening_hours.weekday_text;
          }

          if (memberId) {
            searchParams.memberId = memberId;
          }

          history.push({
            pathname: constants.routes.requestAnAppointment,
            search: qs.stringify(searchParams),
            state,
          });
        } else {
          handleGooglePlacesError(status);
          return;
        }
      });
    } else {
      searchParams.doctorId = doctor.id;
      searchParams.officeId = doctor.office.id;
      searchParams.memberId = memberId;

      // if(memberId){
      // }

      history.push({
        pathname: constants.routes.requestAnAppointment,
        search: doctor.isGoogleDoctor ? null : qs.stringify(searchParams),
        state,
      });
    }
  };

  const handleBookAppointment = (doctor, memberId) => {
    let state = {};
    if (pageNumber > 1) {
      state.pageNumber = pageNumber;
    }
    if (searchTerm) {
      state.search = searchTerm;
    }
    if (specialtyId && specialtyName) {
      state.specialtyId = encodeId(specialtyId);
      state.specialtyName = specialtyName;
    }
    if (selectedPlace) {
      //Place selected place to the state so that we can show same place when user comes back.
      const {
        geometry: { location },
        formatted_address,
        place_id,
        locationInputText,
      } = selectedPlace;
      state.selectedPlace = {
        formatted_address,
        locationInputText,
        place_id,
        geometry: {
          location: {
            lat:
              typeof location.lat === "function"
                ? location.lat()
                : location.lat,
            lng:
              typeof location.lng === "function"
                ? location.lng()
                : location.lng,
          },
        },
      };
    }

    const searchParams = { doctorId: doctor.id, officeId: doctor?.office?.id };

    if (memberId) {
      searchParams.memberId = memberId;
    }

    const path = {
      pathname: constants.routes.doctor,
      search: qs.stringify(searchParams),
      state,
    };

    history.push(path);
  };

  const handleCall = (doctor) => {
    if (doctor.isGoogleDoctor) {
      const placeId = doctor.placeId;
      placeService?.getDetails({ placeId }, (place, status) => {
        if (status === "OK") {
          const { formatted_phone_number, international_phone_number } = place;
          if (formatted_phone_number || international_phone_number) {
            window.open(
              `tel:${international_phone_number || formatted_phone_number}`,
              "_self"
            );
          } else {
            toast.error(t("patient.noPhoneError"));
          }
        } else {
          handleGooglePlacesError(status);
        }
      });
    } else {
      if (doctor.contactNumber) {
        window.open(`tel:${doctor.contactNumber}`, "_self");
      } else {
        toast.error(t("patient.noPhoneError"));
      }
    }
  };

  const clickHandlers = {
    handleBookAppointment,
    handleRequestAppointment,
    handleCall,
  };

  let content = null;
  if (items.length > 0) {
    content = items.map((it, i) => {
      return (
        <DoctorCardNew
          key={i}
          doctor={it}
          setActiveMarker={setActiveMarker}
          clickHandlers={clickHandlers}
        />
      );
    });
  } else {
    content = (
      <div className={styles["empty-box"]}>
        <Empty Message={t("noDoctorFound")} />
      </div>
    );
  }

  return (
    <>
      <Card
        className={styles["doctor-map-main"]}
        radius="10px"
        padding="0"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.06)"
      >
        <div className="row">
          <div className="col-lg-8">
            <div
              className={`${styles["doctor-grid"]} ${
                showMobileMap ? styles["show-map"] : ""
              }`}
            >
              {content}
              <PaginationProvider
                pagination={paginationFactory({
                  custom: true,
                  sizePerPage: pageSize,
                  totalSize: total,
                  page: pageNumber,
                  onPageChange: onPageChange,
                })}
              >
                {({ paginationProps, paginationTableProps }) => {
                  return (
                    <div className="data-table-block mobile-pagination-center">
                      {/* Paginator component needs table to work, this is why we have used it.  */}
                      <div style={{ display: "none" }}>
                        <BootstrapTable
                          keyField="id"
                          data={[]}
                          columns={[{ text: "sometext" }]}
                          {...paginationTableProps}
                        />
                      </div>

                      <div className="pagnation-block">
                        {total > pageSize && (
                          <PaginationListStandalone {...paginationProps} />
                        )}
                      </div>
                    </div>
                  );
                }}
              </PaginationProvider>
            </div>
          </div>
          <div className="col-lg-4">
            <div
              className={`${styles["map-col"]} ${
                showMobileMap ? styles["show-map"] : ""
              }`}
            >
              <DoctorsMap
                center={center}
                items={items}
                activeMarker={activeMarker}
                setActiveMarker={setActiveMarker}
                clickHandlers={clickHandlers}
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

export default DoctorGridNew;
