import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, Container, FormFeedback } from 'reactstrap';
import * as actions from './actions';
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
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // form fields
      name: this.props.user.name,
      email: this.props.user.email,
      username: this.props.user.preferred_username,
      // form state
      formErrors: { name: '', email: '', username: '' },
      formState: { name: null, email: null, username: null },
      // this form is prefilled, valid as true on render
      formValid: true,
    };
  }

  handleChange = (event) => {
    const { target } = event;
    const { value, name } = target;
    const [fieldState, fieldError] = this.validateField(name, value);
    this.setState({
      [name]: value,
      formState: {
        ...this.state.formState,
        [name]: fieldState,
      },
      formErrors: {
        ...this.state.formErrors,
        [name]: fieldError,
      },
    }, () => this.validateForm());
  }

  validateField = (fieldName, value) => {
    let state = 'is-valid';
    let errorMsg = '';
    const emailRegex = new RegExp('[^@]+@[^@]+\\.[^@]+');
    switch (fieldName) {
      case 'name':
        // rule: must be at least 1 char
        if (value.length <= 0) {
          state = 'is-invalid';
          // error for rule
          errorMsg = 'A users name is required.';
        }
        break;
      case 'email':
        // rule: must be at least 1 char
        if (value.length <= 0) {
          state = 'is-invalid';
          // error for rule
          errorMsg = 'An email is required.';
        } else if (!emailRegex.test(value)) {
          state = 'is-invalid';
          // error for rule
          errorMsg = 'Input must be valid email format (ie.  _____@______.____).';
        }
        break;
      case 'username':
        // rule: must be at least 1 char
        if (value.length <= 0) {
          state = 'is-invalid';
          // error for rule
          errorMsg = 'A username is required.';
        }
        break;
      default:
        break;
    }
    return [state, errorMsg];
  }

  validateForm = () => {
    Object.entries(this.state.formErrors).forEach(([_fieldname, error]) => {
      if (error.length > 0) {
        this.setState({ formValid: false });
      } else {
        this.setState({ formValid: true });
      }
    });
  }

  submitHandler = (e) => {
    e.preventDefault();
    if (this.state.formValid) {
      const { name, email, username } = this.state;
      const formData = { name, email };
      formData.preferred_username = username;
      // submit ajax call
      this.props.dispatch(actions.userUpdate(formData));
    } else {
      Object.entries(this.state.formErrors).forEach(([fieldname, _error]) => {
        const formState = { ...this.state.formState };
        formState[fieldname] = 'is-invalid';
        this.setState({ formState });
      });
    }
  }


  render() {
    const { isAuthenticated, user } = this.props;
    const { name, email, username } = this.state;

    const userTable = () => (
      <section className="user-details">
        <h1>User details for {user.name}</h1>
        <Form onSubmit={this.submitHandler}>
          <FormGroup>
            <Label for="userFullName">Name</Label>
            <Input type="text" name="name" id="name" defaultValue={name} onChange={this.handleChange} className={this.state.formState.name} />
            <FormFeedback>{this.state.formErrors.name}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="userEmail">Email</Label>
            <Input type="email" name="email" id="email" defaultValue={email} onChange={this.handleChange} className={this.state.formState.email} />
            <FormFeedback>{this.state.formErrors.email}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="userName">Username</Label>
            <Input type="text" name="username" id="username" defaultValue={username} onChange={this.handleChange} className={this.state.formState.username} />
            <FormFeedback>{this.state.formErrors.username}</FormFeedback>
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
      <Container className="container user-table">
        { isAuthenticated ? userTable() : noContent }
      </Container>
    );
  }
}

export default connect(mapStateToProps)(AccountTable);
