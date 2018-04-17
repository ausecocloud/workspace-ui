import React from 'react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink,
  Collapse,
} from 'reactstrap';
import './App.css';
import Projects from './Projects';
import Contents from './Contents';
import Account from './Account';
import { userSelector } from './selectors';
import logo from './assets/images/logo.png';
import './assets/scss/default.scss';


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

    const userLinks = () => (
      <NavItem active>
        <NavLink href="/account">{this.props.user.id_token.name}</NavLink>
        <NavLink href="/oidc/logout">Logout</NavLink>
      </NavItem>
    );

    const anonLinks = (
      <NavItem>
        <NavLink href="/oidc/login">Login</NavLink>
      </NavItem>
    );

    return (
      <Router>
        <div className="App">
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/">
              <img src={logo} alt="logo" />
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem active>
                  <NavLink href="/">Dashboard</NavLink>
                </NavItem>
                <NavItem active>
                  <NavLink href="/explorer">Explorer</NavLink>
                </NavItem>
              </Nav>
              <Nav className="ml-auto" navbar>
                { isAuthenticated ? userLinks() : anonLinks }
              </Nav>
            </Collapse>
          </Navbar>

          {/* Dashboard */}
          <Route
            exact
            path="/"
            render={() => <h1>Dashboard</h1>}
          />
          <Route exact path="/" component={Projects} />
          <Route exact path="/" component={Contents} />

          {/* Dashboard */}
          <Route
            path="/explorer"
            render={() => <h1>ecocloud Explorer</h1>}
          />

          {/* Account */}
          <Route exact path="/account" component={Account} />

        </div>
      </Router>
    );
  }
}


function mapStateToProps(state) {
  return {
    user: userSelector(state),
  };
}

// make App hot reloadable
// export default connect(mapStateToProps)(hot(module)((App)));
export default hot(module)(connect(mapStateToProps)(App));
// export default connect(mapStateToProps)(App);
