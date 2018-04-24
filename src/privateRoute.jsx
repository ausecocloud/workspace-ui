import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import Meta from './Meta';

export default class PrivateRoute extends React.PureComponent {
  static defaultProps = {
    isAuthenticated: false,
    Component: null,
    pagetitle: {},
    pagedesc: {},
    location: {},
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    Component: PropTypes.element,
    pagetitle: PropTypes.string,
    pagedesc: PropTypes.string,
    location: PropTypes.objectOf(PropTypes.any),
  }

  render() {
    const {
      isAuthenticated,
      Component,
      pagetitle,
      pagedesc,
      location,
      ...rest
    } = this.props;

    console.log(this.props);
    console.log(isAuthenticated);

    return (
      isAuthenticated ? ([
        <Meta pagetitle={pagetitle} pagedesc={pagedesc} />,
        <Route component={Component} {...rest} />,
      ]) : (
        <Redirect to="/oidc/login" />
      )
    );
  }
}
