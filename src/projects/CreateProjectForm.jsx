import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, FormFeedback, Input, Label, Button } from 'reactstrap';

export default
class CreateProjectForm extends React.PureComponent {
  static propTypes = {
    data: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      formErrors: { name: '' },
      formState: { name: null },
      formValid: false,
    };

    this.closeHandler = this.closeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  closeHandler(e) {
    this.props.close(e.target.value);
  }

  handleChange(event) {
    const { target } = event;
    const { value, name } = target;
    console.log(value);
    this.setState({
      [name]: value,
    }, () => {
      this.validateField(name, value);
      this.props.data(this.state);
    });
  }

  validateField(fieldName, value) {
    const formState = { ...this.state.formState };
    const formErrors = { ...this.state.formErrors };
    let errorMsg = '';

    switch (fieldName) {
      case 'name':
        // rule: must be at least 1 char
        if (value.length <= 0) {
          formState[fieldName] = 'is-invalid';
          // error for rule
          errorMsg = 'A project name is required.';
        } else {
          formState[fieldName] = 'is-valid';
        }
        break;
      default:
        break;
    }

    formErrors[fieldName] = (formState[fieldName] === 'is-valid') ? '' : errorMsg;

    this.setState({
      formErrors,
      formState,
    }, this.validateForm);
  }

  validateForm() {
    Object.entries(this.state.formErrors).forEach(([fieldname, error]) => {
      if (error.length > 0) {
        this.setState({ formValid: false });
      } else {
        this.setState({ formValid: true });
      }
    });
  }

  submitHandler(e) {
    e.preventDefault();
    if (this.state.formValid) {
      this.props.submit(e.target.value);
    } else {
      Object.entries(this.state.formErrors).forEach(([fieldname, error]) => {
        const formState = { ...this.state.formState };
        formState[fieldname] = 'is-invalid';
        this.setState({ formState });
      });
    }
  }

  render() {
    return (
      <Form onSubmit={this.submitHandler}>
        <FormGroup>
          <Label for="name">Project Name *</Label>
          <Input name="name" id="name" value={this.state.projName} onChange={this.handleChange} className={this.state.formState.name} />
          <FormFeedback>{this.state.formErrors.name}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input type="textarea" name="description" id="description" value={this.state.projDesc} onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Button color="success">Submit</Button>{' '}
          <Button type="button" color="secondary" onClick={this.closeHandler}>Cancel</Button>
        </FormGroup>
      </Form>
    );
  }
}
