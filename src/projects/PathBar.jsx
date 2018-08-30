import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import PathBarItem from './PathBarItem';


export default
class PathBar extends React.PureComponent {
  static propTypes = {
    path: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    path: '',
    onClick: null,
  }

  onClick = (path) => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(path);
    }
  }

  onHome = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.onClick('/');
  }

  render() {
    const { path } = this.props;
    const parts = path.split('/').filter(s => s);

    return (
      <Breadcrumb tag="nav">
        <BreadcrumbItem tag="a" href="#" onClick={this.onHome}><FontAwesomeIcon icon={faHome} /></BreadcrumbItem>
        {
          parts.map((part, idx) => (
            <PathBarItem key={part} path={`/${parts.slice(0, idx + 1).join('/')}`} name={part} onClick={this.onClick} />
          ))
        }
      </Breadcrumb>
    );
  }
}
