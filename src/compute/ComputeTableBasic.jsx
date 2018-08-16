import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { jupyterhub } from '../api';
import { formatDate, formatTime } from '../utils';

/**
 * Renders a table cell for displaying the status of the server
 *
 * @param {object} server Server status object
 */
function renderStatusCell(server) {
  if (server.pending) {
    return (
      <td><FontAwesomeIcon icon={faSpinner} /> Pending</td>
    );
  }

  if (server.ready) {
    return (
      <td><FontAwesomeIcon icon={faCheck} /> Running</td>
    );
  }

  // If not pending or ready, it is in the process of being terminated or is
  // terminated
  return (
    <td><FontAwesomeIcon icon={faTimes} /> Terminating</td>
  );
}

/**
 * Renders a nicer human readable value for the start date in a table cell
 *
 * @param {string} date Start date value as a string
 */
function renderStartDateCell(date) {
  return (
    <td>{`${formatDate(date)} ${formatTime(date)}`}</td>
  );
}

export default
class ComputeTableBasic extends React.PureComponent {
  static propTypes = {
    servers: PropTypes.arrayOf(PropTypes.any).isRequired,
  }

  renderServers() {
    const huburl = jupyterhub.getHubUrl();

    return this.props.servers.map(server => (
      <tr key={server.name}>
        <td><a href={`${huburl}${server.url}`} target="_blank" rel="noopener noreferrer">{server.name || 'Server'}</a></td>
        { renderStartDateCell(server.started) }
        { renderStatusCell(server) }
        <td>Open | Terminate</td>
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
              <th>Started</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            { this.renderServers() }
          </tbody>
        </Table>
      </div>
    );
  }
}
