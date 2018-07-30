import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, FormFeedback, Input, Label, Button } from 'reactstrap';

export default
class CreateProjectForm extends React.PureComponent {
  static propTypes = {
    submit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // form fields
      name: '',
      description: '',
      // form state
      formErrors: { name: '' },
      formState: { name: null },
      formValid: false,
    };
  }

  closeHandler = e => this.props.close(e.target.value)

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

    switch (fieldName) {
      case 'name':
        // rule: must be at least 1 char
        if (value.length <= 0) {
          state = 'is-invalid';
          // error for rule
          errorMsg = 'A project name is required.';
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
      const { name, description } = this.state;
      this.props.submit({ name, description });
    } else {
      Object.entries(this.state.formErrors).forEach(([fieldname, _error]) => {
        const formState = { ...this.state.formState };
        formState[fieldname] = 'is-invalid';
        this.setState({ formState });
      });
    }
  }

  render() {
    const { name, description } = this.state;
    return (
      <Form onSubmit={this.submitHandler}>
        <FormGroup>
          <Label for="name">Project Name *</Label>
          <Input name="name" id="name" value={name} onChange={this.handleChange} className={this.state.formState.name} />
          <FormFeedback>{this.state.formErrors.name}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input type="textarea" name="description" id="description" value={description} onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Button color="primary">Submit</Button>{' '}
          <Button type="button" color="secondary" onClick={this.closeHandler}>Cancel</Button>
        </FormGroup>
      </Form>
    );
  }
}
