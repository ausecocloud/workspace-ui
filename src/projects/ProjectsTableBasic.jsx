import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faFolder from '@fortawesome/fontawesome-free-solid/faFolder';
import faExternalLinkAlt from '@fortawesome/fontawesome-free-solid/faExternalLinkAlt';

export default
class ProjectsTableBasic extends React.PureComponent {
  static propTypes = {
    projects: PropTypes.arrayOf(PropTypes.any).isRequired,
  }

  renderProjectOptions() {
    const { projects } = this.props;
    return projects.map(project => (
      <tr key={project.name}>
        <td><FontAwesomeIcon icon={faFolder} /> {project.name}</td>
        <td>{project.bytes}</td>
        <td>11, Apr 2018</td>
        <td><Link to={`drive/${project.name}`} title="Create new project on ecocloud Drive"><FontAwesomeIcon icon={faExternalLinkAlt} /> Open in <strong><em>Drive</em></strong></Link></td>
      </tr>
    ));
  }

  render() {
    return (
      <div>
        <Table className="basic-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Last Modified</th>
              <th />
            </tr>
          </thead>
          <tbody>
            { this.renderProjectOptions() }
          </tbody>
        </Table>
      </div>
    );
  }
}
