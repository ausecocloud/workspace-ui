import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import ContentRow from './ContentRow';
import PathBar from './PathBar';


class Contents extends React.PureComponent {
  static defaultProps = {
    project: '',
    path: '',
    contents: [],
  }

  static propTypes = {
    project: PropTypes.string,
    path: PropTypes.string,
    contents: PropTypes.arrayOf(PropTypes.any),
    onClick: PropTypes.func.isRequired,
    // dispatch: PropTypes.func.isRequired,
  }

  onClick = (item) => {
    const { project, path, onClick } = this.props;
    if (item.content_type === 'application/directory') {
      onClick(project, [path, item.name].join('/'));
    }
  }

  onPath = (path) => {
    const { project, onClick } = this.props;
    onClick(project, path);
  }

  render() {
    const {
      project, path, contents,
    } = this.props;

    return (
      <Table hover>
        <thead>
          <tr>
            <th colSpan="2"><PathBar project={project} path={path} onClick={this.onPath} /></th>
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
            />))
          }
        </tbody>
      </Table>
    );
  }
}

export default Contents;
