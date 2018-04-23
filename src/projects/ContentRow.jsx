import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faFile from '@fortawesome/fontawesome-free-solid/faFile';
import faFolder from '@fortawesome/fontawesome-free-solid/faFolder';
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash';


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
    static defaultProps = {
      item: {},
      onClick: null,
      onDelete: null,
    }

    static propTypes = {
      item: PropTypes.objectOf(PropTypes.any),
      onClick: PropTypes.func,
      onDelete: PropTypes.func,
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

    render() {
      const { item } = this.props;

      return (
        <tr key={item.name} onClick={this.onClick}>
          <th scope="row"><FontAwesomeIcon icon={getIcon(item.content_type)} /></th>
          <td>{item.name}</td>
          <td>{item.last_modified}</td>
          <td>{item.bytes}</td>
          <td>
            <Button color="danger" size="sm" onClick={this.onDelete}><FontAwesomeIcon icon={faTrash} /></Button>
          </td>
        </tr>
      );
    }
}

