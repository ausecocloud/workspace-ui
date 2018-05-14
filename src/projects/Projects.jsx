import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils';


class Projects extends React.PureComponent {
  static defaultProps = {
    projects: [],
  }

  static propTypes = {
    projects: PropTypes.arrayOf(PropTypes.any),
  }

  renderProjectOptions() {
    const { projects } = this.props;
    return projects.map(project => (
      <Link key={project.name} to={`/drive/${project.name}`} className="project-link">
        <div className="project-list-item">
          <h2>{project.name}</h2>
          <p><strong>Date Created:</strong> {formatDate(project.created)}</p>
          <p>{project.description}</p>
        </div>
      </Link>
    ));
  }

  render() {
    return (
      <Col sm={12}>
        <div name="project" id="projectSelect" className="project-list">
          { this.renderProjectOptions() }
        </div>
      </Col>
    );
  }
}

export default Projects;
