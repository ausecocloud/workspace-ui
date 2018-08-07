import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

import { jupyterhub } from '../api';


export default class Compute extends React.PureComponent {
  static propTypes = {
    servers: PropTypes.arrayOf(PropTypes.any),
  }

  static defaultProps = {
    servers: [],
  }

  render() {
    const { servers } = this.props;
    const huburl = jupyterhub.getHubUrl();

    const iconfunc = item => (item.pending ? faSpinner : (item.ready && faCheck) || faTimes);

    return (
      <div>
        <a href={`${huburl}/hub/home`} target="_blank">Jupyter Hub</a>
        <Table>
          <tbody>
            {
              servers.map(item => (
                <tr key={item.name}>
                  <td><a href={`${huburl}${item.url}`} target="_blank">{item.name || 'Server'}</a></td>
                  <td>{item.last_activity}</td>
                  <td>{item.started}</td>
                  <td><FontAwesomeIcon icon={iconfunc(item)} /></td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    );
  }
}
