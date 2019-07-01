import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import { getAuthenticated } from './reducers';

function AuthRoute(props) {
  const {
    isAuthenticated,
    fallbackComponent: FallbackComponent,
    component: OriginalComponent,
  } = props;

  // Wrap component with auth conditional
  function component(routeProps) {
    return isAuthenticated ? (
      <OriginalComponent {...routeProps} />
    ) : (
      <FallbackComponent {...routeProps} />
    );
  }

  return <Route {...props} component={component} />;
}

AuthRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  fallbackComponent: PropTypes.node,
};

AuthRoute.defaultProps = {
  isAuthenticated: false,
  fallbackComponent: null,
};

function mapStateToProps(state) {
  return {
    isAuthenticated: getAuthenticated(state),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    null,
  )(AuthRoute),
);
