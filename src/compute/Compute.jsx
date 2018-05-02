import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';

import { jupyterhub } from '../api';


export default class Compute extends React.PureComponent {
  static defaultProps = {
    servers: [],
  }

  static propTypes = {
    servers: PropTypes.arrayOf(PropTypes.any),
  }

  render() {
    const { servers } = this.props;
    const huburl = jupyterhub.getHubUrl();

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
                  <td><FontAwesomeIcon icon={item.pending ? faSpinner : (item.ready && faCheck) || faTimes} /></td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    );
  }
}
