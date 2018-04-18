import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Breadcrumb } from 'reactstrap';
import PathBarItem from './PathBarItem';


export default
class PathBar extends React.PureComponent {
  static defaultProps = {
    path: '',
    onClick: null,
  }

  static propTypes = {
    project: PropTypes.string.isRequired,
    path: PropTypes.string,
    onClick: PropTypes.func,
  }

  onClick = (path) => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(path);
    }
  }

  render() {
    const { project, path } = this.props;
    const parts = path.split('/');

    return (
      <Breadcrumb tag="nav">
        <PathBarItem path="" name={project} onClick={this.onClick} />
        { parts.map((part, idx) => (
          <PathBarItem key={part} path={parts.slice(0, idx + 1).join('/')} name={part} onClick={this.onClick} />
          ))
        }
      </Breadcrumb>
    );
  }
}
