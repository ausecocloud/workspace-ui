import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import { withRouter } from 'react-router-dom';
// TODO: this is the weird bit here, we import selectors from app root
//       that's the last bit that makes our components not reusable
import { getContents, getSelected, getPath } from '../reducers';
import ContentRow from './ContentRow';
import PathBar from './PathBar';
import * as actions from './actions';


function mapStateToProps(state) {
  const contents = getContents(state);
  const selected = getSelected(state);
  const path = getPath(state);
  if (contents) {
    return {
      contents,
      project: selected,
      path,
    };
  }
  return {
    contents: [],
    project: '',
    path: '',
  };
}


function mapDispatchToProps(dispatch) {
  return {
    onClick: (project, path) => {
      dispatch(actions.contentsPath({ project, path }));
    },
    // dispatch,
  };
}


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
    const { project, onClick } = this.props;
    if (item.content_type === 'application/directory') {
      onClick(project, item.name);
    }
  }

  onPath = (path) => {
    const { project, onClick } = this.props;
    console.log('Pathbar:', path);
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

const MappedContents = connect(mapStateToProps, mapDispatchToProps)(Contents);

export default withRouter(MappedContents);
