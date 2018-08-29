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
import { getUser, getAuthenticated } from './reducers';
import Logo from './assets/images/logo.svg';
import ProjectsListController from './ProjectsListController';
import Footer from './Footer';
import Meta from './Meta';
import ToolsController from './ToolsController';
import * as actions from './actions';
import './assets/scss/default.scss';

require('./assets/images/favicon.ico');

class App extends React.Component {
  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any),
    isAuthenticated: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    user: {},
    isAuthenticated: false,
  }

  state = {
    isOpen: false,
  };

  onLogin = (e) => {
    e.preventDefault();
    this.props.dispatch(actions.login());
  }

  onLogout = (e) => {
    e.preventDefault();
    this.props.dispatch(actions.logout());
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
          <NavLink exact to="/workspace">Workspace</NavLink>
        </NavItem>
        <NavItem>
          <NavLink exact to="/explorer">Explorer</NavLink>
        </NavItem>
        <NavItem>
          <NavLink exact to="/tools">Tools</NavLink>
        </NavItem>
        <NavItem>
          <ExtNavLink target="_blank" href="http://support.ecocloud.org.au/support/solutions">Support</ExtNavLink>
        </NavItem>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav>
            {user.name} <i className="fa fa-user-circle" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem tag="span">
              <NavLink to="/logout" onClick={this.onLogout}>Sign out</NavLink>
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
            render={() => ([
              <span key="projects-text" className="logo-text"><h1>Workspace</h1></span>,
              <Meta key="projects-meta" pagetitle="Workspace" pagedesc="ecocloud Workspace" />,
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

    return (
      <div className="App">
        <header id="header">
          <Container>
            <MainNavbar />
          </Container>
        </header>
        <section id="main" className="row-fluid">
          { isAuthenticated ? ([
            <Route
              key="Dashboard"
              exact
              path="/"
              isAuthenticated={isAuthenticated}
              user={user}
              component={Dashboard}
            />,
            <Route key="Workspace" exact path="/workspace" component={ProjectsListController} />,
            <Route key="Project" exact path="/workspace/:id" component={ProjectsController} />,
            <Route key="Explorer" path="/explorer" component={ExplorerController} />,
            <Route key="Snippets" path="/snippets" component={SnippetsController} />,
            <Route key="Tools" exact path="/tools" component={ToolsController} />,
          ]) : (
            <Container>
              <h1>You are not signed in</h1>
              <p>Please <NavLink to="/login" onClick={this.onLogin}>sign in</NavLink> to continue.</p>
            </Container>
          )}
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
export default hot(module)(withRouter(connect(mapStateToProps, mapDispatchToProps)(App)));
