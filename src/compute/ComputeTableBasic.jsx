import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faEraser } from '@fortawesome/free-solid-svg-icons/faEraser';
import * as actions from './actions';
import LaunchServer from './LaunchServer';
import { jupyterhub } from '../api';
import { formatDate, formatTime } from '../utils';

/**
 * Renders a table cell for displaying the status of the server
 *
 * @param {object} server Server status object
 */
const StatusCell = ({ server }) => {
  // Termination is indicated by the value of the pending property
  if (server.pending === 'stop') {
    return (
      <td><FontAwesomeIcon icon={faEraser} /> Terminating</td>
    );
  }

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
};

StatusCell.propTypes = {
  server: PropTypes.objectOf(PropTypes.any).isRequired,
};

/**
 * Renders a nicer human readable value for the start date in a table cell
 *
 * @param {string} date Start date value as a string
 */
const StartDateCell = ({ date }) => (<td>{`${formatDate(date)} ${formatTime(date)}`}</td>);
StartDateCell.propTypes = {
  date: PropTypes.string.isRequired,
};


const ServerRow = ({ server, huburl, terminateServer }) => (
  <tr key={server.name}>
    <td><a href={`${huburl}${server.url}`} target="_blank" rel="noopener noreferrer">{server.name || 'Server'}</a></td>
    <StartDateCell date={server.started} />
    <StatusCell server={server} />
    <td className="right-align">
      {
        // Only render buttons if not in the process of spinning up or down
        !server.pending && [
          <a key="0" className="btn btn-primary btn-sm" href={`${huburl}${server.url}`} target="_blank" rel="noopener noreferrer">Open</a>,
          ' ',
          <button
            key="1"
            className="btn btn-danger btn-sm"
            type="button"
            onClick={terminateServer}
          >Terminate
          </button>,
        ]
      }
    </td>
  </tr>
);
ServerRow.propTypes = {
  server: PropTypes.objectOf(PropTypes.any).isRequired,
  huburl: PropTypes.string.isRequired,
  terminateServer: PropTypes.func.isRequired,
};


class ComputeTableBasic extends React.Component {
  static propTypes = {
    servers: PropTypes.arrayOf(PropTypes.any).isRequired,
    username: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  /**
   * Terminates user's JupyterHub server
   *
   * @param {object} username User's username
   */
  terminateServer = () => {
    const { username, dispatch } = this.props;
    dispatch(actions.serverTerminate(username));
  }

  render() {
    const huburl = jupyterhub.getHubUrl();
    const { username, servers } = this.props;

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
            { servers.length === 0 && <LaunchServer huburl={huburl} username={username} />}
            { servers.length >= 0 && servers.map(server => (
              <ServerRow
                key={server.name}
                server={server}
                huburl={huburl}
                terminateServer={this.terminateServer}
              />))
            }
          </tbody>
        </Table>
      </div>
    );
  }
}


export default connect()(ComputeTableBasic);
