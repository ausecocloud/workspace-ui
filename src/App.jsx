import React from 'react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, NavLink, withRouter } from 'react-router-dom';
import {
  Container, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, Collapse,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
  NavLink as ExtNavLink,
} from 'reactstrap';
import './App.css';
import ProjectsController from './ProjectsController';
import Dashboard from './Dashboard';
import ExplorerController from './ExplorerController';
import SnippetsController from './SnippetsController';
import Account from './Account';
import { getUser, getAuthenticated } from './reducers';
import Logo from './assets/images/logo.svg';
import ProjectsListController from './ProjectsListController';
import Footer from './Footer';
import Meta from './Meta';
import ToolsController from './ToolsController';
import * as actions from './actions';
import './assets/scss/default.scss';

require('./assets/images/favicon.ico');

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

class App extends React.Component {
  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  state = {
    isOpen: false,
  };

  onLogin = (e) => {
    e.preventDefault();
    this.triggerLogin();
  }

  onLogout = (e) => {
    e.preventDefault();
    this.props.dispatch(actions.logout());
  }

  triggerLogin = () => {
    this.props.dispatch(actions.login());
  }

  toggle = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  render() {
    const { isAuthenticated, user } = this.props;

    const anonLinks = (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink to="/login" onClick={this.onLogin}>Sign in <i className="fa fa-user-circle" /></NavLink>
        </NavItem>
      </Nav>
    );

    const userLinks = () => (
      <Nav className="ml-auto" navbar>
        <NavItem active>
          <NavLink exact to="/">Dashboard</NavLink>
        </NavItem>
        <NavItem>
          <NavLink exact to="/projects">Projects</NavLink>
        </NavItem>
        <NavItem>
          <NavLink exact to="/explorer">Explorer</NavLink>
        </NavItem>
        <NavItem>
          <NavLink exact to="/tools">Tools</NavLink>
        </NavItem>
        <NavItem>
          <ExtNavLink target="_blank" href="http://support.ecocloud.org.au/support/home">Support</ExtNavLink>
        </NavItem>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav>
            {user.name} <i className="fa fa-user-circle" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem tag="span">
              <NavLink exact to="/account">Account</NavLink>
            </DropdownItem>
            <DropdownItem tag="span">
              <NavLink to="/logout" onClick={this.onLogout}>Logout</NavLink>
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
            path="/projects"
            render={() => ([
              <span key="projects-text" className="logo-text"><h1>Projects</h1></span>,
              <Meta key="projects-meta" pagetitle="Projects" pagedesc="ecocloud Projects" />,
            ])}
          />
          <Route
            exact
            path="/explorer"
            render={() => ([
              <span key="explorer-text" className="logo-text"><h1>Explorer</h1></span>,
              <Meta key="explorer-meta" pagetitle="Explorer" pagedesc="ecocloud Explorer" />,
            ])}
          />
          <Route
            exact
            path="/tools"
            render={() => ([
              <span key="tools-text" className="logo-text"><h1>Tools</h1></span>,
              <Meta key="tools-meta" pagetitle="Tools" pagedesc="ecocloud Tools" />,
            ])}
          />
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          { isAuthenticated ? userLinks() : anonLinks }
        </Collapse>
      </Navbar>
    );

    const MainContent = () => {
      switch (isAuthenticated) {
        case undefined:
          // Render a placeholder "please wait" while the application checks
          // with the auth service
          return (
            <Container>
              <h1>Please wait...</h1>
            </Container>
          );

        case true:
          // Enable routes when properly authenticated
          return (
            <>
              <Route key="Dashboard" exact path="/" component={Dashboard} />
              <Route key="Projects" exact path="/projects" component={ProjectsListController} />
              <Route key="Project" exact path="/projects/:id" component={ProjectsController} />
              <Route key="Explorer" path="/explorer" component={ExplorerController} />
              <Route key="Snippets" path="/snippets" component={SnippetsController} />
              <Route key="Tools" exact path="/tools" component={ToolsController} />
              <Route key="Account" exact path="/account" component={Account} />
            </>
          );

        case false:
        default:
          // Automatically trigger redirect to auth service
          this.triggerLogin();

          // Render the sign in link as fallback
          return (
            <Container>
              <h1>You are not signed in</h1>
              <p>Please <NavLink to="/login" onClick={this.onLogin}>sign in</NavLink> to continue.</p>
            </Container>
          );
      }
    };

    return (
      <div className="App">
        <header id="header">
          <Container>
            <MainNavbar />
          </Container>
        </header>
        <section id="main" className="row-fluid">
          <MainContent />
        </section>
        <Footer />
      </div>
    );
  }
}

// make App hot reloadable
export default hot(module)(withRouter(connect(mapStateToProps, mapDispatchToProps)(App)));
