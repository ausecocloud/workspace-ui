import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { getUser } from './reducers';


function mapStateToProps(state) {
  const user = getUser(state);
  if (user) {
    return { user };
  }
  return {
    user: null,
  };
}


class AccountTable extends React.PureComponent {
  static defaultProps = {
    user: {},
  }

  static propTypes = {
    user: PropTypes.objectOf(PropTypes.any),
  }

  render() {
    const isAuthenticated = !isEmpty(this.props.user);
    const user = this.props.user.id_token;

    const userTable = () => (
      <section className="user-details">
        <h1>User details for {user.name}</h1>
        <Form>
          <FormGroup>
            <Label for="userFullName">Name</Label>
            <Input type="text" name="user-fullname" id="userFullName" value={user.name} />
          </FormGroup>
          <FormGroup>
            <Label for="userEmail">Email</Label>
            <Input type="email" name="email" id="userEmail" value={user.email} />
          </FormGroup>
          <FormGroup>
            <Label for="userName">Username</Label>
            <Input type="text" name="userName" id="userName" value={user.preferred_username} />
          </FormGroup>
          <FormGroup>
            <Label for="userAuth">Identity Issued By</Label>
            <Input type="text" name="userAuth" id="userAuth" disabled value={user.iss} />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      </section>
    );

    const noContent = (
      <h1>You are not logged in.</h1>
    );

    return (
      <div className="container user-table">
        { isAuthenticated ? userTable() : noContent }
      </div>
    );
  }
}

const userAccountDetails = connect(mapStateToProps)(AccountTable);

export default withRouter(userAccountDetails);
