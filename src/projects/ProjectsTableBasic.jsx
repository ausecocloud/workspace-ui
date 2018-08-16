import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons/faFolder';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { formatDate } from '../utils';


export default
class ProjectsTableBasic extends React.PureComponent {
  static propTypes = {
    projects: PropTypes.arrayOf(PropTypes.any).isRequired,
  }


  // TODO: return a valid size for each project
  renderProjectOptions() {
    const { projects } = this.props;
    return projects.map(project => (
      <tr key={project.name}>
        <td><FontAwesomeIcon icon={faFolder} /> {project.name}</td>
        <td>{formatDate(project.created)}</td>
        <td className="right-align"><Link to={`/projects/${project.name}`} title={`Open the "${project.name}" project in ecocloud Projects`}><FontAwesomeIcon icon={faExternalLinkAlt} /> Open in <strong><em>Projects</em></strong></Link></td>
      </tr>
    ));
  }

  render() {
    return (
      <div>
        <Table className="green-table">
          <thead>
            <tr>
              <th>Name</th>
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
