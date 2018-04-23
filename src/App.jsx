import React from 'react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Route, NavLink, withRouter } from 'react-router-dom';
import { Container, Col, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink as NavLinkReact, Collapse, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './App.css';
import ProjectsController from './ProjectsController';
import Account from './Account';
import { getUser } from './reducers';
import Meta from './Meta';
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
          <NavLinkReact href="/oidc/login">Login <i className="fa fa-user-circle" /></NavLinkReact>
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
              <NavLinkReact href="/oidc/logout">Logout</NavLinkReact>
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
      <div className="App">
        <header id="header">
          <Container>
            <MainNavbar />
          </Container>
        </header>
        <section id="main" className="row-fluid">
          {/* Dashboard */}
          <Route
            exact
            path="/"
            render={() => <Container><h1>Dashboard</h1></Container>}
          />
          {/* Drive */}
          <Route
            exact
            path="/drive"
            render={() => [<ProjectsController />, <Meta pagetitle="Drive" pagedesc="Welcome to ecocloud Drive!" />]}
          />
          {/* Explorer */}
          <Route
            path="/explorer"
            render={() => [<Col md="12"><h1>ecocloud Explorer</h1></Col>, <Meta pagetitle="Explorer" pagedesc="Welcome to ecocloud Drive!" />]}
          />
          {/* Account */}
          <Route exact path="/account" component={Account} />
        </section>
        <Footer />
      </div>
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
export default hot(module)(withRouter(connect(mapStateToProps)(App)));
// export default connect(mapStateToProps)(App);
