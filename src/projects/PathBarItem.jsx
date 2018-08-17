import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { BreadcrumbItem } from 'reactstrap';


export default
class PathBarItem extends React.PureComponent {
  static propTypes = {
    path: PropTypes.string,
    name: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    path: '',
    name: '',
    onClick: null,
  }

  onClick = (e) => {
    const { onClick, path } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(path);
    }
  }

  render() {
    const { name } = this.props;

    return (
      <BreadcrumbItem tag="a" href="#" onClick={this.onClick}>{name}</BreadcrumbItem>
    );
  }
}
