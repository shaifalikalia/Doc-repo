import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import ProfileRedcuer from "./ProfileRedcuer";
import errorsReducer from "./errorsReducer";
import officeRedcuer from "./officeRedcuer";
import staffReducer from "./staffReducer";
import ManageContentReducer from "./ManageContentReducer";
import AuthReducer from "./AuthReducer";
import subReducer from "./subReducer";
import HolidayReducer from "./HolidayReducer";
import DemoReducer from "./DemoReducer";
import TestimonialsReducer from "./TestimonialsReducer";
import Notification from "./Notification";
import Subscription from "./Subscription";
import OnwnerMessanger from "./OnwnerMessanger";

const reducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    userProfile: ProfileRedcuer,
    errors: errorsReducer,
    offices: officeRedcuer,
    staff: staffReducer,
    pageContent: ManageContentReducer,
    auth: AuthReducer,
    sub: subReducer,
    holiday: HolidayReducer,
    demorequest: DemoReducer,
    Testimonials: TestimonialsReducer,
    notification: Notification,
    Subscription: Subscription,
    OnwnerMessanger: OnwnerMessanger,
  });

export default reducer;
