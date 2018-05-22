import React from 'react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, NavLink, withRouter } from 'react-router-dom';
import { Container, Col, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, Collapse, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './App.css';
import ProjectsController from './ProjectsController';
import Dashboard from './Dashboard';
import Explorer from './Explorer';
import Account from './Account';
import { getUser, getAuthenticated } from './reducers';
import Logo from './assets/images/logo.svg';
import ProjectsListController from './ProjectsListController';
import Footer from './Footer';
import Meta from './Meta';
import ComputeController from './ComputeController';
import * as actions from './actions';
import './assets/scss/default.scss';

require('./assets/images/favicon.ico');

class App extends React.Component {
  static defaultProps = {
    user: {},
    isAuthenticated: false,
  }

  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any),
    isAuthenticated: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
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
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const { isAuthenticated, user } = this.props;

    const anonLinks = (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink to="/login" onClick={this.onLogin}>Login <i className="fa fa-user-circle" /></NavLink>
        </NavItem>
      </Nav>
    );

    const userLinks = () => (
      <Nav className="ml-auto" navbar>
        <NavItem active>
          <NavLink exact to="/">Dashboard</NavLink>
        </NavItem>
        <NavItem>
          <NavLink exact to="/drive">Drive</NavLink>
        </NavItem>
        <NavItem>
          <NavLink exact to="/explorer">Explorer</NavLink>
        </NavItem>
        <NavItem>
          <NavLink exact to="/compute">Compute</NavLink>
        </NavItem>
        <NavItem>
          <NavLink target="_blank" to="http://support.ecocloud.org.au/support/home">Support &amp; Docs</NavLink>
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
            path="/drive"
            render={() => ([
              <span key="drive-text" className="logo-text"><h1>Drive</h1></span>,
              <Meta key="drive-meta" pagetitle="Drive" pagedesc="ecocloud Drive" />,
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
            path="/compute"
            render={() => ([
              <span key="compute-text" className="logo-text"><h1>Compute</h1></span>,
              <Meta key="compute-meta" pagetitle="Compute" pagedesc="ecocloud Compute" />,
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
            <Route key="Drive" exact path="/drive" component={ProjectsListController} />,
            <Route key="Project" exact path="/drive/:id" component={ProjectsController} />,
            <Route key="Explorer" path="/explorer" component={Explorer} />,
            <Route key="Compute" exact path="/compute" component={ComputeController} />,
            <Route key="Account" exact path="/account" component={Account} />,
          ]) : (
            <Container>
              <h1>You are not logged in.</h1>
              <p>Please <NavLink to="/login" onClick={this.onLogin}>log in</NavLink> to continue</p>
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
