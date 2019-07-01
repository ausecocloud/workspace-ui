import React from 'react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, NavLink, withRouter } from 'react-router-dom';
import {
  Container,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Nav,
  NavItem,
  Collapse,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavLink as ExtNavLink,
} from 'reactstrap';

import './App.css';
import Logo from './assets/images/logo.svg';
import './assets/scss/default.scss';

import * as actions from './actions';
import { getUser, getAuthenticated } from './reducers';

import Meta from './Meta';
import AuthRoute from './AuthRoute';
import IntroBlock from './IntroBlock';
import SignInPrompt from './SignInPrompt';
import Dashboard from './Dashboard';
import ExplorerController from './ExplorerController';
import ProjectsController from './ProjectsController';
import SnippetsController from './SnippetsController';
import ToolsController from './ToolsController';
import Footer from './Footer';

require('./assets/images/favicon.ico');

class App extends React.Component {
  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any),
    isAuthenticated: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: {},
    isAuthenticated: false,
  };

  state = {
    isOpen: false,
  };

  onLogin = (e) => {
    e.preventDefault();
    this.props.dispatch(actions.login());
  };

  onLogout = (e) => {
    e.preventDefault();
    this.props.dispatch(actions.logout());
  };

  toggle = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  closeNavBar = () => {
    if (this.state.isOpen === true) {
      this.toggle();
    }
  };

  render() {
    const { isAuthenticated, user } = this.props;

    const anonLinks = () => (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink to="/login" onClick={this.onLogin}>
            Sign in <i className="fa fa-user-circle" />
          </NavLink>
        </NavItem>
      </Nav>
    );

    const userLinks = () => (
      <Nav className="ml-auto" navbar>
        <NavItem active>
          <NavLink exact to="/" onClick={this.closeNavBar}>
            Dashboard
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink exact to="/workspace" onClick={this.closeNavBar}>
            Workspace
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink exact to="/explorer" onClick={this.closeNavBar}>
            Explorer
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink exact to="/tools" onClick={this.closeNavBar}>
            Tools
          </NavLink>
        </NavItem>
        <NavItem>
          <ExtNavLink
            target="_blank"
            href="https://support.ecocloud.org.au/support/solutions"
            onClick={this.closeNavBar}
          >
            Support
          </ExtNavLink>
        </NavItem>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav>
            {user.name} <i className="fa fa-user-circle" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem tag="span">
              <NavLink to="/logout" onClick={this.onLogout}>
                Sign out
              </NavLink>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    );

    const MainNavbar = () => (
      <Navbar expand="lg">
        <NavbarBrand href="/">
          <img src={Logo} alt="ecocloud Logo" />
          <Route
            exact
            path="/"
            render={() => (
              <Meta pagetitle="Dashboard" pagedesc="ecocloud Dashboard" />
            )}
          />
          <Route
            path="/workspace"
            render={() => [
              <span key="projects-text" className="logo-text">
                <h1>Workspace</h1>
              </span>,
              <Meta
                key="projects-meta"
                pagetitle="Workspace"
                pagedesc="ecocloud Workspace"
              />,
            ]}
          />
          <Route
            exact
            path="/explorer"
            render={() => [
              <span key="explorer-text" className="logo-text">
                <h1>Explorer</h1>
              </span>,
              <Meta
                key="explorer-meta"
                pagetitle="Explorer"
                pagedesc="ecocloud Explorer"
              />,
            ]}
          />
          <Route
            exact
            path="/tools"
            render={() => [
              <span key="tools-text" className="logo-text">
                <h1>Tools</h1>
              </span>,
              <Meta
                key="tools-meta"
                pagetitle="Tools"
                pagedesc="ecocloud Tools"
              />,
            ]}
          />
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          {isAuthenticated ? userLinks() : anonLinks()}
        </Collapse>
      </Navbar>
    );

    return (
      <div className="App">
        <header id="header">
          <Container>
            <MainNavbar />
          </Container>
        </header>
        <section id="main" className="row-fluid">
          <AuthRoute
            exact
            path="/"
            user={user}
            component={Dashboard}
            fallbackComponent={IntroBlock}
          />
          <AuthRoute
            exact
            path="/workspace"
            component={ProjectsController}
            fallbackComponent={SignInPrompt}
          />
          <AuthRoute
            exact
            path="/explorer"
            component={ExplorerController}
            fallbackComponent={SignInPrompt}
          />
          <AuthRoute
            exact
            path="/snippets"
            component={SnippetsController}
            fallbackComponent={SignInPrompt}
          />
          <AuthRoute
            exact
            path="/tools"
            component={ToolsController}
            fallbackComponent={SignInPrompt}
          />
        </section>
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: getUser(state),
    isAuthenticated: getAuthenticated(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

// make App hot reloadable
export default hot(module)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(App),
  ),
);
