import { all } from "redux-saga/effects";
import { ProfileSaga } from "./saga-profile";
import { OfficesSaga } from "./saga-office";
import { StaffSaga } from "./saga-staff";
import { PageContentSaga } from "./saga-manage-content";
import { AuthSaga } from "./saga-auth";
import { SubSaga } from "./saga-subscription";
import { HolidaySaga } from "./saga-holiday";
import { RequestSaga } from "./saga-request";
import { TestimonialSaga } from "./saga-testimonials";
/* =============================================
    Export
============================================= */
export default function* rootSaga() {
  yield all([
    ...ProfileSaga,
    ...OfficesSaga,
    ...StaffSaga,
    ...PageContentSaga,
    ...AuthSaga,
    ...SubSaga,
    ...HolidaySaga,
    ...RequestSaga,
    ...TestimonialSaga,
  ]);
}
