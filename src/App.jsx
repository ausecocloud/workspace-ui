import React from 'react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, Collapse, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './App.css';
import ProjectsController from './ProjectsController';
import Account from './Account';
import { getUser } from './reducers';
import Logo from './assets/images/logo.svg';
import Footer from './Footer';
import './assets/scss/default.scss';

require('./assets/images/favicon.ico');


class App extends React.Component {
  static defaultProps = {
    user: {},
  }

  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any),
  }

  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const isAuthenticated = !isEmpty(this.props.user);

    const anonLinks = (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink to="/oidc/login">Login <i className="fa fa-user-circle" /></NavLink>
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
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav>
            {this.props.user.id_token.name} <i className="fa fa-user-circle" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              <NavLink exact to="/account">Account</NavLink>
            </DropdownItem>
            <DropdownItem>
              <NavLink to="/oidc/logout">Logout</NavLink>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    );

    const MainNavbar = () => (
      <Navbar expand="md">
        <NavbarBrand href="/">
          <img src={Logo} alt="ecocloud Logo" />
          <Route exact path="/drive" render={() => <span className="logo-text"><h1>Drive</h1></span>} />
          <Route exact path="/explorer" render={() => <span className="logo-text"><h1>Explorer</h1></span>} />
          <Route exact path="/compute" render={() => <span className="logo-text"><h1>Compute</h1></span>} />
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          { isAuthenticated ? userLinks() : anonLinks }
        </Collapse>
      </Navbar>
    );

    return (
      <Router>
        <div className="App">
          <div className="row-fluid header">
            <div className="container">
              <MainNavbar />
            </div>
          </div>
          <section id="main" className="row-fluid">
            {/* Dashboard */}
            <Route
              exact
              path="/"
              render={() => <div className="container"><h1>Dashboard</h1></div>}
            />

            {/* Drive */}
            <Route exact path="/drive" component={ProjectsController} />

            {/* Explorer */}
            <Route
              path="/explorer"
              render={() => <div className="col-md-12"><h1>ecocloud Explorer</h1></div>}
            />

            {/* Account */}
            <Route exact path="/account" component={Account} />
          </section>
          <Footer />
        </div>
      </Router>
    );
  }
}


function mapStateToProps(state) {
  return {
    user: getUser(state),
  };
}

// make App hot reloadable
// export default connect(mapStateToProps)(hot(module)((App)));
export default hot(module)(connect(mapStateToProps)(App));
// export default connect(mapStateToProps)(App);
