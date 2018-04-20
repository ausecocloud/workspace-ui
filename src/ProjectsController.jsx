import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Projects, Contents } from './projects';
import * as actions from './projects/actions';
import { getContents, getSelected, getProjects, getPath } from './reducers';


function mapStateToProps(state) {
  return {
    projects: getProjects(state),
    selected: getSelected(state),
    contents: getContents(state),
    path: getPath(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // projects
    onChange: project => dispatch(actions.projectsSelect({ project, path: '' })),
    // contents
    onClick: (project, path) => {
      dispatch(actions.contentsPath({ project, path }));
    },
    dispatch,
  };
}


class ProjectsController extends React.Component {
  static propTypes = {
    projects: PropTypes.arrayOf(PropTypes.any).isRequired,
    selected: PropTypes.string.isRequired,
    contents: PropTypes.arrayOf(PropTypes.any).isRequired,
    path: PropTypes.string.isRequired,
    // event handlers
    onChange: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.dispatch(actions.projectsList());
  }

  render() {
    const {
      projects, selected, contents, path,
      onChange, onClick,
    } = this.props;

    return (
      <div className="container">
        <Projects selected={selected} projects={projects} onChange={onChange} />
        <Contents contents={contents} project={selected} path={path} onClick={onClick} />
      </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectsController);
