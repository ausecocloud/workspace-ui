import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
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
    onChange: project => dispatch(actions.projectsSelect(project)),
    // contents
    onClick: (project, path) => {
      dispatch(actions.contentsPath({ project, path }));
    },
    onAddFolder: (project, path, folder) => {
      dispatch(actions.addFolder({ project, path, folder }));
    },
    onDelete: (project, path) => {
      dispatch(actions.deleteFolder({ project, path }));
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
    onAddFolder: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  state = {
    addFolder: false,
    newFolder: '',
  }

  componentDidMount() {
    this.props.dispatch(actions.projectsList());
  }

  addFolder = () => {
    const { selected, path, onAddFolder } = this.props;
    const { addFolder, newFolder } = this.state;
    if (addFolder) {
      // we hit the confirm button
      // validate input
      if (!newFolder) {
        return;
      }
      onAddFolder(selected, path, { name: newFolder });
      this.setState({
        addFolder: false,
        newFolder: '',
      });
    } else {
      this.setState({ addFolder: true });
    }
  }

  cancelAddFolder = () => this.setState({ addFolder: false });

  changeNewFolder = e => this.setState({ newFolder: e.target.value });

  render() {
    const {
      projects, selected, contents, path,
      onChange, onClick, onDelete,
    } = this.props;

    const {
      addFolder, newFolder,
    } = this.state;

    return (
      <div className="container">
        <Projects key="projects" selected={selected} projects={projects} onChange={onChange} />
        <Contents key="contents" contents={contents} project={selected} path={path} onClick={onClick} onDelete={onDelete} />
        { addFolder ? (
          <InputGroup key="input">
            <Input type="text" value={newFolder} onChange={this.changeNewFolder} required />
            <InputGroupAddon addonType="append">
              <Button color="primary" onClick={this.addFolder}><FontAwesomeIcon icon={faCheck} /></Button>
              <Button color="danger" onClick={this.cancelAddFolder}><FontAwesomeIcon icon={faTimes} /></Button>
            </InputGroupAddon>
          </InputGroup>
          ) : (
            <Button key="button" color="success" onClick={this.addFolder}><FontAwesomeIcon icon={faPlusCircle} /> Add Folder</Button>
          )
        }
      </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectsController);
