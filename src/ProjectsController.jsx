import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Input, InputGroup, InputGroupAddon, Label, Row, Col, Container } from 'reactstrap';
import ReduxBlockUi from 'react-block-ui/redux';
import 'react-block-ui/style.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faUpload from '@fortawesome/fontawesome-free-solid/faUpload';
import { Projects, Contents, PathBar, CreateProjectForm } from './projects';
import BasicModal from './BasicModal';
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
    onDeleteFolder: (project, path) => {
      dispatch(actions.deleteFolder({ project, path }));
    },
    onAddFile: (project, path, files) => {
      dispatch(actions.uploadFile({ project, path, files }));
    },
    onDeleteFile: (project, path, name) => {
      dispatch(actions.deleteFile({ project, path, name }));
    },
    onCreateProject: (name) => {
      dispatch(actions.createProject({ name }));
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
    onDeleteFolder: PropTypes.func.isRequired,
    onAddFile: PropTypes.func.isRequired,
    onDeleteFile: PropTypes.func.isRequired,
    onCreateProject: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  state = {
    addFolder: false,
    newFolder: '',
    addFile: false,
    newFile: [],
    projectModalActive: false,
    newProject: {},
  }

  componentDidMount() {
    this.props.dispatch(actions.projectsList());
  }

  onPath = (path) => {
    const { selected, onClick } = this.props;
    onClick(selected, path);
  }

  onDelete = (project, path, item) => {
    if (item.content_type === 'application/directory') {
      this.props.onDeleteFolder(project, [path, item.name].join('/'));
    } else {
      this.props.onDeleteFile(project, path, item.name);
    }
  }

  getNewProjectForm = (formstate) => {
    this.setState({ newProject: formstate });
  }

  toggleProjectModal = () => {
    this.setState({ projectModalActive: !this.state.projectModalActive });
  }

  newProjectSubmit = () => {
    const { onCreateProject } = this.props;
    const { newProject } = this.state;

    if (newProject) {
      onCreateProject(newProject.name);
    }
    this.setState({
      newProject: {},
    });

    // close modal
    this.setState({ projectModalActive: false });
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

  addFile = () => {
    const { selected, path, onAddFile } = this.props;
    const { addFile, newFile } = this.state;
    if (addFile) {
      // we hit the confirm button
      // validate input
      if (!newFile) {
        return;
      }
      onAddFile(selected, path, newFile);
      this.setState({
        addFile: false,
        newFile: [],
      });
    } else {
      this.setState({ addFile: true });
    }
  }

  cancelAddFile = () => this.setState({ addFile: false });

  changeNewFile = e => this.setState({ newFile: Array.from(e.target.files) });

  render() {
    const {
      projects, selected, contents, path,
      onChange, onClick,
    } = this.props;

    const {
      addFolder, newFolder,
      addFile, newFile,
    } = this.state;

    return (
      <Container>
        <Row>
          <Col>
            <Projects key="projects" selected={selected} projects={projects} onChange={onChange} />
            <Button color="success" onClick={this.toggleProjectModal}><FontAwesomeIcon icon={faPlusCircle} /> New Project</Button>
            <BasicModal
              title="Create A Project"
              desc="You can create a new project to organise your work using this form."
              submit={this.newProjectSubmit}
              active={this.state.projectModalActive}
              close={this.toggleProjectModal}
            >
              <CreateProjectForm data={this.getNewProjectForm} />
            </BasicModal>
          </Col>
        </Row>
        <ReduxBlockUi tag="div" block="CONTENTS/PATH" unblock={['CONTENTS/SUCCEEDED', 'CONTENTS/FAILED']} className="loader">
          <Row>
            <Col>
              <PathBar project={selected} path={path} onClick={this.onPath} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Contents key="contents" contents={contents} project={selected} path={path} onClick={onClick} onDelete={this.onDelete} />
            </Col>
          </Row>
          { addFolder &&
            <Row>
              <Col>
                <InputGroup key="folder">
                  <Input type="text" value={newFolder} onChange={this.changeNewFolder} required />
                  <InputGroupAddon addonType="append">
                    <Button color="primary" onClick={this.addFolder}><FontAwesomeIcon icon={faCheck} /></Button>
                    <Button color="danger" onClick={this.cancelAddFolder}><FontAwesomeIcon icon={faTimes} /></Button>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </Row>
          }
          { addFile &&
            <Row>
              <Col>
                <InputGroup key="file">
                  <Label for="uploads" className="btn btn-primary">Choose Files</Label>
                  <Input hidden id="uploads" type="file" onChange={this.changeNewFile} required />
                  <InputGroupAddon addonType="append">
                    <Button color="primary" onClick={this.addFile}><FontAwesomeIcon icon={faCheck} /></Button>
                    <Button color="danger" onClick={this.cancelAddFile}><FontAwesomeIcon icon={faTimes} /></Button>
                  </InputGroupAddon>
                </InputGroup>
                { newFile.map(file => (
                  <Row key={file.name}>
                    <Col>{file.name}</Col>
                  </Row>
                  ))
                }
              </Col>
            </Row>
          }
          { (!addFile && !addFolder) &&
            <Row>
              <Col>
                <Button key="addfolder" color="success" onClick={this.addFolder}><FontAwesomeIcon icon={faPlusCircle} /> Add Folder</Button>
                <Button key="uploadfile" color="success" onClick={this.addFile}><FontAwesomeIcon icon={faUpload} /> Upload File</Button>
              </Col>
            </Row>
          }
        </ReduxBlockUi>
      </Container>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectsController);
