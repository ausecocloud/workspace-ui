import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Input, Button } from 'reactstrap';

export default
class DeleteProjectForm extends React.PureComponent {
  static propTypes = {
    submit: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    project: PropTypes.string.isRequired,
  }

  closeHandler = e => this.props.close(e.target.value)

  submitHandler = (e) => {
    e.preventDefault();
    const { project } = this.props;
    this.props.submit({ project });
  }

  render() {
    const { project } = this.props;
    return (
      <Form onSubmit={this.submitHandler}>
        <FormGroup>
          <Input name="project" id="project" value={project} hidden disabled />
        </FormGroup>
        <FormGroup>
          <Button color="danger">I Understand, Delete This Project</Button>{' '}
          <Button type="button" color="secondary" onClick={this.closeHandler}>Cancel</Button>
        </FormGroup>
      </Form>
    );
  }
}
