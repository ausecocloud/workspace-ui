import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import ContentRow from './ContentRow';


class Contents extends React.PureComponent {
  static propTypes = {
    path: PropTypes.string,
    contents: PropTypes.arrayOf(PropTypes.any),
    onClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
  }

  static defaultProps = {
    path: '/',
    contents: [],
  }

  onClick = (item) => {
    const { path, onClick } = this.props;
    let newPath;
    if (item.content_type === 'application/directory') {
      if (path.endsWith('/')) {
        newPath = [path.slice(0, -1), item.name].join('/');
      } else {
        newPath = [path, item.name].join('/');
      }
      onClick(newPath);
    }
  }

  onDelete = (item) => {
    const { path, onDelete } = this.props;
    onDelete(path, item);
  }

  onDownload = (item) => {
    const { path, onDownload } = this.props;
    onDownload(path, item);
  }

  render() {
    const {
      contents,
    } = this.props;

    return (
      <Table>
        <thead>
          <tr>
            <th colSpan="2">Name</th>
            <th>Last modifed</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { contents.map(item => (
            <ContentRow
              item={item}
              key={item.name}
              onClick={this.onClick}
              onDelete={this.onDelete}
              onDownload={this.onDownload}
            />))
          }
        </tbody>
      </Table>
    );
  }
}

export default Contents;
