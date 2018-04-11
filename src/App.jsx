import React from 'react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import {
  Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink,
  Collapse,
} from 'reactstrap';
import './App.css';
import Projects from './Projects';
import Contents from './Contents';
import { userSelector } from './selectors';


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

    const userLinks = (
      <NavItem active>
        <NavLink href="/oidc/logout">Logout</NavLink>
      </NavItem>
    );

    const anonLinks = (
      <NavItem>
        <NavLink href="/oidc/login">Login</NavLink>
      </NavItem>
    );

    return (
      <div className="App">
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">reactstrap</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem active>
                <NavLink href="/">Home</NavLink>
              </NavItem>
            </Nav>
            <Nav className="ml-auto" navbar>
              { isAuthenticated ? userLinks : anonLinks }
            </Nav>
          </Collapse>
        </Navbar>
        <Projects />
        <Contents />
      </div>
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
