import React from 'react';
import PropTypes from 'prop-types';
import { Input, Col } from 'reactstrap';


class Projects extends React.PureComponent {
  static defaultProps = {
    selected: null,
    projects: [],
  }

  static propTypes = {
    selected: PropTypes.string,
    projects: PropTypes.arrayOf(PropTypes.any),
    onChange: PropTypes.func.isRequired,
  }

  onChange = (e) => {
    const { onChange } = this.props;
    const project = e.target.value;
    onChange(project);
  }

  renderProjectOptions() {
    const { projects } = this.props;
    return projects.map(project =>
      <option key={project.name}>{project.name}</option>);
  }

  render() {
    const { selected } = this.props;

    return (
      <Col sm={8}>
        <Input type="select" name="project" id="projectSelect" defaultValue={selected || ''} onChange={this.onChange}>
          <option value="" disabled>Please select</option>
          { this.renderProjectOptions() }
        </Input>
      </Col>
    );
  }
}

export default Projects;
