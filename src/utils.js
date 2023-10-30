import constants from "./constants";
import moment from "moment-timezone";
import toast from "react-hot-toast";
import FileSaver from "file-saver";
import { sortBy } from "lodash";
import defaultStaffRounded from "assets/images/staff-default-rounded.png";
import defaultStaffCircular from "assets/images/staff-default.svg";

const ics = require("ics");

export function formatDate(date, format) {
  const localDate = toLocalDate(date);
  if (format) return moment(localDate).format(format);
  return moment(localDate).format("MMM DD, YYYY");
}

export function toLocalDate(utcDate) {
  const localDate = new Date(utcDate);
  return localDate;
}

export function setTimeToStartTime(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
}

export function constructMomentFromTime(hours, minutes, seconds = 0) {
  const m = moment();
  return m.hours(hours).minutes(minutes).seconds(seconds);
}

export function encodeId(id) {
  return window.btoa(unescape(encodeURIComponent( id )));
}

export function decodeId(encodedId) {
  try {
    if(!encodedId) return encodedId
    return decodeURIComponent(escape(window.atob( encodedId )));

  } catch (error) {
    window.location.replace(window.location.origin + '/404')
  }
}

export function getDoctorFullName(firstName, lastName, titleId) {
  if (titleId === constants.titleIds.dr) {
    return `${
      constants.titles.find((it) => it.id === constants.titleIds.dr).text
    } ${firstName} ${lastName}`;
  }

  return `${firstName} ${lastName}`;
}

export const getFullAddress = (location, t) => {
  let fullAddress = "";
  const address = location?.address || "";
  const city = location?.city || "";
  const state = location?.state || "";
  const country = location?.country || "";
  if (address && (city || state || country)) {
    fullAddress =
      address +
      (city ? ", " + city : city) +
      (city || state ? ", " + state : state) +
      (city || state || country ? ", " + country : country);
  }
  return fullAddress ? fullAddress : t("notAdded");
};

/*** Generate Weekdays  ***/
export function generateWeek(startDate, endDate) {
  const dates = [];

  const currDate = moment(startDate).subtract(1, "days");

  while (currDate.add(1, "days").diff(endDate) < 0) {
    dates.push({
      mDate: currDate.clone().format("MMM DD, ddd"),
      date: currDate.clone(),
    });
  }

  return dates;
}

// generateCalanderMonthView
export function generateCalanderMonthView(currentMoment) {
  let startDate = moment(currentMoment).startOf("month").startOf("isoweek");
  let endDate = moment(currentMoment).endOf("month").endOf("isoweek");

  const currDate = moment(startDate).subtract(1, "days");

  let dates = [];
  while (currDate.add(1, "days").diff(endDate) < 0) {
    dates.push({
      mDate: currDate.clone().format("MMM DD, ddd"),
      date: currDate.clone(),
      openModel: false,
      isData: true,
    });
  }
  return dates;
}

export function generateCalanderMonthViewEvent(currentMoment) {
  let startDate = moment(currentMoment).startOf("month").startOf("isoweek");
  let endDate = moment(currentMoment).endOf("month");

  const currDate = moment(startDate).subtract(1, "days");

  let dates = [];
  while (currDate.add(1, "days").diff(endDate) < 0) {
    dates.push({
      mDate: currDate.clone().format("MMM DD, ddd"),
      date: currDate.clone(),
      openModel: false,
      isData: true,
    });
  }
  return dates;
}

export function generateMonth(currentMoment) {
  let startDate = moment(currentMoment).startOf("month");
  let endDate = moment(currentMoment).endOf("month");

  const currDate = moment(startDate).subtract(1, "days");

  let dates = [];
  while (currDate.add(1, "days").diff(endDate) < 0) {
    dates.push({
      mDate: currDate.clone().format("MMM DD, ddd"),
      date: currDate.clone(),
    });
  }
  return dates;
}

/*** Generate Month  ***/
export function fillDates(currentMoment) {
  const firstOfMonth = moment(currentMoment).startOf("month").day();
  const lastOfMonth = moment(currentMoment).endOf("month").day();

  const firstDayOfGrid = moment(currentMoment)
    .startOf("month")
    .subtract(firstOfMonth, "days");
  const lastDayOfGrid = moment(currentMoment)
    .endOf("month")
    .subtract(lastOfMonth, "days")
    .add(7, "days");

  const startCalendar = firstDayOfGrid.date();
  return this.rangeArray(
    startCalendar,
    startCalendar + lastDayOfGrid.diff(firstDayOfGrid, "days") - 1
  ).map((date) => {
    return moment(firstDayOfGrid).date(date);
  });
}

export function updateTimeToUpcomingQuater(date) {
  if (date && new Date(date)) {
    let datetime = new Date(date);

    let hours = datetime.getHours();
    let minutes = datetime.getMinutes();

    let minutesToSettle = minutes;
    let hoursToSettle = hours;

    if (minutes >= 1 && minutes <= 15) {
      minutesToSettle = 15;
    } else if (minutes >= 16 && minutes <= 30) {
      minutesToSettle = 30;
    } else if (minutes >= 31 && minutes <= 45) {
      minutesToSettle = 45;
    } else if (minutes >= 46 && minutes <= 60) {
      minutesToSettle = 0;
      hoursToSettle = hours + 1;
    }

    datetime.setHours(hoursToSettle, minutesToSettle, 0, 0);
    return moment(datetime, [moment.ISO_8601, "hh:mm A"]);
  } else {
    return date;
  }
}

export function getDay(date) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = weekday[moment(date).day()];
  return {
    day: day,
    index: moment(date).day(),
  };
}
export function isMobileTab() {
  let width = window.innerWidth;
  let returnValue = width <= 768 ? true : false;
  return returnValue;
}

export function checkExpiredEvent_old(eventDetails) {
  const d = new Date();
  const currentOffset = d.getTimezoneOffset();
  const currentUTCTime = moment();
  const expireDate =
    eventDetails?.repeatedType !== 1 && eventDetails?.repeatedEndDate
      ? eventDetails?.repeatedEndDate
      : eventDetails?.endTime;
  const officeTime = moment(expireDate, "YYYY-MM-DDTHH:mm:ss")
    .add(eventDetails?.office?.state?.utcOffsetInMinutes, "m")
    .add(currentOffset, "m")
    .add(eventDetails?.office?.state?.utcOffsetInMinutes, "m")
    .add(currentOffset, "m")
    .format("YYYY-MM-DDTHH:mm:ss");

  return (
    currentUTCTime.diff(moment(officeTime, "YYYY-MM-DDTHH:mm:ss"), "days") > 1
  );
}

export function checkExpiredEvent(eventDetails) {
  const expireDate =
    eventDetails?.repeatedType !== 1 && eventDetails?.repeatedEndDate
      ? eventDetails?.repeatedEndDate
      : eventDetails?.endTime;

  let convertedExpDate = moment(
    moment
      .tz(expireDate, eventDetails?.office?.state?.timezoneId)
      .format("YYYY-MM-DD"),
    "YYYY-MM-DD"
  );
  let convertedCurrentDate = moment
    .tz(new Date(), eventDetails?.office?.state?.timezoneId)
    .format("YYYY-MM-DD");

  return moment(convertedExpDate).isBefore(convertedCurrentDate);
}

export const scrollToError = () => {
  setTimeout(() => {
    const error = document.getElementsByClassName("error-msg");
    if (error && error.length) {
      error[0].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "start",
      });
    }
  }, 600);
};

export const scrollToErrorInModal = (modalId) => {
  setTimeout(() => {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      const errors = modalEl.getElementsByClassName("error-msg");
      if (errors && errors.length) {
        errors[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "start",
        });
      }
    }
  }, 600);
};

export const converToMarker = (doctor) => {
  const {
    geometry = {},
    opening_hours,
    id,
    name,
    place_id,
    vicinity,
    rating,
    photos,
    office,
    ...rest
  } = doctor;
  let profilePic = "";
  if (photos && photos.length) {
    profilePic = photos[0].getUrl();
  }
  const { lat, lng } = geometry.location || {};
  return {
    location: {
      lat: id ? office?.latitude || 0 : lat?.(),
      lng: id ? office?.longitude || 0 : lng?.(),
    },
    name,
    address: vicinity,
    placeId: place_id,
    overallRating: rating,
    profilePic,
    isGoogleDoctor: id ? false : true,
    id,
    office,
    ...rest,
  };
};
export const convertToMarkerList = (doctors) => {
  return doctors.map(converToMarker);
};

export const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((v, f) => f(v), x);

/**
This calculation based on the conversion of latitude degree to kms where 1 
degree of latitude change equals approximately 111.2 km. 
I am calculating bounds of the map from a latLng with 100 km width.
*/
export const getLatLngBounds = (lat, lng) => {
  const lat_change = 100 / 111;
  const lon_change = Math.abs(Math.cos(lat * (Math.PI / 180)));
  const sw_lat = lat - lat_change;
  const sw_lon = lng - lon_change;
  const ne_lat = lat + lat_change;
  const ne_lon = lng + lon_change;
  const sw = {
    lat: sw_lat,
    lng: sw_lon,
  };
  const ne = {
    lat: ne_lat,
    lng: ne_lon,
  };
  return {
    sw,
    ne,
  };
};

export const validateNumber = (number, min = 9, max = 16) => {
  //eslint-disable-next-line
  return (
    /^\+?[\(\.)\d-]+$/.test(number) &&
    number.length >= min &&
    number.length <= max
  );
};

export const validateEmail = (email) => {
  //eslint-disable-next-line
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};

/**
 * Parser that strips whitespaces away from a phone number
 * string so that the plain number can be stored.
 */
export const parseNumber = (value) =>
  (value ? value.replace(/\s/g, "") : "").replace(/[^\d+]/g, "");

export const getTotalPossiblePages = (pageSize, totalItems) => {
  const itemsInLastPage = totalItems % pageSize;
  return [Math.ceil(totalItems / pageSize), itemsInLastPage];
};

export const paginateArray = (array, page_size, page_number) => {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
};

export const handleError = (err, options = {}) =>
  toast.error(err?.message, options);
export const handleSuccess = (message, options = {}) =>
  toast.success(message, options);
export const getIcsData = (eventDetail) => {
  const isBusySlot = eventDetail?.agendaType === constants.agendaType.BUSY_SLOT;
  const isEvent = eventDetail?.agendaType === constants.agendaType.EVENT;

  const getFullName = (data) => `${data?.firstName} ${data?.lastName}`;
  const day = moment(eventDetail?.date).format("dd").toUpperCase();
  const startTime = `${moment(eventDetail?.date).format("YYYY-MM-DD")}T${moment(
    eventDetail?.startTime
  ).format("HH:mm")}:00`;
  const endTime = `${moment(eventDetail?.date).format("YYYY-MM-DD")}T${moment(
    eventDetail?.endTime
  ).format("HH:mm")}:00`;
  const startTimeUtc = moment
    .tz(startTime, eventDetail?.office?.state?.timezoneId)
    .toISOString();
  const endTimeUtc = moment
    .tz(endTime, eventDetail?.office?.state?.timezoneId)
    .toISOString();
  let recurrenceRule = null;
  const repeatedEndDate = moment(eventDetail?.repeatedEndDate).format(
    "YYYYMMDDT000000[Z]"
  );
  if (eventDetail?.repeatedType === 2) {
    recurrenceRule = `FREQ=WEEKLY;BYDAY=${day};INTERVAL=1;UNTIL=${repeatedEndDate}`;
  } else if (eventDetail?.repeatedType === 3) {
    recurrenceRule = `FREQ=DAILY;INTERVAL=1;UNTIL=${repeatedEndDate}`;
  }
  const event = {
    start: moment(startTimeUtc)
      .format("YYYY-M-D-H-m")
      .split("-")
      .map((numStr) => +numStr),
    end: moment(endTimeUtc)
      .format("YYYY-M-D-H-m")
      .split("-")
      .map((numStr) => +numStr),
    title: eventDetail?.title,
    location: eventDetail?.location || eventDetail?.office?.address,
    organizer: {
      name: getFullName(eventDetail?.createdBy),
      email: eventDetail?.createdBy?.emailId,
    },
    attendees: eventDetail?.eventEmployees?.map((emp) => ({
      name: getFullName(emp?.user),
      email: emp.user.emailId,
    })),
    uid: eventDetail.id?.toString(),
    description: eventDetail?.description || eventDetail?.note,
  };
  if (isBusySlot) {
    event.status = "CONFIRMED";
    event.busyStatus = "BUSY";
  }
  if (isEvent) {
    if (eventDetail?.eventStatus === constants.SCHEDULERSTATUS.PENDING) {
      event.status = "TENTATIVE";
      event.busyStatus = "TENTATIVE";
    } else if (
      eventDetail?.eventStatus === constants.SCHEDULERSTATUS.ACCEPT ||
      eventDetail?.eventStatus === 0
    ) {
      event.status = "CONFIRMED";
      event.busyStatus = "BUSY";
    } else {
      event.status = "CANCELLED";
      event.busyStatus = "FREE";
    }
  }

  if (eventDetail?.isAllDayEvent) {
    const eventDate = moment(eventDetail?.date).format("YYYY-M-D");
    event.start = eventDate.split("-").map((numStr) => +numStr);
    event.end = moment(eventDate, "YYYY-M-D")
      .add(1, "day")
      .format("YYYY-M-D")
      .split("-")
      .map((numStr) => +numStr);
  }
  if (recurrenceRule) {
    event.recurrenceRule = recurrenceRule;
  }

  const { error, value } = ics.createEvent(event);

  if (error) {
    toast.error(error.message);
    return;
  }
  const blob = new Blob([value], { type: "text/calendar" });
  FileSaver.saveAs(blob, eventDetail?.title);
};

export const sortAlphabetically = (data, sortKey) => {
  if (!data || !sortKey) return data;
  if (!Array.isArray(data)) return data;
  return sortBy(data, (item) =>
    item[sortKey]?.replaceAll(" ", "").toLowerCase()
  );
};

export const addDefaultStaffRounded = (e) => {
  if (e?.target) {
    e.target.src = defaultStaffRounded;
    e.target.onerror = null;
  }
};

export const addDefaultStaffCircular = (e) => {
  if (e?.target) {
    e.target.src = defaultStaffCircular;
    e.target.onerror = null;
  }
};

export const addDefaultSrc = (e, src) => {
  if (e?.target) {
    e.target.src = src;
    e.target.onerror = null;
  }
};

export function getWeekDay(date) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = weekday[moment(date).day()];
  return day?.substring(0, 3);
}

export function titleWordLimit(text) {
  if (text?.length <= 80) {
    return text;
  } else {
    return `${text.slice(0, 80)}...`;
  }
}

export function testRegexCheck(text) {
  let regex = new RegExp(/^[\w\-.,'\s]*$/);
  return regex.test(text);
}

export function testRegexCheckDescription(text) {
  let regex = new RegExp(/^[\w-_.!@#$%^&+*()?/, '".\n]*$/);
  return regex.test(text);
}

export const sliceText = (text, maxLen = 10) => {
  if (!text) return text;
  if (typeof text === "string" || text instanceof String) {
    return text.length > maxLen ? text.slice(0, maxLen).concat(" ...") : text;
  }
  return text;
};

export const addToCalenderText = () => {
  return (
    <>
      <p>
        The download and add to calendar allows you to add the selected event to
        your personal calendar on the web.
      </p>
      <p>
        To add the selected event on your personal calendar, follow the
        below-mentioned steps:
      </p>
      <ol>
        <li>Click on the “Download and Add to Calendar” link.</li>
        <li>
          Once selected, the event file will be downloaded to your device. Open
          “Downloads” or the folder where the downloaded files are stored on
          your desktop/laptop.
        </li>
        <li>
          Right click on the event downloaded file and select “Open with”.
        </li>
        <li>Select the calendar where you want to add the event.</li>
        <li>
          Once the calendar is selected, it will show you the details of the
          event such as the title of the event, date and time of the event,
          duration of the event etc. If you want, you can edit these details.
          Click on “Save” to add the event in your personal calendar.
        </li>
      </ol>
      <p>
        Once “Save’ is selected, the event will be added to your personal
        calendar. If you want, you can remove the event from your calendar by
        deleting it from your calendar.
      </p>
    </>
  );
};

export const cacheSideBarActive = () => {
  if (localStorage.getItem("isSidebarActive")) {
    return localStorage.getItem("isSidebarActive") == "true" ? true : false;
  }
  return isMobileTab() ? false : true;
};

export const inBytes = (inMbs) => inMbs * 1024 * 1024;

export const getBlobnameFromUrl = (blobUrl, containerName) => {
  const blobName = blobUrl?.split(`${containerName}/`)?.[1];
  return blobName;
};

export const toNormalizeString = (str) => {
  if (!str) return str;
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const setStorage = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const getStorage = (key) => {
  try {
    return JSON.parse(sessionStorage.getItem(key));
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const removeStorage = (arrayOfkey = []) => {
  arrayOfkey.forEach((item) => {
    sessionStorage.removeItem(item);
  });
};

export const handleKeyDownForNumberInput = (e) => {
  if (["e", "E", "+", "-"].includes(e?.key)) {
    e.preventDefault();
  }
  if (["."].includes(e?.key) && e?.target?.value?.length < 1) {
    e.preventDefault();
  }
};
export const isValueEmpty = (value) => {
  if (!value) return "--";
  return value;
};

export const convertIntoTwoDecimal = (price) => {
  if (!price && typeof price != "number") {
    return "--";
  }

  return parseFloat(price).toFixed(2);
};

export const convertToYYYYMMDDFormat = (dateString) => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const monthString = month < 10 ? "0" + month : month;
  const dayString = day < 10 ? "0" + day : day;
  return `${year}-${monthString}-${dayString}`;
};

export const isOver18Years = (birthDate) => {
  if (!birthDate) return false;
  const birthDateString = convertToYYYYMMDDFormat(birthDate);
  const today = new Date();
  const birthDateObj = new Date(birthDateString);
  const age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    return age - 1 >= 18;
  }
  return age >= 18;
};

export const convertTimeMinuteToHour = (timeInMin) => {
  if (!timeInMin) return;
  const duration = moment.duration(timeInMin, "minutes");
  const durationInHours = duration.asHours().toFixed(2);

  return durationInHours;
};

export const convertTimeMinuteToDays = (timeInMin) => {
  if (!timeInMin) return;
  const duration = moment.duration(timeInMin, "minutes");
  const durationInHours = duration.asDays();

  return durationInHours;
};
