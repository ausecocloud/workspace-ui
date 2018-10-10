import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';
import { faFolder } from '@fortawesome/free-solid-svg-icons/faFolder';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { formatDate, bytesToSize } from '../utils';


const iconMap = {
  'application/directory': faFolder,
};


function getIcon(type) {
  const icon = iconMap[type];
  if (!icon) {
    return faFile;
  }
  return icon;
}

export default
class ContentRow extends React.PureComponent {
  static propTypes = {
    item: PropTypes.objectOf(PropTypes.any),
    onClick: PropTypes.func,
    onDelete: PropTypes.func,
    onDownload: PropTypes.func,
  }

  static defaultProps = {
    item: {},
    onClick: null,
    onDelete: null,
    onDownload: null,
  }

  onClick = (e) => {
    const { item, onClick } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(item);
    }
  }

  onDelete = (e) => {
    const { item, onDelete } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(item);
    }
  }

  onDownload = (e) => {
    const { item, onDownload } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (onDownload) {
      onDownload(item);
    }
  }

  render() {
    const { item } = this.props;
    let lastMod = '';
    if (typeof item.last_modified !== 'undefined') {
      lastMod = formatDate(item.last_modified);
    }
    const size = bytesToSize(item.bytes);
    return (
      <tr key={item.name} onClick={this.onClick}>
        <td><FontAwesomeIcon icon={getIcon(item.content_type)} /></td>
        <td>{item.name}</td>
        <td>{lastMod}</td>
        <td>{size}</td>
        <td>
          { item.content_type !== 'application/directory' && <Button color="info" size="sm" onClick={this.onDownload} title="Download"><FontAwesomeIcon icon={faDownload} /></Button> }
          <Button color="danger" size="sm" onClick={this.onDelete} title="Delete"><FontAwesomeIcon icon={faTrash} /></Button>
        </td>
      </tr>
    );
  }
}
