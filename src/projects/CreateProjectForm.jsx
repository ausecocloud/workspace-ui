import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Input, Label } from 'reactstrap';

export default
class CreateProjectForm extends React.PureComponent {
  static propTypes = {
    data: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { target } = event;
    const { value, name } = target;
    this.setState({
      [name]: value,
    });
    this.props.data(this.state);
  }

  render() {
    return (
      <Form>
        <FormGroup>
          <Label for="name">Project Name</Label>
          <Input name="name" id="name" value={this.state.projName} onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input type="textarea" name="description" id="description" value={this.state.projDesc} onChange={this.handleChange} />
        </FormGroup>
      </Form>
    );
  }
}
