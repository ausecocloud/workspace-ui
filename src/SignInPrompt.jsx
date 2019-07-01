import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import { NavLink } from 'react-router-dom';

function SignInPrompt({ onLaunchLogin }) {
  return (
    <Container>
      <h1>You are not signed in</h1>
      <p>
        Please{' '}
        <NavLink to="/login" onClick={onLaunchLogin}>
          sign in
        </NavLink>{' '}
        to continue.
      </p>
    </Container>
  );
}

SignInPrompt.propTypes = {
  onLaunchLogin: PropTypes.func,
};

SignInPrompt.defaultProps = {
  onLaunchLogin: () => {},
};

export default SignInPrompt;
