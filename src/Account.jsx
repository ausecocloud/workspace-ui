import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { getUser, getAuthenticated } from './reducers';


function mapStateToProps(state) {
  return {
    user: getUser(state),
    isAuthenticated: getAuthenticated(state),
  };
}


class AccountTable extends React.PureComponent {
  static defaultProps = {
    user: {},
    isAuthenticated: false,
  }

  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any),
    isAuthenticated: PropTypes.bool,
  }

  render() {
    const { isAuthenticated, user } = this.props;

    const userTable = () => (
      <section className="user-details">
        <h1>User details for {user.name}</h1>
        <Form>
          <FormGroup>
            <Label for="userFullName">Name</Label>
            <Input type="text" name="user-fullname" id="userFullName" defaultValue={user.name} />
          </FormGroup>
          <FormGroup>
            <Label for="userEmail">Email</Label>
            <Input type="email" name="email" id="userEmail" defaultValue={user.email} />
          </FormGroup>
          <FormGroup>
            <Label for="userName">Username</Label>
            <Input type="text" name="userName" id="userName" defaultValue={user.preferred_username} />
          </FormGroup>
          <FormGroup>
            <Label for="userAuth">Identity Issued By</Label>
            <Input type="text" name="userAuth" id="userAuth" disabled defaultValue={user.iss} />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      </section>
    );

    const noContent = (
      <h1>You are not logged in.</h1>
    );

    return (
      <Container className="container user-table">
        { isAuthenticated ? userTable() : noContent }
      </Container>
    );
  }
}

const userAccountDetails = connect(mapStateToProps)(AccountTable);

export default withRouter(userAccountDetails);
