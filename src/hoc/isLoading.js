import React, { Fragment } from "react";
import Loader from "components/Loader";

export const isLoading = (WrappedComponent) => {
  class HOC extends React.Component {
    render() {
      const { isLoading: _isLoading, pageLoader } = this.props;
      return (
        <Fragment>
          {_isLoading || pageLoader ? <Loader /> : null}
          <WrappedComponent {...this.props} />
        </Fragment>
      );
    }
  }
  return HOC;
};

export default isLoading;
