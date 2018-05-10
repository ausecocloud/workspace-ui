import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faUpload from '@fortawesome/fontawesome-free-solid/faUpload';
import faServer from '@fortawesome/fontawesome-free-solid/faServer';


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
          <div className="placeholder">
            <p><strong>Date Created:</strong> 11 Apr, 2018</p>
            <p>Project description lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
          </div>
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
